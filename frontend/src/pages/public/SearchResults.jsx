import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import LoadingSpinner from '../../components/LoadingSpinner';
import BusCard from '../../components/BusCard';
import Pagination from '../../components/Pagination';
import { fetchBuses } from '../../services/busService';
import { dummyBuses } from '../../utils/constants';

export default function SearchResults() {
  const [params, setParams] = useSearchParams();
  const [buses, setBuses] = useState(dummyBuses);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: params.get('search') || '',
    departureCity: params.get('departureCity') || '',
    arrivalCity: params.get('arrivalCity') || '',
    busType: params.get('busType') || '',
    sortBy: params.get('sortBy') || '-createdAt'
  });

  const load = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetchBuses({ ...filters, page, limit: 9 });
      setBuses(response.data.length ? response.data : dummyBuses);
      setMeta(response.meta || { page, totalPages: 1 });
    } catch {
      setBuses(dummyBuses);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1); }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const next = new URLSearchParams(filters);
    setParams(next);
    load(1);
  };

  return (
    <div className="section-padding mx-auto max-w-7xl">
      <PageHeader title="Search Buses" subtitle="Filter, sort, and compare available buses across your preferred route." />
      <form onSubmit={handleSubmit} className="glass-card grid gap-3 rounded-3xl p-5 lg:grid-cols-5">
        <input className="input-field lg:col-span-2" placeholder="Search bus or route" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        <input className="input-field" placeholder="Departure city" value={filters.departureCity} onChange={(e) => setFilters({ ...filters, departureCity: e.target.value })} />
        <input className="input-field" placeholder="Arrival city" value={filters.arrivalCity} onChange={(e) => setFilters({ ...filters, arrivalCity: e.target.value })} />
        <select className="input-field" value={filters.sortBy} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}>
          <option value="-createdAt">Newest</option>
          <option value="price">Price low-high</option>
          <option value="-price">Price high-low</option>
        </select>
        <button className="btn-primary lg:col-span-5">Apply filters</button>
      </form>
      {loading ? <LoadingSpinner /> : <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{buses.map((bus) => <BusCard key={bus._id} bus={bus} />)}</div>}
      <Pagination page={meta.page || 1} totalPages={meta.totalPages || 1} onPageChange={(page) => load(page)} />
    </div>
  );
}