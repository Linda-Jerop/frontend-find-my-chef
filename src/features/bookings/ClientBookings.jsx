import React, { useState } from 'react';
import axios from 'axios';
import useAuthStore from '../../stores/useAuthStore';

const FormInput = ({ label, type, value, onChange, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      {...props}
    />
  </div>
);

const ClientBookingForm = ({ chefId, chefName, hourlyRate }) => {
  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [hours, setHours] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const token = useAuthStore((state) => state.token);

  const calculateTotal = () => {
    if (!hourlyRate || hours < 1) return 0;
    return (hourlyRate * hours).toFixed(2);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token) {
      setError('You must be logged in to make a booking.');
      return;
    }

    if (!bookingDate || !startTime) {
      setError('Please select a date and time for your booking.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const bookingPayload = {
      chef_id: chefId,
      booking_date: bookingDate,
      start_time: startTime,
      hours: Number(hours),
    };

    try {
      await axios.post('/api/bookings', bookingPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert(`Booking request sent for ${chefName}!`);
    } catch (apiError) {
      setError(apiError.response?.data?.detail || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded-xl shadow-lg space-y-6">
      <h2 className="text-3xl font-bold text-center text-gray-800">Book {chefName}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput label="Date" type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required/>
        <FormInput label="Start Time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required/>
        <FormInput label={`Hours (at $${hourlyRate}/hr)`} type="number" value={hours} onChange={(e) => setHours(e.target.value)} min="1" required/>
        <div className="pt-2 text-xl font-semibold text-right text-gray-700">
          <span>Total: </span>
          <span className="font-bold text-green-600">${calculateTotal()}</span>
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button type="submit" disabled={isSubmitting} className="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-gray-400">
          {isSubmitting ? 'Sending...' : 'Send Booking Request'}
        </button>
      </form>
    </div>
  );
};

export default ClientBookingForm;