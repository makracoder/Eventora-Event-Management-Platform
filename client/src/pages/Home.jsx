import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchEvents();
        }, 400);
        return () => clearTimeout(timeoutId);
    }, [search]);

    const fetchEvents = async () => {
        try {
            const { data } = await api.get(`/events?search=${search}`);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6">Upcoming events</h1>

            <div className="relative mb-8 max-w-md">
                <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search events..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {loading ? (
                <p className="text-center text-gray-500 py-20">Loading events...</p>
            ) : events.length === 0 ? (
                <p className="text-center text-gray-500 py-20">No events found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div key={event._id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
                            <div className="p-6 flex-grow flex flex-col">
                                <span className="text-xs font-bold text-gray-500 uppercase mb-2">{event.category}</span>
                                <h2 className="text-xl font-bold mb-3">{event.title}</h2>
                                <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                                    <FaCalendarAlt /> {new Date(event.date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                                    <FaMapMarkerAlt /> {event.location}
                                </div>
                                <div className="mt-auto">
                                    <p className="text-sm text-gray-500 mb-3">
                                        {event.availableSeats} of {event.totalSeats} seats left ·{' '}
                                        {event.ticketPrice === 0 ? 'Free' : `₹${event.ticketPrice}`}
                                    </p>
                                    <Link
                                        to={`/events/${event._id}`}
                                        className="block w-full text-center bg-gray-900 hover:bg-black text-white font-semibold py-2 rounded-lg transition"
                                    >
                                        View details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;