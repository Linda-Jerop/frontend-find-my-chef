import { render, screen, waitFor } from '@testing-library/react'; // testing utilities
import userEvent from '@testing-library/user-event'; // simulates user interactions
import { BrowserRouter } from 'react-router-dom'; // router context
import { describe, it, expect, vi } from 'vitest'; // vitest functions
import ChefBookings from './ChefBookings';

//TODO
// Display incoming requests list
// Accept/decline buttons for pending
// Accept booking action
// Decline booking action
// Booking details view
// Filter by status
// Total earnings calculation
// Empty state
// Hide buttons for non-pending bookings

vi.mock('../../store/authStore', () => ({ // mock auth store
  default: () => ({ user: { id: 2, role: 'chef' } }) // logged in as chef
}));

describe('ChefBookings', () => {
  it('displays list of booking requests', async () => { // verifies chef sees incoming requests
    render(<BrowserRouter><ChefBookings /></BrowserRouter>);
    await waitFor(() => { // waits for API call to GET /bookings?chefId=2
      expect(screen.getByText('John Client')).toBeInTheDocument(); // client name from mock
      expect(screen.getByText(/2025-12-10/)).toBeInTheDocument(); // booking date
      expect(screen.getByText(/3 hours/i)).toBeInTheDocument(); // booking duration
      expect(screen.getByText(/pending/i)).toBeInTheDocument(); // status badge
    });
  });

  it('shows accept and decline buttons for pending bookings', async () => { // verifies action buttons
    render(<BrowserRouter><ChefBookings /></BrowserRouter>);
    await waitFor(() => screen.getByText('John Client')); // wait for bookings
    expect(screen.getByRole('button', { name: /accept/i })).toBeInTheDocument(); // accept button visible
    expect(screen.getByRole('button', { name: /decline/i })).toBeInTheDocument(); // decline button visible
  });

  it('accepts booking request', async () => { // verifies chef can accept
    const user = userEvent.setup(); // setup user interaction
    render(<BrowserRouter><ChefBookings /></BrowserRouter>);
    await waitFor(() => screen.getByRole('button', { name: /accept/i })); // wait for button
    await user.click(screen.getByRole('button', { name: /accept/i })); // click accept
    expect(await screen.findByText(/accepted/i)).toBeInTheDocument(); // status updated to accepted
    expect(screen.queryByRole('button', { name: /accept/i })).not.toBeInTheDocument(); // buttons hidden after action
  });

  it('declines booking request', async () => { // verifies chef can decline
    const user = userEvent.setup(); // setup user interaction
    render(<BrowserRouter><ChefBookings /></BrowserRouter>);
    await waitFor(() => screen.getByRole('button', { name: /decline/i })); // wait for button
    await user.click(screen.getByRole('button', { name: /decline/i })); // click decline
    expect(await screen.findByText(/declined/i)).toBeInTheDocument(); // status updated to declined
  });

  it('displays booking details when clicked', async () => { // verifies detail view
    const user = userEvent.setup(); // setup user interaction
    render(<BrowserRouter><ChefBookings /></BrowserRouter>);
    await waitFor(() => screen.getByText('John Client')); // wait for list
    await user.click(screen.getByText('John Client')); // click booking item
    expect(await screen.findByText(/14:00/)).toBeInTheDocument(); // time visible
    expect(screen.getByText(/KSH 300/)).toBeInTheDocument(); // total price
    expect(screen.getByText(/nairobi/i)).toBeInTheDocument(); // location visible
  });

  it('filters bookings by status', async () => { // verifies status filter
    const user = userEvent.setup(); // setup user interaction
    render(<BrowserRouter><ChefBookings /></BrowserRouter>);
    await waitFor(() => screen.getByText(/pending/i)); // wait for bookings
    const statusFilter = screen.getByLabelText(/filter/i); // finds filter dropdown
    await user.selectOptions(statusFilter, 'accepted'); // filter by accepted
    expect(screen.queryByText(/pending/i)).not.toBeInTheDocument(); // pending hidden
    expect(screen.getByText(/accepted/i)).toBeInTheDocument(); // only accepted shown
  });

  it('shows total earnings from accepted bookings', async () => { // verifies earnings display
    render(<BrowserRouter><ChefBookings /></BrowserRouter>);
    await waitFor(() => { // waits for bookings calculation
      expect(screen.getByText(/total earnings/i)).toBeInTheDocument(); // earnings label
      expect(screen.getByText(/KSH 600/)).toBeInTheDocument(); // sum of accepted bookings
    });
  });

  it('shows empty state when no bookings exist', async () => { // handles no requests
    vi.mocked(global.fetch).mockResolvedValueOnce({ // override MSW to return empty
      ok: true, json: async () => ({ bookings: [] })
    });
    render(<BrowserRouter><ChefBookings /></BrowserRouter>);
    expect(await screen.findByText(/no booking requests/i)).toBeInTheDocument(); // empty message
  });

  it('hides action buttons for non-pending bookings', async () => { // verifies buttons only on pending
    render(<BrowserRouter><ChefBookings /></BrowserRouter>);
    await waitFor(() => screen.getByText(/accepted/i)); // wait for accepted booking
    const acceptedBookingCard = screen.getByText(/accepted/i).closest('div'); // find accepted booking
    expect(acceptedBookingCard).not.toContain(screen.queryByRole('button', { name: /accept/i })); // no accept button on accepted bookings
  });
});