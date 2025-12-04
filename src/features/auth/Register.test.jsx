import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Register from './Register';

const renderWithRouter = (component) => render(<BrowserRouter>{component}</BrowserRouter>); // Wrap in router for navigation

describe('Register', () => {
  it('renders form with all fields', () => {
    renderWithRouter(<Register />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Register />);
    await user.click(screen.getByRole('button', { name: /register/i })); // Submit empty form
    
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument(); // Should show all errors
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Register />);
    await user.type(screen.getByLabelText(/email/i), 'invalid-email'); // Type invalid email
    await user.click(screen.getByRole('button', { name: /register/i }));
    expect(await screen.findByText(/valid email/i)).toBeInTheDocument(); // Should show email error
  });

  it('validates password length', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Register />);
    await user.type(screen.getByLabelText(/password/i), '123'); // Type short password
    await user.click(screen.getByRole('button', { name: /register/i }));
    expect(await screen.findByText(/password must be at least 6 characters/i)).toBeInTheDocument(); // Should enforce min length
  });

  it('allows selecting role', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Register />);
    const chefRadio = screen.getByLabelText(/chef/i);
    await user.click(chefRadio); // Select chef role
    expect(chefRadio).toBeChecked(); // Should be selected
  });

  it('submits valid registration', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Register />);
    
    await user.type(screen.getByLabelText(/name/i), 'John Doe'); // Fill all fields
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByLabelText(/client/i));
    await user.click(screen.getByRole('button', { name: /register/i }));
    
    await waitFor(() => expect(screen.queryByText(/error/i)).not.toBeInTheDocument()); // Should submit successfully
  });

  it('has link to login', () => {
    renderWithRouter(<Register />);
    const loginLink = screen.getByRole('link', { name: /login/i });
    expect(loginLink).toHaveAttribute('href', '/login'); // Should link to login page
  });
});

//TODO
// Renders form fields
// Validates required fields
// Validates email format
// Validates password length (min 6)
// Allows role selection (client/chef)
// Submits valid registration
// Links to login page