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
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-4">
          Find Your Perfect Chef
        </h1>
        <p className="text-gray-600 text-lg">Discover talented chefs for your next culinary experience</p>
      </div>

      <form onSubmit={handleSearch} className="bg-white p-6 rounded-2xl shadow-xl mb-8 border-2 border-orange-100">
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
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-pink-600 transition font-medium transform hover:scale-105 shadow-lg"
        >
          🔍 Search Chefs
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