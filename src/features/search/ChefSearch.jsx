import { useState, useEffect } from 'react';
import ChefCard from './ChefCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function ChefSearch() {
  const [chefs, setChefs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    cuisine: '',
    location: '',
    maxPrice: '',
  });

  useEffect(() => {
    fetchChefs();
  }, []);

  const fetchChefs = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (filters.cuisine) params.append('cuisine', filters.cuisine);
      if (filters.location) params.append('location', filters.location);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      const response = await fetch(`${API_URL}/chefs?${params}`);
      if (!response.ok) throw new Error('Failed to fetch chefs');
      
      const data = await response.json();
      setChefs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchChefs();
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title gradient-text">Find Your Perfect Chef</h1>
        <p className="page-subtitle">Discover talented chefs for your next culinary experience</p>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Cuisine</label>
            <input
              type="text"
              value={filters.cuisine}
              onChange={(e) => setFilters({ ...filters, cuisine: e.target.value })}
              placeholder="e.g. Italian, Japanese"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              placeholder="e.g. Nairobi"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Max Price/Hour</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              placeholder="e.g. 5000"
              className="form-input"
            />
          </div>
        </div>
        <button type="submit" className="gradient-button" style={{width: '100%'}}>
          🔍 Search Chefs
        </button>
      </form>

      {error && (
        <div className="alert-error">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="loading">
          Loading chefs...
        </div>
      ) : chefs.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-text">No chefs found</p>
          <p className="empty-state-subtext">Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="card-grid">
          {chefs.map((chef) => (
            <ChefCard key={chef.id} chef={chef} />
          ))}
        </div>
      )}
    </div>
  );
}