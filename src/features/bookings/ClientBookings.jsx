import { useEffect } from 'react';
import { useBookingStore } from '../../store/bookingStore';

export default function ClientBookings() {
  const { bookings, isLoading, error, fetchClientBookings, cancelBooking } = useBookingStore();

  useEffect(() => {
    fetchClientBookings();
  }, [fetchClientBookings]);

  const handleCancel = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelBooking(bookingId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg">No bookings yet</p>
          <p className="text-gray-500 mt-2">Search for chefs and make your first booking!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{booking.chef_name}</h3>
                  <p className="text-gray-600">{booking.cuisine}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    booking.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : booking.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {booking.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{new Date(booking.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">{booking.time}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{booking.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Guests</p>
                  <p className="font-medium">{booking.number_of_guests}</p>
                </div>
              </div>

              {booking.special_requests && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Special Requests</p>
                  <p className="text-gray-700">{booking.special_requests}</p>
                </div>
              )}

              {booking.status === 'pending' && (
                <button
                  onClick={() => handleCancel(booking.id)}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Cancel Booking
                </button>
              )}

              {booking.status === 'confirmed' && (
                <div className="bg-green-50 border border-green-200 rounded p-3 text-green-800">
                  ✓ Booking confirmed! The chef will contact you soon.
                </div>
              )}

              {booking.status === 'declined' && (
                <div className="bg-red-50 border border-red-200 rounded p-3 text-red-800">
                  This booking was declined by the chef.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
