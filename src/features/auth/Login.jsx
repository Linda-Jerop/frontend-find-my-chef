import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, isLoading, error, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    clearError();
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const result = await login(formData);
    
    if (result.success) {
      const user = useAuthStore.getState().user;
      // Redirect based on role
      if (user?.role === 'chef') {
        navigate('/chef/bookings');
      } else {
        navigate('/search');
      }
    }
  };

  const handleGoogleLogin = async () => {
    const result = await loginWithGoogle();
    
    if (result.success) {
      const user = useAuthStore.getState().user;
      // Redirect based on role
      if (user?.role === 'chef') {
        navigate('/chef/bookings');
      } else {
        navigate('/search');
      }
    }
    // Error is automatically set in the store and will be displayed
  };

  return (
    <div className="auth-container gradient-bg">
      <div className="auth-card">
        <div className="auth-icon">🍳</div>
        <h2 className="auth-title gradient-text">Welcome Back!</h2>
        <p className="auth-subtitle">Sign in to Find My Chef</p>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert-error">
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="form-error">{errors.email}</p>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="form-error">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="gradient-button"
            style={{width: '100%', marginTop: '8px'}}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
          
          <div className="divider">
            <span>Or continue with</span>
          </div>
          
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="google-btn"
          >
            Sign in with Google
          </button>
          
          <div className="auth-link">
            Don't have an account?{' '}
            <Link to="/register">Register here</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
    