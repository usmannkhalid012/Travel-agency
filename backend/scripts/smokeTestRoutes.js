/* eslint-disable no-console */

const path = require('path');
const mongoose = require('mongoose');

// Load backend/.env regardless of current working directory
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const connectDB = require('../config/db');
const app = require('../app');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const readJsonSafe = async (res) => {
  const text = await res.text();
  try {
    return { json: JSON.parse(text), text };
  } catch {
    return { json: null, text };
  }
};

const request = async (baseUrl, method, route, { token, body } = {}) => {
  const headers = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${baseUrl}${route}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  const { json, text } = await readJsonSafe(res);
  return { res, json, text };
};

const expectStatusIn = (actual, allowed, label, { json, text } = {}) => {
  if (!allowed.includes(actual)) {
    const extra = json ? JSON.stringify(json) : String(text).slice(0, 500);
    throw new Error(`${label}: expected status in [${allowed.join(',')}], got ${actual}. Response: ${extra}`);
  }
};

const expectNot404 = (actual, label, { json, text } = {}) => {
  if (actual === 404) {
    const extra = json ? JSON.stringify(json) : String(text).slice(0, 500);
    throw new Error(`${label}: returned 404 (route missing). Response: ${extra}`);
  }
};

const pickToken = (json) => json?.meta?.token || null;

