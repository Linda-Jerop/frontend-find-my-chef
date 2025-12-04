import { render, screen, waitFor } from '@testing-library/react'; // testing utilities
import userEvent from '@testing-library/user-event'; // simulates user interactions
import { BrowserRouter } from 'react-router-dom'; // router context
import { describe, it, expect, vi } from 'vitest'; // vitest functions
import ClientBookings from './ClientBookings';

//TODO
// Create booking form with chef/date/time/hours
// Required field validation
// Successful booking creation
// Display bookings list
// Booking details view (hours, time, total price)
// Status badges (pending/accepted)
// Filter by status
// Empty state

vi.mock('../../store/authStore', () => ({ // mock auth store
  default: () => ({ user: { id: 1, role: 'client' } }) // logged in as client
}));

describe('ClientBookings', () => {
  it('displays create booking form', () => { // verifies form renders
    render(<BrowserRouter><ClientBookings /></BrowserRouter>);
    expect(screen.getByLabelText(/chef/i)).toBeInTheDocument(); // chef select visible
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument(); // date picker visible
    expect(screen.getByLabelText(/time/i)).toBeInTheDocument(); // time picker visible
    expect(screen.getByLabelText(/hours/i)).toBeInTheDocument(); // hours input visible
    expect(screen.getByRole('button', { name: /book/i })).toBeInTheDocument(); // submit button visible
  });

  it('validates required fields before submission', async () => { // verifies validation
    const user = userEvent.setup(); // setup user interaction
    render(<BrowserRouter><ClientBookings /></BrowserRouter>);
    await user.click(screen.getByRole('button', { name: /book/i })); // click without filling
    expect(await screen.findByText(/required/i)).toBeInTheDocument(); // error message appears
  });

  it('creates booking with valid data', async () => { // verifies successful booking
    const user = userEvent.setup(); // setup user interaction
    render(<BrowserRouter><ClientBookings /></BrowserRouter>);
    await user.selectOptions(screen.getByLabelText(/chef/i), '1'); // select chef
    await user.type(screen.getByLabelText(/date/i), '2025-12-10'); // pick date
    await user.type(screen.getByLabelText(/time/i), '14:00'); // pick time
    await user.type(screen.getByLabelText(/hours/i), '3'); // enter hours
    await user.click(screen.getByRole('button', { name: /book/i })); // submit form
    expect(await screen.findByText(/booking created/i)).toBeInTheDocument(); // success message
  });

  it('fetches and displays client bookings list', async () => { // verifies bookings load
    render(<BrowserRouter><ClientBookings /></BrowserRouter>);
    await waitFor(() => { // waits for API call
      expect(screen.getByText('Gordon Ramsay')).toBeInTheDocument(); // chef name from mock
      expect(screen.getByText(/2025-12-10/)).toBeInTheDocument(); // booking date
      expect(screen.getByText(/pending/i)).toBeInTheDocument(); // booking status
    });
  });

  it('displays booking details when clicked', async () => { // verifies detail view
    const user = userEvent.setup(); // setup user interaction
    render(<BrowserRouter><ClientBookings /></BrowserRouter>);
    await waitFor(() => screen.getByText('Gordon Ramsay')); // wait for list to load
    await user.click(screen.getByText('Gordon Ramsay')); // click booking item
    expect(await screen.findByText(/3 hours/i)).toBeInTheDocument(); // hours visible in detail
    expect(screen.getByText(/14:00/)).toBeInTheDocument(); // time visible in detail
    expect(screen.getByText(/KSH 300/)).toBeInTheDocument(); // total price visible (3hrs * 100/hr)
  });

  it('shows status badge for each booking', async () => { // verifies status display
    render(<BrowserRouter><ClientBookings /></BrowserRouter>);
    await waitFor(() => { // waits for bookings
      expect(screen.getByText(/pending/i)).toBeInTheDocument(); // pending status
      expect(screen.getByText(/accepted/i)).toBeInTheDocument(); // accepted status from another booking
    });
  });

  it('filters bookings by status', async () => { // verifies filter works
    const user = userEvent.setup(); // setup user interaction
    render(<BrowserRouter><ClientBookings /></BrowserRouter>);
    await waitFor(() => screen.getByText(/pending/i)); // wait for bookings
    const statusFilter = screen.getByLabelText(/filter/i); // finds status filter
    await user.selectOptions(statusFilter, 'accepted'); // filter by accepted
    expect(screen.queryByText(/pending/i)).not.toBeInTheDocument(); // pending hidden
    expect(screen.getByText(/accepted/i)).toBeInTheDocument(); // only accepted shown
  });

  it('shows empty state when no bookings exist', async () => { // handles empty list
    vi.mocked(global.fetch).mockResolvedValueOnce({ // override MSW to return empty
      ok: true, json: async () => ({ bookings: [] })
    });
    render(<BrowserRouter><ClientBookings /></BrowserRouter>);
    expect(await screen.findByText(/no bookings yet/i)).toBeInTheDocument(); // empty message
  });
});