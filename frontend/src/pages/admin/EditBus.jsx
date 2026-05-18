import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import LoadingSpinner from '../../components/LoadingSpinner';
import { fetchBus } from '../../services/busService';
import { useDispatch } from 'react-redux';
import { updateBusAsync } from '../../redux/slices/busSlice';
import toast from 'react-hot-toast';
import { setBusImage } from '../../redux/slices/busSlice';

export default function EditBus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});
  const [image, setImage] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchBus(id);
        setBus(res.data);
        setForm({
          busName: res.data.busName || '',
          busNumber: res.data.busNumber || '',
          driverName: res.data.driverName || '',
          route: res.data.route || '',
          departureCity: res.data.departureCity || '',
          arrivalCity: res.data.arrivalCity || '',
          departureTime: res.data.departureTime || '',
          arrivalTime: res.data.arrivalTime || '',
          totalSeats: res.data.totalSeats || '',
          price: res.data.price || '',
          amenities: (res.data.amenities || []).join(', '),
          busType: res.data.busType || 'Economy',
          status: res.data.status || 'active'
        });
      } catch (err) {
        toast.error('Unable to load bus');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => setImage(e.target.files[0] || null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    Object.entries(form).forEach(([k, v]) => payload.append(k, v));
    if (image) payload.append('image', image);
    try {
      const result = await dispatch(updateBusAsync({ id, payload })).unwrap();
      // If backend didn't return an image but user provided one, set preview optimistically
      if (result && !result.data.image && image) {
        // create local preview URL
        const preview = URL.createObjectURL(image);
        dispatch(setBusImage({ id, image: preview }));
      }
      toast.success('Bus updated');
      navigate('/admin/buses');
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Update failed');
    }
  };

  if (loading) return <LoadingSpinner label="Loading bus..." />;
  if (!bus) return <div className="section-padding">Bus not found</div>;

  return (
    <div className="max-w-5xl space-y-6">
      <PageHeader title="Edit Bus" subtitle={`Update fleet record ${id}.`} />
      <form className="glass-card grid gap-4 rounded-3xl p-6 md:grid-cols-2" onSubmit={handleSubmit}>
        <input name="busName" value={form.busName} onChange={handleChange} className="input-field" placeholder="Bus name" required />
        <input name="busNumber" value={form.busNumber} onChange={handleChange} className="input-field" placeholder="Bus number" required />
        <input name="driverName" value={form.driverName} onChange={handleChange} className="input-field" placeholder="Driver name" required />
        <input name="route" value={form.route} onChange={handleChange} className="input-field" placeholder="Route (e.g., Lahore-Islamabad)" />
        <input name="departureCity" value={form.departureCity} onChange={handleChange} className="input-field" placeholder="Departure city" required />
        <input name="arrivalCity" value={form.arrivalCity} onChange={handleChange} className="input-field" placeholder="Arrival city" required />
        <input name="departureTime" value={form.departureTime} onChange={handleChange} className="input-field" placeholder="Departure time" />
        <input name="arrivalTime" value={form.arrivalTime} onChange={handleChange} className="input-field" placeholder="Arrival time" />
        <input name="totalSeats" type="number" value={form.totalSeats} onChange={handleChange} className="input-field" placeholder="Total seats" />
        <input name="price" type="number" value={form.price} onChange={handleChange} className="input-field" placeholder="Price (PKR)" />
        <select name="busType" value={form.busType} onChange={handleChange} className="input-field">
          <option>Economy</option>
          <option>Business</option>
          <option>Sleeper</option>
          <option>Luxury</option>
        </select>
        <select name="status" value={form.status} onChange={handleChange} className="input-field">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <textarea name="amenities" value={form.amenities} onChange={handleChange} className="input-field md:col-span-2" placeholder="Amenities separated by commas" />
        <div className="md:col-span-2">
          <input type="file" name="image" onChange={handleImage} className="input-field w-full" accept="image/*" />
        </div>
        <button type="submit" className="btn-primary md:col-span-2">Save changes</button>
      </form>
    </div>
  );
}