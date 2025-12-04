import { render, screen } from '@testing-library/react'; // testing utilities for rendering and querying
import { BrowserRouter } from 'react-router-dom'; // router context for Link component
import { describe, it, expect } from 'vitest'; // vitest testing functions
import ChefCard from './ChefCard';

//TODO
// Displays name/cuisines/price/location
// Shows chef photo
// Links to profile page
// Handles missing photo
// Displays bio text

describe('ChefCard', () => {
  const mockChef = { // sample chef data for testing
    id: 1,
    name: 'Gordon Ramsay',
    bio: 'Master chef with 20 years experience',
    cuisines: ['Italian', 'French'],
    pricePerHour: 100,
    location: 'Nairobi',
    photoUrl: 'https://example.com/photo.jpg'
  };

  it('displays chef name, cuisines, price and location', () => { // verifies all key info renders
    render(<BrowserRouter><ChefCard chef={mockChef} /></BrowserRouter>);
    expect(screen.getByText('Gordon Ramsay')).toBeInTheDocument(); // name visible
    expect(screen.getByText(/Italian/)).toBeInTheDocument(); // cuisines visible
    expect(screen.getByText(/French/)).toBeInTheDocument();
    expect(screen.getByText(/100/)).toBeInTheDocument(); // price visible (KSH 100/hour)
    expect(screen.getByText(/Nairobi/)).toBeInTheDocument(); // location visible
  });

  it('displays chef photo', () => { // verifies image renders with correct src
    render(<BrowserRouter><ChefCard chef={mockChef} /></BrowserRouter>);
    const img = screen.getByRole('img'); // finds image element
    expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg'); // correct photo URL
  });

  it('links to chef profile page', () => { // verifies clicking navigates to profile
    render(<BrowserRouter><ChefCard chef={mockChef} /></BrowserRouter>);
    const link = screen.getByRole('link'); // finds link wrapper around card
    expect(link).toHaveAttribute('href', '/chefs/1'); // navigates to chef's profile
  });

  it('displays default photo when no photoUrl provided', () => { // handles missing photo gracefully
    const chefNoPhoto = { ...mockChef, photoUrl: null }; // chef without photo
    render(<BrowserRouter><ChefCard chef={chefNoPhoto} /></BrowserRouter>);
    const img = screen.getByRole('img'); // finds image element
    expect(img).toHaveAttribute('src'); // has some default/placeholder src
  });

  it('displays bio text', () => { // verifies bio snippet shows on card
    render(<BrowserRouter><ChefCard chef={mockChef} /></BrowserRouter>);
    expect(screen.getByText(/Master chef with 20 years/)).toBeInTheDocument(); // bio visible
  });
});
