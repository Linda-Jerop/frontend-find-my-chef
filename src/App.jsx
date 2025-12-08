import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chefs/:id" element={<ChefProfile />} />
          <Route path="/clients/:id" element={<ClientProfile />} />
          <Route path="/search" element={<ChefSearch />} />
          <Route path="/bookings" element={<ClientBookings />} />
          <Route path="/chef/bookings" element={<ChefBookings />} />
          <Route path="/" element={<ChefSearch />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
