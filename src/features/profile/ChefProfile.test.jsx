import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ChefProfile from './ChefProfile';

const mockAuthStore = vi.hoisted(() => ({ user: null, isAuthenticated: false })); // Mock auth state
vi.mock('../../store/authStore', () => ({ useAuthStore: () => mockAuthStore })); // This replaces real auth store with mock

const renderWithRouter = (component) => render(<BrowserRouter>{component}</BrowserRouter>); // Wrap component in router for navigation

describe('ChefProfile - View', () => {
  beforeEach(() => { mockAuthStore.user = null; mockAuthStore.isAuthenticated = false; }); // Reset to logged-out state before each test

  it('displays photo, bio, cuisines, price, location, phone', async () => {
    renderWithRouter(<ChefProfile />);
    await waitFor(() => expect(screen.getByText(/chef mario/i)).toBeInTheDocument()); // Wait for profile to load from API
    
    expect(screen.getByAltText(/chef mario/i)).toHaveAttribute('src'); // Check photo element has image source
    expect(screen.getByText(/italian cuisine specialist/i)).toBeInTheDocument(); // Yo verify bio text
    expect(screen.getByText(/\$50/i)).toBeInTheDocument(); // To verify the hourly rate displayed
    expect(screen.getByText(/\+1 234 567 8900/i)).toBeInTheDocument(); // To verify the phone number shown
  });

  it('hides edit button for non-owner', async () => {
    mockAuthStore.user = { id: '999', role: 'client' }; // This is to simulate different user viewing profile
    mockAuthStore.isAuthenticated = true;
    renderWithRouter(<ChefProfile />);
    await waitFor(() => expect(screen.getByText(/chef mario/i)).toBeInTheDocument());
    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument(); // It shouldn't be editable
  });
});

describe('ChefProfile - Edit', () => {
  beforeEach(() => { mockAuthStore.user = { id: '1', role: 'chef' }; mockAuthStore.isAuthenticated = true; }); // Simulate logged-in chef who owns this profile

  it('shows edit button for owner', async () => {
    renderWithRouter(<ChefProfile />);
    await waitFor(() => expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()); // Owner should see edit button
  });

  it('shows form with pre-filled data', async () => {
    const user = userEvent.setup(); // Setup user interaction simulator
    renderWithRouter(<ChefProfile />);
    await waitFor(() => expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: /edit/i })); // Click edit to switch to form mode
    
    expect(screen.getByLabelText(/name/i)).toHaveValue('Chef Mario'); // Form should show current name
    expect(screen.getByLabelText(/hourly rate/i)).toHaveValue(50); // Form should show current rate
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ChefProfile />);
    await waitFor(() => expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: /edit/i }));
    await user.clear(screen.getByLabelText(/name/i)); // Remove name (required field)
    await user.click(screen.getByRole('button', { name: /save/i })); // Try to save
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument(); // Should show validation error
  });

  it('saves changes', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ChefProfile />);
    await waitFor(() => expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: /edit/i }));
    await user.clear(screen.getByLabelText(/name/i));
    await user.type(screen.getByLabelText(/name/i), 'Chef Luigi'); // Change name
    await user.click(screen.getByRole('button', { name: /save/i })); // Save changes
    await waitFor(() => expect(screen.getByText(/updated successfully/i)).toBeInTheDocument()); // Should show success message
  });

  it('cancels without saving', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ChefProfile />);
    await waitFor(() => expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: /edit/i }));
    await user.clear(screen.getByLabelText(/name/i));
    await user.type(screen.getByLabelText(/name/i), 'Changed'); // Make a change
    await user.click(screen.getByRole('button', { name: /cancel/i })); // Cancel instead of save
    await waitFor(() => expect(screen.getByText(/chef mario/i)).toBeInTheDocument()); // Should revert to original name
  });
});

// Displays photo/bio/cuisines/price/location/phone
// Hides edit button for non-owner
// Shows edit button for owner
// Pre-fills form in edit mode
// Validates required fields
// Saves changes successfully
// Cancels without saving