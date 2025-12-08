import { create } from 'zustand';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const useBookingStore = create((set) => ({
  bookings: [],
  isLoading: false,
  error: null,

  // Fetch bookings for chef
  fetchChefBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/chef/bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch bookings');
      
      const data = await response.json();
      set({ bookings: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Fetch bookings for client
  fetchClientBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/client/bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch bookings');
      
      const data = await response.json();
      set({ bookings: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Update booking status (chef accepts/declines)
  updateBookingStatus: async (bookingId, status) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) throw new Error('Failed to update booking');
      
      const updatedBooking = await response.json();
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b.id === bookingId ? updatedBooking : b
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Cancel booking (client)
  cancelBooking: async (bookingId) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to cancel booking');
      
      set((state) => ({
        bookings: state.bookings.filter((b) => b.id !== bookingId),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
