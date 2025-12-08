import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChefCard({ chef }) {
  const navigate = useNavigate();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    location: '',
    guests: 1,
    requests: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  const handleBooking = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to book a chef');
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chef_id: chef.id,
          date: bookingData.date,
          time: bookingData.time,
          location: bookingData.location,
          number_of_guests: bookingData.guests,
          special_requests: bookingData.requests,
        }),
      });

      if (!response.ok) throw new Error('Failed to create booking');

      alert('Booking request sent successfully!');
      setShowBookingForm(false);
      setBookingData({ date: '', time: '', location: '', guests: 1, requests: '' });
    } catch (error) {
      alert('Failed to create booking: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-orange-100">
      {chef.profile_image && (
        <img
          src={chef.profile_image}
          alt={chef.name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{chef.name}</h3>
        <p className="text-gray-600 mb-2">{chef.cuisine}</p>
        <p className="text-gray-700 text-sm mb-4">{chef.bio}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Location:</span>
            <span className="font-medium">{chef.location}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Price:</span>
            <span className="font-medium text-green-600">${chef.hourly_rate}/hour</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Experience:</span>
            <span className="font-medium">{chef.years_experience} years</span>
          </div>
        </div>

        {!showBookingForm ? (
          <button
            onClick={() => setShowBookingForm(true)}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-3 rounded-xl hover:from-orange-600 hover:to-pink-600 transition font-medium transform hover:scale-105 shadow-md"
          >
            📅 Book Now
          </button>
        ) : (
          <form onSubmit={handleBooking} className="space-y-3 mt-4 border-t pt-4">
            <input
              type="date"
              required
              value={bookingData.date}
              onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="time"
              required
              value={bookingData.time}
              onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Location"
              required
              value={bookingData.location}
              onChange={(e) => setBookingData({ ...bookingData, location: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Number of guests"
              min="1"
              required
              value={bookingData.guests}
              onChange={(e) => setBookingData({ ...bookingData, guests: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <textarea
              placeholder="Special requests (optional)"
              value={bookingData.requests}
              onChange={(e) => setBookingData({ ...bookingData, requests: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows="2"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:bg-gray-400"
              >
                {isSubmitting ? 'Booking...' : 'Confirm'}
              </button>
              <button
                type="button"
                onClick={() => setShowBookingForm(false)}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
