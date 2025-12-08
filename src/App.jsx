import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Dashboard from './features/auth/Dashboard';
import ChefProfile from './features/profile/ChefProfile';
import ClientProfile from './features/profile/ClientProfile';
import ChefSearch from './features/search/ChefSearch';
import ClientBookings from './features/bookings/ClientBookings';
import ChefBookings from './features/bookings/ChefBookings';
import './App.css';

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold">🍳 FindMyChef</Link>
            <div className="hidden md:flex space-x-4">
              <Link
                to="/search"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/search' ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
              >
                Search Chefs
              </Link>
              {user.role === 'client' && (
                <>
                  <Link
                    to="/bookings"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === '/bookings' ? 'bg-white/20' : 'hover:bg-white/10'
                    }`}
                  >
                    My Bookings
                  </Link>
                  <Link
                    to="/profile"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === '/profile' ? 'bg-white/20' : 'hover:bg-white/10'
                    }`}
                  >
                    Profile
                  </Link>
                </>
              )}
              {user.role === 'chef' && (
                <>
                  <Link
                    to="/chef/bookings"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === '/chef/bookings' ? 'bg-white/20' : 'hover:bg-white/10'
                    }`}
                  >
                    My Bookings
                  </Link>
                  <Link
                    to="/chef/profile"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === '/chef/profile' ? 'bg-white/20' : 'hover:bg-white/10'
                    }`}
                  >
                    Profile
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Hi, {user.name || user.email}!</span>
            <button
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
          <Navigation />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chef/profile" element={<ChefProfile />} />
            <Route path="/profile" element={<ClientProfile />} />
            <Route path="/search" element={<ChefSearch />} />
            <Route path="/bookings" element={<ClientBookings />} />
            <Route path="/chef/bookings" element={<ChefBookings />} />
            <Route path="/" element={<ChefSearch />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
