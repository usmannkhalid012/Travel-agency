export default function SeatMap({ selectedSeat, bookedSeats = [], onSeatSelect, totalSeats = 40, columns = 5 }) {
  const seats = Array.from({ length: totalSeats }, (_, index) => index + 1);

  return (
    <div className={`grid grid-cols-${columns} gap-3 rounded-3xl border border-white/10 bg-white/5 p-4`}>
      {seats.map((seat) => {
        const isBooked = bookedSeats.includes(seat);
        const isSelected = selectedSeat === seat;

        return (
          <button
            key={seat}
            type="button"
            disabled={isBooked}
            onClick={() => onSeatSelect(seat)}
            aria-pressed={isSelected}
            aria-label={`Seat ${seat}${isBooked ? ' booked' : isSelected ? ' selected' : ''}`}
            className={`rounded-2xl px-3 py-4 text-sm font-semibold transition duration-300 focus:outline-none focus:ring-2 focus:ring-violet-400 ${
              isBooked
                ? 'cursor-not-allowed bg-slate-800 text-slate-500'
                : isSelected
                ? 'bg-violet-500 text-white shadow-glow cursor-pointer'
                : 'bg-white/10 text-slate-200 hover:-translate-y-0.5 hover:bg-white/15 cursor-pointer'
            }`}
          >
            {seat}
          </button>
        );
      })}
    </div>
  );
}