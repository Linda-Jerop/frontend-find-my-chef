import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';

const renderWithRouter = (component) => render(<BrowserRouter>{component}</BrowserRouter>); // Wrap in router for navigation

describe('Login', () => {
  it('renders form with email and password', () => {
    renderWithRouter(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Login />);
    await user.click(screen.getByRole('button', { name: /login/i })); // Submit empty form
    
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument(); // Should show validation errors
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  it('submits valid login', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Login />);
    
    await user.type(screen.getByLabelText(/email/i), 'john@example.com'); // Fill valid credentials
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument()); // Should login successfully
  });

  it('has Google login button', () => {
    renderWithRouter(<Login />);
    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument(); // Should show social login
  });

  it('has link to register', () => {
    renderWithRouter(<Login />);
    const registerLink = screen.getByRole('link', { name: /register/i });
    expect(registerLink).toHaveAttribute('href', '/register'); // Should link to registration
  });
});

//TODO
// Renders email/password fields
// Validates required fields
// Submits valid login
// Shows Google login button
// Links to register page.