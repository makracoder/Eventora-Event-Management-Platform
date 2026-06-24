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
        if (!user) {
            navigate('/login');
            return;
        }
        setError('');
        setSuccessMsg('');
        setBookingLoading(true);

        try {
            if (!showOtp) {
                await api.post('/bookings/send-otp');
                setShowOtp(true);
                setSuccessMsg('OTP sent to your email — enter it below to confirm.');
            } else {
                await api.post('/bookings', { eventId: event._id, otp });
                setSuccessMsg('Booking requested! Awaiting admin confirmation.');
                setShowOtp(false);
                setOtp('');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return <p className="text-center py-20">Loading...</p>;
    if (!event) return <p className="text-center py-20 text-red-500">{error || 'Event not found'}</p>;

    const isSoldOut = event.availableSeats <= 0;

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <div className="bg-white rounded-xl shadow-md p-8">
                <span className="text-xs font-bold text-gray-500 uppercase">{event.category}</span>
                <h1 className="text-3xl font-bold mt-2 mb-4">{event.title}</h1>
                <p className="text-gray-600 mb-6">{event.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div className="flex items-center gap-2"><FaCalendarAlt className="text-gray-400" /> {new Date(event.date).toLocaleDateString()}</div>
                    <div className="flex items-center gap-2"><FaMapMarkerAlt className="text-gray-400" /> {event.location}</div>
                    <div className="flex items-center gap-2"><FaMoneyBillWave className="text-gray-400" /> {event.ticketPrice === 0 ? 'Free' : `₹${event.ticketPrice}`}</div>
                    <div className="flex items-center gap-2"><FaChair className="text-gray-400" /> {event.availableSeats} / {event.totalSeats} seats left</div>
                </div>

                {showOtp && (
                    <input
                        type="text"
                        placeholder="6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        className="w-full border rounded p-2 mb-4 text-center text-lg tracking-widest"
                    />
                )}

                <button
                    onClick={handleBooking}
                    disabled={isSoldOut || bookingLoading || (showOtp && !otp)}
                    className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
                >
                    {bookingLoading
                        ? 'Processing...'
                        : isSoldOut
                        ? 'Sold out'
                        : showOtp
                        ? 'Verify OTP & book'
                        : 'Request booking'}
                </button>

                {error && <p className="text-red-600 mt-4 text-center text-sm">{error}</p>}
                {successMsg && <p className="text-green-600 mt-4 text-center text-sm">{successMsg}</p>}
            </div>
        </div>
    );
};

export default EventDetail;