import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiClock, FiStar, FiSearch } from 'react-icons/fi';
import { fetchPopularRoutes, fetchBuses } from '../../services/busService';
import { useSelector } from 'react-redux';
import BusCard from '../../components/BusCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { dummyBuses, testimonials } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

export default function Home() {
  const [buses, setBuses] = useState(dummyBuses);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ departureCity: '', arrivalCity: '' });
  const featuredImage = buses[0]?.image?.trim() || dummyBuses[0].image;
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const load = async () => {
      try {
        const [routesRes, busesRes] = await Promise.all([fetchPopularRoutes().catch(() => null), fetchBuses({ limit: 6 }).catch(() => null)]);
        if (routesRes?.data) setRoutes(routesRes.data);
        if (busesRes?.data) setBuses(busesRes.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <section className="section-padding relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-violet-200">Modern Travel Agency System</span>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight md:text-6xl">Elegant bus booking with premium dashboard control.</h1>
              <p className="max-w-2xl text-lg text-slate-300">Search, compare, and reserve bus seats with a smooth modern interface for customers and a powerful admin experience for operators.</p>
            </div>
            <form className="glass-card grid gap-3 rounded-3xl p-4 md:grid-cols-[1fr_1fr_auto]">
              <input className="input-field" placeholder="Departure city" value={search.departureCity} onChange={(e) => setSearch({ ...search, departureCity: e.target.value })} />
              <input className="input-field" placeholder="Arrival city" value={search.arrivalCity} onChange={(e) => setSearch({ ...search, arrivalCity: e.target.value })} />
              <Link to={`/search?departureCity=${search.departureCity}&arrivalCity=${search.arrivalCity}`} className="btn-primary gap-2"><FiSearch /> Search buses</Link>
            </form>
            <div className="flex flex-wrap gap-3">
              <Link to="/search" className="btn-primary gap-2"><FiArrowRight /> Explore buses</Link>
              {!user && (
                <Link to="/register" className="btn-secondary">Create account</Link>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['Secure payments', FiShield],
                ['Real-time seats', FiClock],
                ['Top rated routes', FiStar]
              ].map(([label, Icon]) => (
                <div key={label} className="glass-card rounded-3xl p-4">
                  <Icon className="text-2xl text-violet-300" />
                  <p className="mt-3 text-sm text-slate-300">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card rounded-[2rem] p-5 shadow-glow">
            <img src={featuredImage} alt="Featured bus" className="h-80 w-full rounded-[1.5rem] object-cover" />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/5 p-4">
                <p className="text-sm text-slate-400">Starting from</p>
                <p className="mt-2 text-3xl font-semibold text-white">{formatCurrency(buses[0]?.price || dummyBuses[0].price)}</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-4">
                <p className="text-sm text-slate-400">Available seats</p>
                <p className="mt-2 text-3xl font-semibold text-white">{buses[0]?.availableSeats || dummyBuses[0].availableSeats}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Popular routes</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Trending destinations</h2>
            </div>
            <Link to="/search" className="text-sm text-violet-200 hover:text-white">View all</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {(routes.length ? routes : [
              { _id: { departureCity: 'Karachi', arrivalCity: 'Lahore' }, count: 8 },
              { _id: { departureCity: 'Islamabad', arrivalCity: 'Karachi' }, count: 6 },
              { _id: { departureCity: 'Lahore', arrivalCity: 'Multan' }, count: 4 }
            ]).map((route, index) => (
              <div key={index} className="glass-card rounded-3xl p-5">
                <p className="text-sm text-slate-400">Route</p>
                <h3 className="mt-2 text-xl font-semibold text-white">{route._id?.departureCity || 'Karachi'} to {route._id?.arrivalCity || 'Lahore'}</h3>
                <p className="mt-3 text-violet-200">{route.count || 8} active buses</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Featured buses</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Premium fleet</h2>
          </div>
          {loading ? <LoadingSpinner /> : <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{buses.map((bus) => <BusCard key={bus._id} bus={bus} />)}</div>}
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.name} className="glass-card rounded-3xl p-6">
              <p className="text-slate-200">{item.text}</p>
              <div className="mt-6">
                <p className="font-semibold text-white">{item.name}</p>
                <p className="text-sm text-slate-400">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}