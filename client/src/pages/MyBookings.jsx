import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

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

    if (loading) return <p className="text-center py-20">Loading your bookings...</p>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-8">My bookings</h1>

            {bookings.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-10 text-center">
                    <p className="text-gray-500 mb-4">You haven't booked any events yet.</p>
                    <Link to="/" className="bg-gray-900 hover:bg-black text-white font-semibold px-6 py-2 rounded-lg">
                        Browse events
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="bg-white rounded-xl shadow-md p-6">
                            {booking.eventId ? (
                                <>
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-bold text-lg">{booking.eventId.title}</h3>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                                            booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                            booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-1">{new Date(booking.eventId.date).toLocaleDateString()}</p>
                                    <p className="text-sm text-gray-500 mb-4">{booking.amount === 0 ? 'Free' : `₹${booking.amount}`}</p>
                                    <div className="flex justify-between items-center">
                                        <Link to={`/events/${booking.eventId._id}`} className="text-sm font-semibold hover:underline">
                                            View event
                                        </Link>
                                        {booking.status !== 'cancelled' && (
                                            <button onClick={() => cancelBooking(booking._id)} className="text-sm text-red-600 font-semibold hover:underline">
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <p className="text-red-500 italic">Event no longer available.</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;