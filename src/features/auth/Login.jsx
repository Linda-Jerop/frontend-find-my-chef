import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { handleLogin } = useAuth();

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await handleLogin(email, password);
            setEmail('');
            setPassword('');
            navigate('/dashboard');
        } catch (error) {
            if (error?.code === 'auth/user-not-found') {
                setError('No account found with this email.');
            } else if (error?.code === 'auth/wrong-password') {
                setError('Incorrect password.');
            } else if (error?.code === 'auth/invalid-email') {
                setError('Invalid email address.');
            } else {
                setError('Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
  <form onSubmit={onSubmit} className="space-y-6">
    <h1 className="text-3xl font-bold">Find My Chef</h1>
    <p className="text-gray-600">Sign in to book your perfect chef</p>

    <div>
        <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="email">Email</label>
        <input 
            type="email"
            id="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder=""
        />
    </div>
    <div>
        <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="password">Password</label>
        <input 
            type="password"
            id="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder=""
        />
    </div>

    {error && <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

    <div>
        <button type="submit" disabled={loading}
         className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {loading ? 'Signing in...' : 'Sign in'}
        </button>
    </div>

    <div className="text-center">
        <p className="text-sm text-gray-600">
            Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register Now</a>
        </p>

    </div>
    </form>
    );
};
    