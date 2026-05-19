/* eslint-disable no-console */

// Usage:
//   node scripts/testRemoteBackend.js https://your-backend.vercel.app/api

const base = process.argv[2] || 'https://travel-agency-backend-pearl.vercel.app/api';

const fetchWithTimeout = async (url, options = {}, timeoutMs = 15000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(new Error('Request timed out')), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
};

const safePreview = (text) => {
  const s = String(text || '');
  return s.length > 800 ? s.slice(0, 800) + '…' : s;
};

(async () => {
  const stamp = Date.now();

  const healthRes = await fetchWithTimeout(`${base}/health`, {
    headers: { accept: 'application/json' }
  });
  const healthText = await healthRes.text();
  console.log('GET /health ->', healthRes.status);
  console.log(safePreview(healthText));

  const payload = {
    name: 'Remote Smoke',
    email: `remote.smoke.${stamp}@example.com`,
    password: 'Password123!',
    phone: '03001234567'
  };

  const regRes = await fetchWithTimeout(`${base}/auth/register`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify(payload)
  }, 20000);

  const regText = await regRes.text();
  console.log('POST /auth/register ->', regRes.status);
  console.log(safePreview(regText));

  if (!healthRes.ok || !regRes.ok) process.exitCode = 1;
})().catch((err) => {
  console.error(err?.stack || err?.message || String(err));
  process.exitCode = 1;
});
