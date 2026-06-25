import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelopeOpenText } from 'react-icons/fa';

const VerifyOtp = () => {
    const location = useLocation();
    const [email, setEmail] = useState(location.state?.email || '');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { verifyOtp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await verifyOtp(email, otp);
            navigate(data.role === 'admin' ? '/admin' : '/events');
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-paper dark:bg-ink px-4 transition-colors duration-300">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-white/5 p-8 rounded-xl shadow-md w-full max-w-sm border border-transparent dark:border-white/10">
                <div className="text-center mb-6">
                    <FaEnvelopeOpenText className="text-gold text-3xl mx-auto mb-3" />
                    <h2 className="font-display text-2xl text-ink dark:text-paper">Verify your email</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Enter the 6-digit code we sent you
                    </p>
                </div>

                {error && (
                    <div className="bg-coral/10 text-coral p-3 rounded mb-4 text-sm font-medium">{error}</div>
                )}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border-2 border-ink/10 dark:border-paper/20 bg-transparent text-ink dark:text-paper rounded-lg p-2.5 mb-4 focus:outline-none focus:border-coral transition-colors"
                />
                <input
                    type="text"
                    placeholder="••••••"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                    className="w-full border-2 border-ink/10 dark:border-paper/20 bg-transparent text-ink dark:text-paper rounded-lg p-2.5 mb-6 text-center font-mono text-xl tracking-[0.5em] focus:outline-none focus:border-coral transition-colors"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-coral hover:bg-gold hover:text-ink text-white font-semibold p-2.5 rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                    {loading ? 'Verifying...' : 'Verify'}
                </button>

                <p className="text-center text-sm mt-4 text-gray-500 dark:text-gray-400">
                    Back to <Link to="/register" className="text-coral font-semibold hover:text-gold">Register</Link>
                </p>
            </form>
        </div>
    );
};

export default VerifyOtp;