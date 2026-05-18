import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import PageHeader from '../../components/PageHeader';
import { createBusAsync, clearCreateError } from '../../redux/slices/busSlice';
import { setBusImage } from '../../redux/slices/busSlice';

export default function AddBus() {
  const dispatch = useDispatch();
  const { createStatus, createError } = useSelector((state) => state.buses);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    busName: '',
    busNumber: '',
    driverName: '',
    route: '',
    departureCity: '',
    arrivalCity: '',
    departureTime: '',
    arrivalTime: '',
    totalSeats: '',
    price: '',
    amenities: '',
    busType: 'Economy',
    status: 'active'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.busName || !formData.busNumber || !formData.driverName || !formData.departureCity || !formData.arrivalCity || !formData.totalSeats || !formData.price || !formData.departureTime || !formData.arrivalTime) {
      toast.error('Please fill all required fields');
      return;
    }

    // Create FormData for multipart upload
    const payload = new FormData();
    payload.append('busName', formData.busName);
    payload.append('busNumber', formData.busNumber);
    payload.append('driverName', formData.driverName);
    payload.append('route', formData.route);
    payload.append('departureCity', formData.departureCity);
    payload.append('arrivalCity', formData.arrivalCity);
    payload.append('departureTime', formData.departureTime);
    payload.append('arrivalTime', formData.arrivalTime);
    payload.append('totalSeats', parseInt(formData.totalSeats));
    payload.append('price', parseFloat(formData.price));
    payload.append('busType', formData.busType);
    payload.append('status', formData.status);
    
    // Send amenities as comma-separated string (backend will handle it)
    if (formData.amenities) {
      payload.append('amenities', formData.amenities);
    }
    
    if (image) {
      payload.append('image', image);
    }

    try {
      // Ensure we have a token before attempting an authenticated upload
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        toast.error('You must be logged in to add a bus. Please login and try again.');
        return;
      }

      dispatch(clearCreateError());
      const result = await dispatch(createBusAsync(payload));
          if (result.type.endsWith('/fulfilled')) {
            // If backend didn't return an image (e.g., cloud upload failed), optimistically use the preview so UI shows the selected image
            const created = result.payload?.data;
            if (created && !created.image && imagePreview) {
              dispatch(setBusImage({ id: created._id, image: imagePreview }));
            }
        toast.success('Bus added successfully!');
        // Reset form
        setFormData({
          busName: '',
          busNumber: '',
          driverName: '',
          route: '',
          departureCity: '',
          arrivalCity: '',
          departureTime: '',
          arrivalTime: '',
          totalSeats: '',
          price: '',
          amenities: '',
          busType: 'Economy',
          status: 'active'
        });
        setImage(null);
        setImagePreview(null);
      }
    } catch (err) {
      toast.error(createError || 'Failed to add bus');
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      <PageHeader title="Add Bus" subtitle="Create a premium bus entry with image upload, price, seats, and route details." />
      <form className="glass-card grid gap-4 rounded-3xl p-6 md:grid-cols-2" onSubmit={handleSubmit}>
        {/* Bus Name */}
        <input
          type="text"
          name="busName"
          value={formData.busName}
          onChange={handleInputChange}
          className="input-field"
          placeholder="Bus name"
          required
        />

        {/* Bus Number */}
        <input
          type="text"
          name="busNumber"
          value={formData.busNumber}
          onChange={handleInputChange}
          className="input-field"
          placeholder="Bus number"
          required
        />

        {/* Driver Name */}
        <input
          type="text"
          name="driverName"
          value={formData.driverName}
          onChange={handleInputChange}
          className="input-field"
          placeholder="Driver name"
          required
        />

        {/* Route */}
        <input
          type="text"
          name="route"
          value={formData.route}
          onChange={handleInputChange}
          className="input-field"
          placeholder="Route (e.g., Lahore-Islamabad)"
        />

        {/* Departure City */}
        <input
          type="text"
          name="departureCity"
          value={formData.departureCity}
          onChange={handleInputChange}
          className="input-field"
          placeholder="Departure city"
          required
        />

        {/* Arrival City */}
        <input
          type="text"
          name="arrivalCity"
          value={formData.arrivalCity}
          onChange={handleInputChange}
          className="input-field"
          placeholder="Arrival city"
          required
        />

        {/* Departure Time */}
        <input
          type="time"
          name="departureTime"
          value={formData.departureTime}
          onChange={handleInputChange}
          className="input-field"
          placeholder="Departure time"
        />

        {/* Arrival Time */}
        <input
          type="time"
          name="arrivalTime"
          value={formData.arrivalTime}
          onChange={handleInputChange}
          className="input-field"
          placeholder="Arrival time"
        />

        {/* Total Seats */}
        <input
          type="number"
          name="totalSeats"
          value={formData.totalSeats}
          onChange={handleInputChange}
          className="input-field"
          placeholder="Total seats"
          min="1"
          required
        />

        {/* Price */}
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          className="input-field"
          placeholder="Price (PKR)"
          step="0.01"
          min="0"
          required
        />

        {/* Bus Type */}
        <select name="busType" value={formData.busType} onChange={handleInputChange} className="input-field">
          <option value="Economy">Economy</option>
          <option value="Business">Business</option>
          <option value="Sleeper">Sleeper</option>
          <option value="Luxury">Luxury</option>
        </select>

        {/* Status */}
        <select name="status" value={formData.status} onChange={handleInputChange} className="input-field">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* Amenities */}
        <textarea
          name="amenities"
          value={formData.amenities}
          onChange={handleInputChange}
          className="input-field md:col-span-2 min-h-32"
          placeholder="Amenities separated by commas (e.g., WiFi, AC, Charging, Food)"
        />

        {/* Image Upload */}
        <div className="md:col-span-2">
          {imagePreview && (
            <div className="mb-4 flex justify-center">
              <img src={imagePreview} alt="Preview" className="h-40 w-auto rounded-lg object-cover" />
            </div>
          )}
          <input type="file" name="image" onChange={handleImageChange} className="input-field w-full" accept="image/*" />
        </div>

        {/* Error Message */}
        {createError && <div className="text-red-500 text-sm md:col-span-2">{createError}</div>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={createStatus === 'loading'}
          className="btn-primary md:col-span-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createStatus === 'loading' ? 'Adding bus...' : 'Save bus'}
        </button>
      </form>
    </div>
  );
}