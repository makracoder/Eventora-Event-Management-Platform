import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaTicketAlt } from 'react-icons/fa';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(name, email, password);
            navigate('/verify-otp', { state: { email } });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-paper dark:bg-ink px-4 transition-colors duration-300">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-white/5 p-8 rounded-xl shadow-md w-full max-w-sm border border-transparent dark:border-white/10">
                <div className="text-center mb-6">
                    <FaTicketAlt className="text-coral text-3xl mx-auto mb-3" />
                    <h2 className="font-display text-2xl text-ink dark:text-paper">Get your ticket</h2>
                </div>

                {error && (
                    <div className="bg-coral/10 text-coral p-3 rounded mb-4 text-sm font-medium">{error}</div>
                )}

                <input
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full border-2 border-ink/10 dark:border-paper/20 bg-transparent text-ink dark:text-paper rounded-lg p-2.5 mb-4 focus:outline-none focus:border-coral transition-colors"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border-2 border-ink/10 dark:border-paper/20 bg-transparent text-ink dark:text-paper rounded-lg p-2.5 mb-4 focus:outline-none focus:border-coral transition-colors"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full border-2 border-ink/10 dark:border-paper/20 bg-transparent text-ink dark:text-paper rounded-lg p-2.5 mb-6 focus:outline-none focus:border-coral transition-colors"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-coral hover:bg-gold hover:text-ink text-white font-semibold p-2.5 rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                    {loading ? 'Creating account...' : 'Register'}
                </button>

                <p className="text-center text-sm mt-4 text-gray-500 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-coral font-semibold hover:text-gold">Log in</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;