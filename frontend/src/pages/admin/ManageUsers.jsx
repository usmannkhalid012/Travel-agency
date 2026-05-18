import PageHeader from '../../components/PageHeader';
import { useEffect, useState } from 'react';
import { getAllUsers, deleteUser } from '../../services/userService';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers({});
      setUsers(res.data || []);
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await deleteUser(id);
      toast.success('User deleted');
      setUsers((s) => s.filter((u) => u._id !== id));
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Manage Users" subtitle="Review roles, profiles, and account activity." />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="table-shell">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
            <thead className="table-head">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr className="table-row"><td colSpan={4} className="text-center text-slate-300">No users found.</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="table-row">
                    <td>{user.name || user.email}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td><button onClick={() => handleDelete(user._id)} className="text-rose-300 hover:text-rose-200">Delete</button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}