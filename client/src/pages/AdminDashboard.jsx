import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: ''
    });

    useEffect(() => {
       
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [eventsRes, bookingsRes] = await Promise.all([
                api.get('/events'),
                api.get('/bookings/my'), // admin role makes this return ALL bookings
            ]);
            setEvents(eventsRes.data);
            setBookings(bookingsRes.data);
        } catch (err) {
            console.error('Error loading admin data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await api.post('/events', formData);
            setShowForm(false);
            setFormData({ title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '' });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating event');
        }
    };

    const handleDeleteEvent = async (id) => {
        if (!window.confirm('Delete this event?')) return;
        try {
            await api.delete(`/events/${id}`);
            fetchData();
        } catch (err) {
            alert('Error deleting event');
        }
    };

    const handleConfirmBooking = async (id, paymentStatus) => {
        try {
            await api.put(`/bookings/${id}/confirm`, { paymentStatus });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Error confirming booking');
        }
    };

    const handleCancelBooking = async (id) => {
        if (!window.confirm("Cancel this booking?")) return;
        try {
            await api.delete(`/bookings/${id}`);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Error cancelling booking');
        }
    };

    if (loading) return <p className="text-center py-20">Loading admin panel...</p>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Admin dashboard</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-gray-900 hover:bg-black text-white font-semibold px-5 py-2 rounded-lg"
                >
                    {showForm ? 'Cancel' : '+ Create event'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleCreateEvent} className="bg-white p-6 rounded-xl shadow-md grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    <input required placeholder="Title" className="border rounded p-2" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                    <input required placeholder="Category" className="border rounded p-2" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                    <input required type="date" className="border rounded p-2" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                    <input required placeholder="Location" className="border rounded p-2" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                    <input required type="number" placeholder="Total seats" className="border rounded p-2" value={formData.totalSeats} onChange={e => setFormData({ ...formData, totalSeats: e.target.value })} />
                    <input required type="number" placeholder="Ticket price (0 = free)" className="border rounded p-2" value={formData.ticketPrice} onChange={e => setFormData({ ...formData, ticketPrice: e.target.value })} />
                    <textarea required placeholder="Description" className="border rounded p-2 md:col-span-2 h-24" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                    <button type="submit" className="md:col-span-2 bg-gray-900 hover:bg-black text-white font-semibold py-2 rounded-lg">
                        Publish event
                    </button>
                </form>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Events list */}
                <div>
                    <h2 className="text-xl font-bold mb-4">All events ({events.length})</h2>
                    <div className="bg-white rounded-xl shadow-md divide-y">
                        {events.length === 0 && <p className="p-4 text-gray-500">No events yet.</p>}
                        {events.map(event => (
                            <div key={event._id} className="p-4 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{event.title}</p>
                                    <p className="text-sm text-gray-500">{event.availableSeats}/{event.totalSeats} seats left</p>
                                </div>
                                <button onClick={() => handleDeleteEvent(event._id)} className="text-red-600 border border-red-200 px-3 py-1 rounded text-sm hover:bg-red-500 hover:text-white">
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bookings list */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Bookings ({bookings.length})</h2>
                    <div className="bg-white rounded-xl shadow-md divide-y">
                        {bookings.length === 0 && <p className="p-4 text-gray-500">No bookings yet.</p>}
                        {bookings.map(booking => (
                            <div key={booking._id} className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="font-semibold">{booking.eventId?.title || 'Deleted event'}</p>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                        booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {booking.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">{booking.userId?.name} ({booking.userId?.email})</p>
                                <p className="text-sm text-gray-600">{booking.amount === 0 ? 'Free' : `₹${booking.amount}`}</p>

                                {booking.status === 'pending' && (
                                    <div className="flex gap-2 mt-3">
                                        <button onClick={() => handleConfirmBooking(booking._id, 'paid')} className="text-xs font-bold bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded hover:bg-green-600 hover:text-white">
                                            Approve (paid)
                                        </button>
                                        <button onClick={() => handleConfirmBooking(booking._id, 'not_paid')} className="text-xs font-bold bg-gray-50 text-gray-700 border border-gray-200 px-3 py-1.5 rounded hover:bg-gray-800 hover:text-white">
                                            Approve (unpaid)
                                        </button>
                                        <button onClick={() => handleCancelBooking(booking._id)} className="text-xs font-bold bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded hover:bg-red-500 hover:text-white">
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;