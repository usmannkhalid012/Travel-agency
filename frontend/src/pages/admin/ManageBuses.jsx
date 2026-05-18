import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageHeader from '../../components/PageHeader';
import LoadingSpinner from '../../components/LoadingSpinner';
import { loadBuses, deleteBusAsync } from '../../redux/slices/busSlice';

export default function ManageBuses() {
  const dispatch = useDispatch();
  const { list, status, deleteStatus, deleteError } = useSelector((state) => state.buses);

  useEffect(() => {
    dispatch(loadBuses({ limit: 50 }));
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this bus?')) return;
    try {
      await dispatch(deleteBusAsync(id)).unwrap();
      dispatch(loadBuses({ limit: 50 }));
    } catch (err) {
      // ignore - slice will contain error
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Manage Buses" subtitle="Create, update, and delete fleet records." action={<Link to="/admin/buses/add" className="btn-primary">Add bus</Link>} />

      {status === 'loading' ? <LoadingSpinner label="Loading buses..." /> : (
        <div className="table-shell">
          <table className="w-full text-left">
            <thead className="table-head">
              <tr>
                <th>Bus</th>
                <th>Route</th>
                <th>Seats</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(list || []).map((bus) => (
                <tr key={bus._id} className="table-row">
                  <td>{bus.busName}</td>
                  <td>{bus.departureCity} to {bus.arrivalCity}</td>
                  <td>{(bus.totalSeats || bus.availableSeats) ? `${bus.availableSeats || 0}/${bus.totalSeats || '-'} ` : '-'}</td>
                  <td>PKR {bus.price}</td>
                  <td className="space-x-3">
                    <Link to={`/admin/buses/${bus._id}/edit`} className="text-violet-300 hover:text-white">Edit</Link>
                    <button onClick={() => handleDelete(bus._id)} className="text-rose-300 hover:text-rose-200">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteStatus === 'failed' && <div className="text-rose-400">{deleteError}</div>}
    </div>
  );
}