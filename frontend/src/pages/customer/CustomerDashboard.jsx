import { FiTruck, FiCalendar, FiCreditCard, FiUser } from 'react-icons/fi';
import StatCard from '../../components/StatCard';

export default function CustomerDashboard() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold text-white">Customer Dashboard</h1>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Bookings" value="12" icon={<FiTruck />} hint="Your travel history" />
        <StatCard label="Upcoming trips" value="3" icon={<FiCalendar />} hint="Reserved seats" />
        <StatCard label="Payments" value="PKR 18,400" icon={<FiCreditCard />} hint="Advance tracked" />
        <StatCard label="Profile completion" value="92%" icon={<FiUser />} hint="Complete your details" />
      </div>
    </div>
  );
}