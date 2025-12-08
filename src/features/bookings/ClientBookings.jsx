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
      <div className="loading">Loading bookings...</div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title gradient-text">My Bookings</h1>

      {error && (
        <div className="alert-error">{error}</div>
      )}

      {bookings.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-text">No bookings yet</p>
          <p className="empty-state-subtext">Search for chefs and make your first booking!</p>
        </div>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <div>
                  <h3 className="booking-title">{booking.chef_name}</h3>
                  <p className="booking-subtitle">{booking.cuisine}</p>
                </div>
                <span className={`badge badge-${booking.status}`}>
                  {booking.status}
                </span>
              </div>

              <div className="booking-grid">
                <div className="booking-field">
                  <p className="booking-field-label">Date</p>
                  <p className="booking-field-value">{new Date(booking.date).toLocaleDateString()}</p>
                </div>
                <div className="booking-field">
                  <p className="booking-field-label">Time</p>
                  <p className="booking-field-value">{booking.time}</p>
                </div>
                <div className="booking-field">
                  <p className="booking-field-label">Location</p>
                  <p className="booking-field-value">{booking.location}</p>
                </div>
                <div className="booking-field">
                  <p className="booking-field-label">Guests</p>
                  <p className="booking-field-value">{booking.number_of_guests}</p>
                </div>
              </div>

              {booking.special_requests && (
                <div style={{marginBottom: '16px'}}>
                  <p className="booking-field-label">Special Requests</p>
                  <p>{booking.special_requests}</p>
                </div>
              )}

              {booking.status === 'pending' && (
                <button
                  onClick={() => handleCancel(booking.id)}
                  className="btn btn-cancel"
                  style={{width: '100%'}}
                >
                  Cancel Booking
                </button>
              )}

              {booking.status === 'confirmed' && (
                <div className="badge badge-confirmed" style={{width: '100%'}}>
                  ✓ Booking confirmed! The chef will contact you soon.
                </div>
              )}

              {booking.status === 'declined' && (
                <div className="badge badge-declined" style={{width: '100%'}}>
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