(async () => {
  let server;

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not set (required for auth route tests).');
    }

    await connectDB();

    server = app.listen(0);
    await new Promise((resolve) => server.once('listening', resolve));

    const { port } = server.address();
    const baseUrl = `http://127.0.0.1:${port}`;

    // give Express a tiny moment on Windows
    await sleep(50);

    const stamp = Date.now();
    const customer = {
      name: 'Smoke Customer',
      email: `smoke.customer.${stamp}@example.com`,
      password: 'Password123!',
      phone: '03001234567'
    };
    const admin = {
      name: 'Smoke Admin',
      email: `smoke.admin.${stamp}@example.com`,
      password: 'Password123!',
      phone: '03007654321',
      role: 'admin'
    };

    const results = [];
    const run = async (label, fn) => {
      try {
        await fn();
        results.push({ label, ok: true });
        console.log(`PASS ${label}`);
      } catch (err) {
        results.push({ label, ok: false, error: err.message });
        console.error(`FAIL ${label}: ${err.message}`);
      }
    };

    let customerToken;
    let adminToken;
    let customerId;
    let adminId;
    let busId;
    let bookingId;

    await run('GET /', async () => {
      const { res, json, text } = await request(baseUrl, 'GET', '/');
      expectStatusIn(res.status, [200], 'GET /', { json, text });
    });

    await run('GET /api/health', async () => {
      const { res, json, text } = await request(baseUrl, 'GET', '/api/health');
      expectStatusIn(res.status, [200], 'GET /api/health', { json, text });
    });

    await run('GET /api/buses/popular-routes', async () => {
      const { res, json, text } = await request(baseUrl, 'GET', '/api/buses/popular-routes');
      expectNot404(res.status, 'GET /api/buses/popular-routes', { json, text });
      expectStatusIn(res.status, [200], 'GET /api/buses/popular-routes', { json, text });
    });

    await run('GET /api/buses', async () => {
      const { res, json, text } = await request(baseUrl, 'GET', '/api/buses');
      expectNot404(res.status, 'GET /api/buses', { json, text });
      expectStatusIn(res.status, [200], 'GET /api/buses', { json, text });
    });

    await run('GET /api/debug/token (no token -> 400)', async () => {
      const { res, json, text } = await request(baseUrl, 'GET', '/api/debug/token');
      expectNot404(res.status, 'GET /api/debug/token', { json, text });
      expectStatusIn(res.status, [400], 'GET /api/debug/token', { json, text });
    });

    await run('POST /api/auth/forgot-password (unknown email -> 404)', async () => {
      const { res, json, text } = await request(baseUrl, 'POST', '/api/auth/forgot-password', {
        body: { email: `does.not.exist.${stamp}@example.com` }
      });
      expectStatusIn(res.status, [404], 'POST /api/auth/forgot-password', { json, text });
    });

    await run('POST /api/auth/reset-password/:token (invalid -> 400)', async () => {
      const { res, json, text } = await request(baseUrl, 'POST', `/api/auth/reset-password/invalid-${stamp}` , {
        body: { password: 'Password123!' }
      });
      expectNot404(res.status, 'POST /api/auth/reset-password/:token', { json, text });
      expectStatusIn(res.status, [400], 'POST /api/auth/reset-password/:token', { json, text });
    });

    await run('POST /api/auth/register (customer)', async () => {
      const { res, json, text } = await request(baseUrl, 'POST', '/api/auth/register', { body: customer });
      expectNot404(res.status, 'POST /api/auth/register (customer)', { json, text });
      expectStatusIn(res.status, [201], 'POST /api/auth/register (customer)', { json, text });
      customerId = json?.data?._id;
    });

    await run('POST /api/auth/register (admin)', async () => {
      const { res, json, text } = await request(baseUrl, 'POST', '/api/auth/register', { body: admin });
      expectNot404(res.status, 'POST /api/auth/register (admin)', { json, text });
      expectStatusIn(res.status, [201], 'POST /api/auth/register (admin)', { json, text });
      adminId = json?.data?._id;
    });

    await run('POST /api/auth/login (customer)', async () => {
      const { res, json, text } = await request(baseUrl, 'POST', '/api/auth/login', {
        body: { email: customer.email, password: customer.password, rememberMe: false }
      });
      expectNot404(res.status, 'POST /api/auth/login (customer)', { json, text });
      expectStatusIn(res.status, [200], 'POST /api/auth/login (customer)', { json, text });
      customerToken = pickToken(json);
      if (!customerToken) throw new Error('No token returned in meta.token (ensure NODE_ENV is not production).');
    });

    await run('POST /api/auth/login (admin)', async () => {
      const { res, json, text } = await request(baseUrl, 'POST', '/api/auth/login', {
        body: { email: admin.email, password: admin.password, rememberMe: false }
      });
      expectNot404(res.status, 'POST /api/auth/login (admin)', { json, text });
      expectStatusIn(res.status, [200], 'POST /api/auth/login (admin)', { json, text });
      adminToken = pickToken(json);
      if (!adminToken) throw new Error('No token returned in meta.token (ensure NODE_ENV is not production).');
    });

    await run('GET /api/debug/token (with bearer -> 200)', async () => {
      const { res, json, text } = await request(baseUrl, 'GET', '/api/debug/token', { token: customerToken });
      expectNot404(res.status, 'GET /api/debug/token (auth)', { json, text });
      expectStatusIn(res.status, [200], 'GET /api/debug/token (auth)', { json, text });
    });

    await run('GET /api/auth/me (protected)', async () => {
      const { res, json, text } = await request(baseUrl, 'GET', '/api/auth/me', { token: customerToken });
      expectNot404(res.status, 'GET /api/auth/me', { json, text });
      expectStatusIn(res.status, [200], 'GET /api/auth/me', { json, text });
    });

    await run('POST /api/auth/logout', async () => {
      const { res, json, text } = await request(baseUrl, 'POST', '/api/auth/logout');
      expectNot404(res.status, 'POST /api/auth/logout', { json, text });
      expectStatusIn(res.status, [200], 'POST /api/auth/logout', { json, text });
    });

    await run('GET /api/users/me (protected)', async () => {
      const { res, json, text } = await request(baseUrl, 'GET', '/api/users/me', { token: customerToken });
      expectNot404(res.status, 'GET /api/users/me', { json, text });
      expectStatusIn(res.status, [200], 'GET /api/users/me', { json, text });
    });

    await run('PUT /api/users/me (protected)', async () => {
      const { res, json, text } = await request(baseUrl, 'PUT', '/api/users/me', {
        token: customerToken,
        body: { name: 'Smoke Customer Updated', phone: '03009998888' }
      });
      expectNot404(res.status, 'PUT /api/users/me', { json, text });
      expectStatusIn(res.status, [200], 'PUT /api/users/me', { json, text });
    });

    await run('GET /api/users (customer -> 403)', async () => {
      const { res, json, text } = await request(baseUrl, 'GET', '/api/users', { token: customerToken });
      expectNot404(res.status, 'GET /api/users (customer)', { json, text });
      expectStatusIn(res.status, [403], 'GET /api/users (customer)', { json, text });
    });

    await run('GET /api/users (admin -> 200)', async () => {
      const { res, json, text } = await request(baseUrl, 'GET', '/api/users', { token: adminToken });
      expectNot404(res.status, 'GET /api/users (admin)', { json, text });
      expectStatusIn(res.status, [200], 'GET /api/users (admin)', { json, text });
    });

    await run('POST /api/buses (customer -> 403)', async () => {
      const { res, json, text } = await request(baseUrl, 'POST', '/api/buses', {
        token: customerToken,
        body: {
          busName: 'Smoke Bus',
          busNumber: `SMK-${stamp}`,
          driverName: 'Driver',
          route: 'A-B',
          departureCity: 'CityA',
          arrivalCity: 'CityB',
          departureTime: '10:00',
          arrivalTime: '14:00',
          totalSeats: 40,
          price: 1200
        }
      });
      expectNot404(res.status, 'POST /api/buses (customer)', { json, text });
      expectStatusIn(res.status, [403], 'POST /api/buses (customer)', { json, text });
    });

    await run('POST /api/buses (admin -> 201)', async () => {
      const { res, json, text } = await request(baseUrl, 'POST', '/api/buses', {
        token: adminToken,
        body: {
          busName: 'Smoke Bus',
          busNumber: `SMK-${stamp}`,
          driverName: 'Driver',
          route: 'CityA - CityB',
          departureCity: 'CityA',
          arrivalCity: 'CityB',
          departureTime: '10:00',
          arrivalTime: '14:00',
          totalSeats: 40,
          price: 1200,
          amenities: ['AC']
        }
      });
      expectNot404(res.status, 'POST /api/buses (admin)', { json, text });
      expectStatusIn(res.status, [201], 'POST /api/buses (admin)', { json, text });
      busId = json?.data?._id;
      if (!busId) throw new Error('Missing created bus id');
    });

    await run('GET /api/buses/:id', async () => {
      const { res, json, text } = await request(baseUrl, 'GET', `/api/buses/${busId}`);
      expectNot404(res.status, 'GET /api/buses/:id', { json, text });
      expectStatusIn(res.status, [200], 'GET /api/buses/:id', { json, text });
    });

    await run('PUT /api/buses/:id (admin)', async () => {
      const { res, json, text } = await request(baseUrl, 'PUT', `/api/buses/${busId}`, {
        token: adminToken,
        body: { busName: 'Smoke Bus Updated', price: 1300 }
      });
      expectNot404(res.status, 'PUT /api/buses/:id', { json, text });
      expectStatusIn(res.status, [200], 'PUT /api/buses/:id', { json, text });
    });

    await run('POST /api/bookings (customer -> 201)', async () => {
      const { res, json, text } = await request(baseUrl, 'POST', '/api/bookings', {
        token: customerToken,
        body: {
          busId,
          seatNumber: '1',
          customerCNIC: '35202-1234567-1',
          customerPhone: '03001234567',
          advancePayment: 200
        }
      });
      expectNot404(res.status, 'POST /api/bookings', { json, text });
      expectStatusIn(res.status, [201], 'POST /api/bookings', { json, text });
      bookingId = json?.data?._id;
      if (!bookingId) throw new Error('Missing created booking id');
    });

    await run('GET /api/bookings/me (customer)', async () => {
      const { res, json, text } = await request(baseUrl, 'GET', '/api/bookings/me', { token: customerToken });
      expectNot404(res.status, 'GET /api/bookings/me', { json, text });
      expectStatusIn(res.status, [200], 'GET /api/bookings/me', { json, text });
    });

    await run('GET /api/bookings (customer -> 403)', async () => {
      const { res, json, text } = await request(baseUrl, 'GET', '/api/bookings', { token: customerToken });
      expectNot404(res.status, 'GET /api/bookings (customer)', { json, text });
      expectStatusIn(res.status, [403], 'GET /api/bookings (customer)', { json, text });
    });

    await run('GET /api/bookings (admin -> 200)', async () => {
      const { res, json, text } = await request(baseUrl, 'GET', '/api/bookings', { token: adminToken });
      expectNot404(res.status, 'GET /api/bookings (admin)', { json, text });
      expectStatusIn(res.status, [200], 'GET /api/bookings (admin)', { json, text });
    });

    await run('PATCH /api/bookings/:id/approval (admin -> 200)', async () => {
      const { res, json, text } = await request(baseUrl, 'PATCH', `/api/bookings/${bookingId}/approval`, {
        token: adminToken,
        body: { status: 'approved', note: 'smoke test approval' }
      });
      expectNot404(res.status, 'PATCH /api/bookings/:id/approval', { json, text });
      expectStatusIn(res.status, [200], 'PATCH /api/bookings/:id/approval', { json, text });
    });

    await run('PATCH /api/bookings/:id/cancel (customer -> 200)', async () => {
      const { res, json, text } = await request(baseUrl, 'PATCH', `/api/bookings/${bookingId}/cancel`, {
        token: customerToken
      });
      expectNot404(res.status, 'PATCH /api/bookings/:id/cancel', { json, text });
      expectStatusIn(res.status, [200], 'PATCH /api/bookings/:id/cancel', { json, text });
    });

    await run('DELETE /api/buses/:id (admin -> 200)', async () => {
      const { res, json, text } = await request(baseUrl, 'DELETE', `/api/buses/${busId}`, { token: adminToken });
      expectNot404(res.status, 'DELETE /api/buses/:id', { json, text });
      expectStatusIn(res.status, [200], 'DELETE /api/buses/:id', { json, text });
    });

    await run('GET /api/does-not-exist (should be 404)', async () => {
      const { res, json, text } = await request(baseUrl, 'GET', '/api/does-not-exist');
      expectStatusIn(res.status, [404], 'GET /api/does-not-exist', { json, text });
    });

    // Cleanup users (best-effort)
    await run('DELETE /api/users/:id (delete customer, admin)', async () => {
      if (!customerId || !adminId) return;
      const r1 = await request(baseUrl, 'DELETE', `/api/users/${customerId}`, { token: adminToken });
      expectNot404(r1.res.status, 'DELETE /api/users/:id (customer)', r1);
      expectStatusIn(r1.res.status, [200, 404], 'DELETE /api/users/:id (customer)', r1); // allow already deleted

      const r2 = await request(baseUrl, 'DELETE', `/api/users/${adminId}`, { token: adminToken });
      expectNot404(r2.res.status, 'DELETE /api/users/:id (admin)', r2);
      expectStatusIn(r2.res.status, [200, 404], 'DELETE /api/users/:id (admin)', r2);
    });

    const failed = results.filter((r) => !r.ok);
    console.log('---');
    console.log(`Route smoke test done: ${results.length - failed.length}/${results.length} passed.`);

    if (failed.length) {
      console.error('Failures:');
      for (const f of failed) console.error(`- ${f.label}: ${f.error}`);
      process.exitCode = 1;
    }
  } catch (err) {
    console.error(err?.stack || err?.message || String(err));
    process.exitCode = 1;
  } finally {
    try {
      if (server) {
        await new Promise((resolve) => server.close(resolve));
      }
    } catch (e) {
      // ignore
    }

    try {
      if (mongoose.connection?.readyState === 1) {
        await mongoose.disconnect();
      }
    } catch (e) {
      // ignore
    }
  }
})();
