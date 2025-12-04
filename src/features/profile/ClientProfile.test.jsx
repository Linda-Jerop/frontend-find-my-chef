import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ClientProfile from './ClientProfile';

const mockAuthStore = vi.hoisted(() => ({ user: null, isAuthenticated: false })); // Mock auth state
vi.mock('../../store/authStore', () => ({ useAuthStore: () => mockAuthStore })); // Replace real auth store with mock

const renderWithRouter = (component) => render(<BrowserRouter>{component}</BrowserRouter>); // Wrap component in router for navigation

describe('ClientProfile - View', () => {
  beforeEach(() => { mockAuthStore.user = null; mockAuthStore.isAuthenticated = false; }); // Reset to logged-out state before each test

  it('displays name and email', async () => {
    renderWithRouter(<ClientProfile />);
    await waitFor(() => expect(screen.getByText(/john doe/i)).toBeInTheDocument()); // Wait for profile to load from API
    expect(screen.getByText(/john@example\.com/i)).toBeInTheDocument(); // Email is displayed but not editable
  });

  it('hides edit button for non-owner', async () => {
    mockAuthStore.user = { id: '999', role: 'client' }; // Simulate different user viewing profile
    mockAuthStore.isAuthenticated = true;
    renderWithRouter(<ClientProfile />);
    await waitFor(() => expect(screen.getByText(/john doe/i)).toBeInTheDocument());
    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument(); // Edit button should not exist for non-owners
  });
});

describe('ClientProfile - Edit', () => {
  beforeEach(() => { mockAuthStore.user = { id: '1', role: 'client' }; mockAuthStore.isAuthenticated = true; }); // Simulate logged-in client who owns this profile

  it('shows edit button for owner', async () => {
    renderWithRouter(<ClientProfile />);
    await waitFor(() => expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()); // Owner should see edit button
  });

  it('shows form with pre-filled name', async () => {
    const user = userEvent.setup(); // Setup user interaction simulator
    renderWithRouter(<ClientProfile />);
    await waitFor(() => expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: /edit/i })); // Click edit to switch to form mode
    expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe'); // Form should show current name (email not editable)
  });

  it('validates name required', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ClientProfile />);
    await waitFor(() => expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: /edit/i }));
    await user.clear(screen.getByLabelText(/name/i)); // Remove name (required field)
    await user.click(screen.getByRole('button', { name: /save/i })); // Try to save
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument(); // Should show validation error
  });

  it('saves changes', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ClientProfile />);
    await waitFor(() => expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: /edit/i }));
    await user.clear(screen.getByLabelText(/name/i));
    await user.type(screen.getByLabelText(/name/i), 'Jane Doe'); // Change name
    await user.click(screen.getByRole('button', { name: /save/i })); // Save changes
    await waitFor(() => expect(screen.getByText(/updated successfully/i)).toBeInTheDocument()); // Should show success message
  });

  it('cancels without saving', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ClientProfile />);
    await waitFor(() => expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: /edit/i }));
    await user.clear(screen.getByLabelText(/name/i));
    await user.type(screen.getByLabelText(/name/i), 'Changed'); // Make a change
    await user.click(screen.getByRole('button', { name: /cancel/i })); // Cancel instead of save
    await waitFor(() => expect(screen.getByText(/john doe/i)).toBeInTheDocument()); // Should revert to original name
  });
});

// Displays name and email (read-only) - Basically not editable
// Hides edit button for non-owner
// Shows edit button for owner
// Pre-fills name in edit mode
// Validates required name
// Saves name changes
// Cancels without saving

