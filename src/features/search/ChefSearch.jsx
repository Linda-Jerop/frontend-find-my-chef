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
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Find Your Chef</h1>

      <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine</label>
            <input
              type="text"
              value={filters.cuisine}
              onChange={(e) => setFilters({ ...filters, cuisine: e.target.value })}
              placeholder="e.g. Italian, Japanese"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              placeholder="e.g. Nairobi"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Price/Hour</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              placeholder="e.g. 5000"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Search Chefs
        </button>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="text-xl">Loading chefs...</div>
        </div>
      ) : chefs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg">No chefs found</p>
          <p className="text-gray-500 mt-2">Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chefs.map((chef) => (
            <ChefCard key={chef.id} chef={chef} />
          ))}
        </div>
      )}
    </div>
  );
}