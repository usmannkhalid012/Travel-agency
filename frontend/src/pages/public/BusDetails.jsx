import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import PageHeader from '../../components/PageHeader';
import LoadingSpinner from '../../components/LoadingSpinner';
import SeatMap from '../../components/SeatMap';
import FormField from '../../components/FormField';
import { fetchBus } from '../../services/busService';
import { createBooking } from '../../services/bookingService';
import { formatCurrency } from '../../utils/formatters';
import { dummyBuses } from '../../utils/constants';

export default function BusDetails() {
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user);
  const [bus, setBus] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [booking, setBooking] = useState({ customerCNIC: '', customerPhone: '', advancePayment: 0 });
  const [loading, setLoading] = useState(true);
  const demoBus = dummyBuses.find((item) => item._id === id);
  const isDemoBus = Boolean(demoBus);
  const imageSrc = bus?.image?.trim() || dummyBuses[0].image;

  useEffect(() => {
    const load = async () => {
      if (demoBus) {
        setBus(demoBus);
        setLoading(false);
        return;
      }

      try {
        const response = await fetchBus(id);
        setBus(response.data || dummyBuses[0]);
      } catch {
        setBus(dummyBuses[0]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleBooking = async (event) => {
    event.preventDefault();

    if (!user) {
      toast.error('Please sign in to send a live booking request');
      return;
    }

    const numericAdvance = Number(booking.advancePayment || 0);
    if (Number.isNaN(numericAdvance) || numericAdvance < 0) {
      toast.error('Advance payment must be a valid non-negative amount');
      return;
    }

    if (numericAdvance > bus.price) {
      toast.error('Advance payment cannot be greater than fare');
      return;
    }

    if (isDemoBus) {
      toast.success('Demo booking saved locally. Seed the database to enable live bookings.');
      return;
    }

    try {
      await createBooking({ busId: bus._id, seatNumber: String(selectedSeat), ...booking, advancePayment: numericAdvance });
      toast.success('Booking request submitted. Admin will approve or reject shortly.');
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Unable to submit booking request');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!bus) return <div className="section-padding">Bus not found</div>;

  return (
    <div className="section-padding mx-auto max-w-7xl">
      <PageHeader title={bus.busName} subtitle={`${bus.departureCity} to ${bus.arrivalCity} • ${bus.busType}`} />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        <div className="space-y-6">
          <img src={imageSrc} alt={bus.busName} className="h-56 w-full rounded-[2rem] object-cover sm:h-64 lg:h-72" />
          <div className="glass-card rounded-3xl p-6">
            <h2 className="text-2xl font-semibold text-white">Seat selection</h2>
            <p className="mt-2 text-slate-300">Choose an available seat from the live layout below.</p>
            <div className="mt-6">
              <SeatMap selectedSeat={selectedSeat} bookedSeats={[2, 4, 6, 8, 10]} onSeatSelect={setSelectedSeat} totalSeats={bus.totalSeats} />
            </div>
          </div>
        </div>
        <form onSubmit={handleBooking} className="glass-card rounded-3xl p-6 space-y-4">
          <div>
            <p className="text-sm text-slate-400">Fare</p>
            <h3 className="text-3xl font-semibold text-white">{formatCurrency(bus.price)}</h3>
            <p className="mt-2 text-sm text-slate-300">Your request will be reviewed by admin before the ticket is confirmed.</p>
          </div>
          <FormField label="CNIC" value={booking.customerCNIC} onChange={(e) => setBooking({ ...booking, customerCNIC: e.target.value })} />
          <FormField label="Phone" value={booking.customerPhone} onChange={(e) => setBooking({ ...booking, customerPhone: e.target.value })} />
          <FormField
            label="Advance payment"
            type="number"
            min={0}
            max={bus.price}
            value={booking.advancePayment}
            onChange={(e) => setBooking({ ...booking, advancePayment: e.target.value })}
          />
          <p className="text-xs text-slate-400">Advance cannot exceed fare: {formatCurrency(bus.price)}</p>
          <button className="btn-primary w-full" disabled={!selectedSeat}>Send Booking Request</button>
          {!user && <Link to="/login" className="btn-secondary w-full">Sign in for live booking</Link>}
        </form>
      </div>
    </div>
  );
}