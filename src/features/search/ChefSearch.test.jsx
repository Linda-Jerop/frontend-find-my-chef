import { render, screen, waitFor } from '@testing-library/react'; // testing utilities
import userEvent from '@testing-library/user-event'; // simulates user interactions
import { BrowserRouter } from 'react-router-dom'; // router context
import { describe, it, expect, beforeEach } from 'vitest'; // vitest functions
import ChefSearch from './ChefSearch';

//TODO
// Should ender search bar and filters
// Should fetch/display chefs on load
// Filter by cuisine
// Filter by max price
// Filter by location
// Combine multiple filters
// Search by name
// Show empty state message

describe('ChefSearch', () => {
  beforeEach(() => { // setup before each test
    render(<BrowserRouter><ChefSearch /></BrowserRouter>); // render search page
  });

  it('displays search bar and filter inputs', () => { // verifies UI elements render
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument(); // search input visible
    expect(screen.getByLabelText(/cuisine/i)).toBeInTheDocument(); // cuisine filter visible
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument(); // price filter visible
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument(); // location filter visible
  });

  it('fetches and displays list of chefs on mount', async () => { // verifies initial load
    await waitFor(() => { // waits for API call to complete
      expect(screen.getByText('Gordon Ramsay')).toBeInTheDocument(); // mock chef from MSW appears
      expect(screen.getByText('Jamie Oliver')).toBeInTheDocument(); // second mock chef appears
    });
  });

  it('filters chefs by cuisine', async () => { // verifies cuisine filter works
    const user = userEvent.setup(); // setup user interaction
    const cuisineSelect = screen.getByLabelText(/cuisine/i); // finds cuisine dropdown
    await user.selectOptions(cuisineSelect, 'Italian'); // selects Italian
    await waitFor(() => { // waits for filtered results
      expect(screen.getByText('Gordon Ramsay')).toBeInTheDocument(); // Italian chef appears
      expect(screen.queryByText('Sushi Master')).not.toBeInTheDocument(); // Japanese chef filtered out
    });
  });

  it('filters chefs by max price', async () => { // verifies price filter works
    const user = userEvent.setup(); // setup user interaction
    const priceInput = screen.getByLabelText(/price/i); // finds price input
    await user.clear(priceInput); // clears existing value
    await user.type(priceInput, '50'); // types max price 50
    await waitFor(() => { // waits for filtered results
      expect(screen.queryByText('Gordon Ramsay')).not.toBeInTheDocument(); // expensive chef (100/hr) filtered out
      expect(screen.getByText('Budget Chef')).toBeInTheDocument(); // cheap chef (30/hr) appears
    });
  });

  it('filters chefs by location', async () => { // verifies location filter works
    const user = userEvent.setup(); // setup user interaction
    const locationSelect = screen.getByLabelText(/location/i); // finds location dropdown
    await user.selectOptions(locationSelect, 'Mombasa'); // selects Mombasa
    await waitFor(() => { // waits for filtered results
      expect(screen.queryByText('Gordon Ramsay')).not.toBeInTheDocument(); // Nairobi chef filtered out
      expect(screen.getByText('Coastal Chef')).toBeInTheDocument(); // Mombasa chef appears
    });
  });

  it('combines multiple filters', async () => { // verifies filters work together
    const user = userEvent.setup(); // setup user interaction
    await user.selectOptions(screen.getByLabelText(/cuisine/i), 'Italian'); // filter by Italian
    await user.type(screen.getByLabelText(/price/i), '80'); // filter by max price 80
    await waitFor(() => { // waits for filtered results matching both
      expect(screen.getByText('Affordable Italian Chef')).toBeInTheDocument(); // matches both filters
    });
  });

  it('searches chefs by name', async () => { // verifies search bar works
    const user = userEvent.setup(); // setup user interaction
    const searchInput = screen.getByPlaceholderText(/search/i); // finds search input
    await user.type(searchInput, 'Gordon'); // types chef name
    await waitFor(() => { // waits for search results
      expect(screen.getByText('Gordon Ramsay')).toBeInTheDocument(); // matching chef appears
      expect(screen.queryByText('Jamie Oliver')).not.toBeInTheDocument(); // non-matching filtered out
    });
  });

  it('shows message when no chefs match filters', async () => { // handles empty results
    const user = userEvent.setup(); // setup user interaction
    await user.selectOptions(screen.getByLabelText(/cuisine/i), 'Ethiopian'); // rare cuisine
    await user.type(screen.getByLabelText(/price/i), '5'); // very low price
    await waitFor(() => { // waits for empty results
      expect(screen.getByText(/no chefs found/i)).toBeInTheDocument(); // empty state message
    });
  });
});
