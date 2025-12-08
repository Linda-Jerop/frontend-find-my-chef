import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { handleRegister } = useAuth();

    const onRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await handleRegister(email, password);
            setEmail('');
            setPassword('');
            navigate('/dashboard');
        } catch (err) {
            setError('An unknown error occurred during registration.');
            if (err?.code === 'auth/email-already-in-use') setError('Email is already in use.');
            if (err?.code === 'auth/invalid-email') setError('Invalid email address.');
            if (err?.code === 'auth/weak-password') setError('Password is too weak.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={onRegister} className="space-y-6">
            <h1 className="text-4xl font-black text-gray-900 mb-2 flex items-center">
                <span className="w-8 h-8 mr-2 text-violet-500" aria-hidden="true" />
                Find My Chef
            </h1>
            <p className="text-gray-500">Create your account to discover and book talented chefs</p>

            <div>
                <label className="flex text-sm font-medium text-gray-700 mb-2 items-center">
                    <span className="w-4 h-4 mr-1 text-violet-600" aria-hidden="true" />
                    Email Address
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder=""
                />
            </div>

            <div>
                <label className="flex text-sm font-medium text-gray-700 mb-2 items-center">
                    <span className="w-4 h-4 mr-1 text-violet-600" aria-hidden="true" />
                    Password
                </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Must be at least 8 characters"
                />
            </div>

            {error && <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

            <div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2 font-semibold text-white bg-violet-600 rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                    {loading ? 'Creating account...' : 'Register'}
                </button>
            </div>

            <div className="text-center pt-4">
                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <a href="/login" className="text-violet-600 hover:underline">
                        Sign in
                    </a>
                </p>
            </div>
        </form>
    );
}