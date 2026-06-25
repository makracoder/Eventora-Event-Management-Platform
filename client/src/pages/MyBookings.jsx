import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';

const statusColor = {
    confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-coral/10 text-coral',
    pending: 'bg-gold/20 text-gold',
};

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchBookings(); }, []);

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/bookings/my');
            setBookings(data);
        } catch (err) {
            console.error('Error fetching bookings', err);
        } finally {
            setLoading(false);
        }
    };

    const cancelBooking = async (id) => {
        if (!window.confirm('Cancel this booking?')) return;
        try {
            await api.delete(`/bookings/${id}`);
            fetchBookings();
        } catch (err) {
            alert(err.response?.data?.message || 'Error cancelling booking');
        }
    };

    if (loading) return <p className="text-center py-20 font-mono text-gray-500 dark:text-gray-400 bg-paper dark:bg-ink min-h-screen">Loading your tickets...</p>;

    return (
        <div className="min-h-screen bg-paper dark:bg-ink transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 py-12">
                <h1 className="font-display text-3xl text-ink dark:text-paper mb-8">My tickets</h1>

                {bookings.length === 0 ? (
                    <div className="ticket-card bg-white dark:bg-white/5 rounded-xl shadow-md p-10 text-center border border-transparent dark:border-white/10">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">No tickets yet.</p>
                        <Link to="/" className="inline-block bg-coral hover:bg-gold hover:text-ink text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-300 hover:scale-105">
                            Browse events
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {bookings.map((booking) => (
                            <div key={booking._id} className="ticket-card bg-white dark:bg-white/5 rounded-xl shadow-md overflow-visible border border-transparent dark:border-white/10">
                                {booking.eventId ? (
                                    <>
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="font-bold text-lg text-ink dark:text-paper">{booking.eventId.title}</h3>
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase font-mono ${statusColor[booking.status]}`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{new Date(booking.eventId.date).toLocaleDateString()}</p>
                                        </div>
                                        <div className="ticket-divider"></div>
                                        <div className="p-6 pt-4 flex justify-between items-center">
                                            <span className="font-mono text-gold font-bold">{booking.amount === 0 ? 'FREE' : `₹${booking.amount}`}</span>
                                            <div className="flex gap-4">
                                                <Link to={`/events/${booking.eventId._id}`} className="text-sm font-semibold text-ink dark:text-paper hover:text-coral">
                                                    View
                                                </Link>
                                                {booking.status !== 'cancelled' && (
                                                    <button onClick={() => cancelBooking(booking._id)} className="text-sm text-coral font-semibold hover:text-gold">
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-coral italic p-6">Event no longer available.</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;