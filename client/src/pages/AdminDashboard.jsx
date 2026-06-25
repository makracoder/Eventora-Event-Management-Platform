import { useState, useEffect } from 'react';
import api from '../utils/axios';

const statusColor = {
    confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-coral/10 text-coral',
    pending: 'bg-gold/20 text-gold',
};

const AdminDashboard = () => {
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: ''
    });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [eventsRes, bookingsRes] = await Promise.all([
                api.get('/events'),
                api.get('/bookings/my'),
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
        try { await api.delete(`/events/${id}`); fetchData(); } catch { alert('Error deleting event'); }
    };

    const handleConfirmBooking = async (id, paymentStatus) => {
        try { await api.put(`/bookings/${id}/confirm`, { paymentStatus }); fetchData(); }
        catch (err) { alert(err.response?.data?.message || 'Error confirming booking'); }
    };

    const handleCancelBooking = async (id) => {
        if (!window.confirm('Cancel this booking?')) return;
        try { await api.delete(`/bookings/${id}`); fetchData(); }
        catch (err) { alert(err.response?.data?.message || 'Error cancelling booking'); }
    };

    const inputClass = "border-2 border-ink/10 dark:border-paper/20 bg-transparent text-ink dark:text-paper rounded-lg p-2.5 focus:outline-none focus:border-coral transition-colors";

    if (loading) return <p className="text-center py-20 font-mono text-gray-500 dark:text-gray-400 bg-paper dark:bg-ink min-h-screen">Loading admin panel...</p>;

    return (
        <div className="min-h-screen bg-paper dark:bg-ink transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="font-display text-3xl text-ink dark:text-paper">Admin desk</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-coral hover:bg-gold hover:text-ink text-white font-semibold px-5 py-2.5 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                        {showForm ? 'Cancel' : '+ Create event'}
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleCreateEvent} className="bg-white dark:bg-white/5 p-6 rounded-xl shadow-md grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 border border-transparent dark:border-white/10">
                        <input required placeholder="Title" className={inputClass} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        <input required placeholder="Category" className={inputClass} value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                        <input required type="date" className={inputClass} value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                        <input required placeholder="Location" className={inputClass} value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                        <input required type="number" placeholder="Total seats" className={inputClass} value={formData.totalSeats} onChange={e => setFormData({ ...formData, totalSeats: e.target.value })} />
                        <input required type="number" placeholder="Ticket price (0 = free)" className={inputClass} value={formData.ticketPrice} onChange={e => setFormData({ ...formData, ticketPrice: e.target.value })} />
                        <textarea required placeholder="Description" className={`${inputClass} md:col-span-2 h-24`} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        <button type="submit" className="md:col-span-2 bg-ink dark:bg-coral hover:bg-coral text-white font-semibold py-2.5 rounded-lg transition-all duration-300 hover:scale-[1.01]">
                            Publish event
                        </button>
                    </form>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <h2 className="font-display text-xl text-ink dark:text-paper mb-4">Events ({events.length})</h2>
                        <div className="bg-white dark:bg-white/5 rounded-xl shadow-md divide-y divide-gray-100 dark:divide-white/10 border border-transparent dark:border-white/10">
                            {events.length === 0 && <p className="p-4 text-gray-500 dark:text-gray-400">No events yet.</p>}
                            {events.map(event => (
                                <div key={event._id} className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-ink dark:text-paper">{event.title}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{event.availableSeats}/{event.totalSeats} seats left</p>
                                    </div>
                                    <button onClick={() => handleDeleteEvent(event._id)} className="text-coral border border-coral/30 px-3 py-1 rounded text-sm hover:bg-coral hover:text-white transition-colors duration-300">
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="font-display text-xl text-ink dark:text-paper mb-4">Bookings ({bookings.length})</h2>
                        <div className="bg-white dark:bg-white/5 rounded-xl shadow-md divide-y divide-gray-100 dark:divide-white/10 border border-transparent dark:border-white/10">
                            {bookings.length === 0 && <p className="p-4 text-gray-500 dark:text-gray-400">No bookings yet.</p>}
                            {bookings.map(booking => (
                                <div key={booking._id} className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="font-semibold text-ink dark:text-paper">{booking.eventId?.title || 'Deleted event'}</p>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase font-mono ${statusColor[booking.status]}`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{booking.userId?.name} ({booking.userId?.email})</p>
                                    <p className="text-sm font-mono text-gold">{booking.amount === 0 ? 'FREE' : `₹${booking.amount}`}</p>

                                    {booking.status === 'pending' && (
                                        <div className="flex gap-2 mt-3">
                                            <button onClick={() => handleConfirmBooking(booking._id, 'paid')} className="text-xs font-bold bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800 px-3 py-1.5 rounded hover:bg-green-600 hover:text-white transition-colors duration-300">
                                                Approve (paid)
                                            </button>
                                            <button onClick={() => handleConfirmBooking(booking._id, 'not_paid')} className="text-xs font-bold bg-gray-50 dark:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 px-3 py-1.5 rounded hover:bg-ink hover:text-white transition-colors duration-300">
                                                Approve (unpaid)
                                            </button>
                                            <button onClick={() => handleCancelBooking(booking._id)} className="text-xs font-bold bg-coral/10 text-coral border border-coral/30 px-3 py-1.5 rounded hover:bg-coral hover:text-white transition-colors duration-300">
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
        </div>
    );
};

export default AdminDashboard;