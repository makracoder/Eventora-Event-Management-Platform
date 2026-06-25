import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { FaCalendarAlt, FaMapMarkerAlt, FaChair, FaMoneyBillWave } from 'react-icons/fa';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events/${id}`);
                setEvent(data);
            } catch (err) {
                setError('Failed to load event.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleBooking = async () => {
        if (!user) { navigate('/login'); return; }
        setError(''); setSuccessMsg(''); setBookingLoading(true);
        try {
            if (!showOtp) {
                await api.post('/bookings/send-otp');
                setShowOtp(true);
                setSuccessMsg('OTP sent to your email — enter it below to confirm.');
            } else {
                await api.post('/bookings', { eventId: event._id, otp });
                setSuccessMsg('Booking requested! Awaiting admin confirmation.');
                setShowOtp(false); setOtp('');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return <p className="text-center py-20 font-mono text-gray-500 dark:text-gray-400 bg-paper dark:bg-ink min-h-screen">Loading...</p>;
    if (!event) return <p className="text-center py-20 text-coral bg-paper dark:bg-ink min-h-screen">{error || 'Event not found'}</p>;

    const isSoldOut = event.availableSeats <= 0;

    return (
        <div className="min-h-screen bg-paper dark:bg-ink transition-colors duration-300">
            <div className="max-w-2xl mx-auto px-4 py-12">
                <div className="ticket-card bg-white dark:bg-white/5 rounded-xl shadow-md overflow-visible border border-transparent dark:border-white/10">
                    <div className="p-8">
                        <span className="font-mono text-xs font-bold text-coral uppercase tracking-wider">{event.category}</span>
                        <h1 className="font-display text-3xl mt-2 mb-4 text-ink dark:text-paper">{event.title}</h1>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">{event.description}</p>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><FaCalendarAlt className="text-gold" /> {new Date(event.date).toLocaleDateString()}</div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><FaMapMarkerAlt className="text-gold" /> {event.location}</div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><FaMoneyBillWave className="text-gold" /> {event.ticketPrice === 0 ? 'Free' : `₹${event.ticketPrice}`}</div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><FaChair className="text-gold" /> {event.availableSeats} / {event.totalSeats} seats</div>
                        </div>
                    </div>

                    <div className="ticket-divider"></div>

                    <div className="p-8 pt-6">
                        {showOtp && (
                            <input
                                type="text"
                                placeholder="••••••"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6}
                                className="w-full border-2 border-ink/10 dark:border-paper/20 bg-transparent text-ink dark:text-paper rounded-lg p-2.5 mb-4 text-center font-mono text-xl tracking-[0.5em] focus:outline-none focus:border-coral transition-colors"
                            />
                        )}

                        <button
                            onClick={handleBooking}
                            disabled={isSoldOut || bookingLoading || (showOtp && !otp)}
                            className="w-full bg-coral hover:bg-gold hover:text-ink text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {bookingLoading ? 'Processing...' : isSoldOut ? 'Sold out' : showOtp ? 'Verify OTP & book' : 'Request booking'}
                        </button>

                        {error && <p className="text-coral mt-4 text-center text-sm font-medium">{error}</p>}
                        {successMsg && <p className="text-green-600 dark:text-green-400 mt-4 text-center text-sm font-medium">{successMsg}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;