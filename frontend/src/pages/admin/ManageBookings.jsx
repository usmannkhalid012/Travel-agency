import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PageHeader from '../../components/PageHeader';
import LoadingSpinner from '../../components/LoadingSpinner';
import { fetchAllBookings, updateBookingApproval } from '../../services/bookingService';
import { formatDate } from '../../utils/formatters';

export default function ManageBookings() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState('');

  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await fetchAllBookings();
      setRows(response.data || []);
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleReview = async (id, status) => {
    setBusyId(id);
    try {
      await updateBookingApproval(id, { status });
      toast.success(`Booking ${status} successfully`);
      await loadBookings();
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Unable to update booking');
    } finally {
      setBusyId('');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Manage Bookings" subtitle="Track requests and approve or reject customer seat bookings." />

      {loading ? <LoadingSpinner label="Loading booking requests..." /> : (
        <>
          <div className="grid gap-4 md:hidden">
            {rows.map((row) => (
              <div key={row._id} className="glass-card rounded-3xl p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-white">{row.user?.name || 'Customer'}</h3>
                  <span className="text-xs rounded-full border border-white/15 bg-white/5 px-2 py-1 text-slate-300">{row.approvalStatus}</span>
                </div>
                <p className="text-sm text-slate-300">{row.bus?.busName || 'Bus'} • Seat {row.seatNumber}</p>
                <p className="text-xs text-slate-400">{formatDate(row.createdAt)} • Payment: {row.paymentStatus}</p>
                <div className="flex gap-2">
                  <button
                    className="btn-primary flex-1 disabled:opacity-50"
                    disabled={row.approvalStatus !== 'pending' || busyId === row._id}
                    onClick={() => handleReview(row._id, 'approved')}
                  >
                    Approve
                  </button>
                  <button
                    className="btn-secondary flex-1 disabled:opacity-50"
                    disabled={row.approvalStatus !== 'pending' || busyId === row._id}
                    onClick={() => handleReview(row._id, 'rejected')}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="table-shell hidden md:block">
            <table className="w-full text-left">
              <thead className="table-head">
                <tr>
                  <th>Customer</th>
                  <th>Bus</th>
                  <th>Seat</th>
                  <th>Payment</th>
                  <th>Approval</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row._id} className="table-row">
                    <td>{row.user?.name || 'Customer'}</td>
                    <td>{row.bus?.busName || '-'}</td>
                    <td>{row.seatNumber}</td>
                    <td>{row.paymentStatus}</td>
                    <td>{row.approvalStatus}</td>
                    <td>{formatDate(row.createdAt)}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="rounded-xl bg-emerald-500/20 px-3 py-2 text-xs text-emerald-200 disabled:opacity-50"
                          disabled={row.approvalStatus !== 'pending' || busyId === row._id}
                          onClick={() => handleReview(row._id, 'approved')}
                        >
                          Approve
                        </button>
                        <button
                          className="rounded-xl bg-rose-500/20 px-3 py-2 text-xs text-rose-200 disabled:opacity-50"
                          disabled={row.approvalStatus !== 'pending' || busyId === row._id}
                          onClick={() => handleReview(row._id, 'rejected')}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!loading && rows.length === 0 && (
        <div className="glass-card rounded-3xl p-8 text-center text-slate-300">
          No booking requests found.
        </div>
      )}
    </div>
  );
}