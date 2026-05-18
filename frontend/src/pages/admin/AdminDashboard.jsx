import { FiDollarSign, FiUsers, FiTruck, FiClipboard } from 'react-icons/fi';
import StatCard from '../../components/StatCard';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold text-white">Admin Dashboard</h1>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total buses" value="24" icon={<FiTruck />} />
        <StatCard label="Total bookings" value="184" icon={<FiClipboard />} />
        <StatCard label="Total users" value="92" icon={<FiUsers />} />
        <StatCard label="Revenue" value="PKR 2.4M" icon={<FiDollarSign />} />
      </div>
    </div>
  );
}