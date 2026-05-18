import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import { fetchMyBookings } from '../../services/bookingService';
import { formatDate } from '../../utils/formatters';

export default function MyBookings() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchMyBookings();
        setRows(response.data || []);
      } catch (error) {
        toast.error(typeof error === 'string' ? error : 'Failed to load your bookings');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-white">My Bookings</h1>

      {loading ? <LoadingSpinner label="Loading your bookings..." /> : (
        <>
          <div className="grid gap-4 md:hidden">
            {rows.map((row) => (
              <div key={row._id} className="glass-card rounded-3xl p-4 space-y-2">
                <h3 className="font-semibold text-white">{row.bus?.busName || 'Bus'}</h3>
                <p className="text-sm text-slate-300">Seat {row.seatNumber}</p>
                <p className="text-xs text-slate-400">Payment: {row.paymentStatus}</p>
                <p className="text-xs text-slate-400">Approval: {row.approvalStatus}</p>
                <p className="text-xs text-slate-400">{formatDate(row.createdAt)}</p>
              </div>
            ))}
          </div>

          <div className="table-shell hidden md:block">
            <table className="w-full text-left">
              <thead className="table-head">
                <tr>
                  <th>Bus</th>
                  <th>Seat</th>
                  <th>Payment</th>
                  <th>Approval</th>
                  <th>Ticket</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row._id} className="table-row">
                    <td>{row.bus?.busName || '-'}</td>
                    <td>{row.seatNumber}</td>
                    <td>{row.paymentStatus}</td>
                    <td>{row.approvalStatus}</td>
                    <td>{row.ticketStatus}</td>
                    <td>{formatDate(row.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {rows.length === 0 && (
            <div className="glass-card rounded-3xl p-8 text-center text-slate-300">No bookings found yet.</div>
          )}
        </>
      )}
    </div>
  );
}