import { Link } from 'react-router-dom';
import { formatCurrency, routeLabel } from '../utils/formatters';
import { dummyBuses } from '../utils/constants';

function hashCode(str) {
  if (!str) return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export default function BusCard({ bus }) {
  const hasImage = typeof bus.image === 'string' && bus.image.trim();
  const imageSrc = hasImage
    ? bus.image
    : dummyBuses[hashCode(bus._id || bus.busNumber || bus.busName) % dummyBuses.length].image;

  return (
    <div className="glass-card overflow-hidden rounded-3xl transition duration-300 hover:-translate-y-1">
      <img src={imageSrc} alt={bus.busName} className="h-52 w-full object-cover opacity-90" />
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-white">{bus.busName}</h3>
            <p className="text-sm text-slate-300">{routeLabel(bus)}</p>
          </div>
          <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs text-violet-200">{bus.busType}</span>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
          <span>{bus.departureTime}</span>
          <span>{bus.arrivalTime}</span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Price</p>
            <p className="text-2xl font-semibold text-white">{formatCurrency(bus.price)}</p>
          </div>
          <Link to={`/buses/${bus._id}`} className="btn-secondary">View Details</Link>
        </div>
      </div>
    </div>
  );
}