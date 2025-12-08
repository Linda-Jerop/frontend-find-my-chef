import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import ChefProfile from './features/profile/ChefProfile';
import ClientProfile from './features/profile/ClientProfile';
import ChefSearch from './features/search/ChefSearch';
import ClientBookings from './features/bookings/ClientBookings';
import ChefBookings from './features/bookings/ChefBookings';

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
    <nav className="gradient-nav">
      <div className="navbar">
        <div className="nav-links">
          <Link to="/" className="nav-brand">🍳 FindMyChef</Link>
          <Link to="/search" className={`nav-link ${location.pathname === '/search' ? 'active' : ''}`}>
            Search Chefs
          </Link>
          {user.role === 'client' && (
            <>
              <Link to="/bookings" className={`nav-link ${location.pathname === '/bookings' ? 'active' : ''}`}>
                My Bookings
              </Link>
              <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>
                Profile
              </Link>
            </>
          )}
          {user.role === 'chef' && (
            <>
              <Link to="/chef/bookings" className={`nav-link ${location.pathname === '/chef/bookings' ? 'active' : ''}`}>
                My Bookings
              </Link>
              <Link to="/chef/profile" className={`nav-link ${location.pathname === '/chef/profile' ? 'active' : ''}`}>
                Profile
              </Link>
            </>
          )}
        </div>
        <div className="nav-user">
          <span>Hi, {user.name || user.email}!</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="gradient-bg">
        <Navigation />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chef/profile" element={<ChefProfile />} />
          <Route path="/profile" element={<ClientProfile />} />
          <Route path="/search" element={<ChefSearch />} />
          <Route path="/bookings" element={<ClientBookings />} />
          <Route path="/chef/bookings" element={<ChefBookings />} />
          <Route path="/" element={<ChefSearch />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
