import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../utils/axios';
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaTicketAlt } from 'react-icons/fa';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const timeoutId = setTimeout(() => { fetchEvents(); }, 400);
        return () => clearTimeout(timeoutId);
    }, [search]);

    useEffect(() => {
        if (location.hash === '#events') {
            const el = document.getElementById('events');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    }, [location]);

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
        <div className="min-h-screen bg-paper dark:bg-ink transition-colors duration-300">
            <div className="border-b border-gray-200 dark:border-white/10 px-4 py-16 text-center">
                <p className="font-mono text-coral text-sm tracking-widest mb-3">ADMIT ONE</p>
                <h1 className="font-display text-4xl md:text-6xl text-ink dark:text-paper leading-tight">
                    Don't miss<br />what's next.
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-md mx-auto">
                    Browse, book, and show up. Every event, one tap away.
                </p>
                <div className="relative mt-8 max-w-md mx-auto">
                    <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border-2 border-ink/10 dark:border-paper/20 rounded-full bg-white dark:bg-white/5 text-ink dark:text-paper focus:outline-none focus:border-coral transition-colors duration-300"
                    />
                </div>
            </div>

            <div id="events" className="max-w-6xl mx-auto px-4 py-12">
                {loading ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-20 font-mono">Loading events...</p>
                ) : events.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-20 font-mono">No events found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event) => (
                            <Link
                                to={`/events/${event._id}`}
                                key={event._id}
                                className="ticket-card cursor-pointer bg-white dark:bg-white/5 rounded-xl shadow-md hover:shadow-2xl overflow-visible flex flex-col transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-coral/50"
                            >
                                {event.image ? (
                                    <img src={event.image} alt={event.title} className="w-full h-40 object-cover rounded-t-xl" />
                                ) : (
                                    <div className="w-full h-40 bg-ink/5 dark:bg-white/5 rounded-t-xl flex items-center justify-center">
                                        <FaTicketAlt className="text-coral/40 text-3xl" />
                                    </div>
                                )}

                                <div className="p-6 pb-4">
                                    <span className="font-mono text-xs font-bold text-coral uppercase tracking-wider">{event.category}</span>
                                    <h2 className="text-xl font-bold mt-2 mb-3 text-ink dark:text-paper">{event.title}</h2>
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-1">
                                        <FaCalendarAlt className="text-gold" /> {new Date(event.date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                                        <FaMapMarkerAlt className="text-gold" /> {event.location}
                                    </div>
                                </div>

                                <div className="ticket-divider"></div>

                                <div className="p-6 pt-4">
                                    <div className="flex justify-between items-center font-mono text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">{event.availableSeats}/{event.totalSeats} seats</span>
                                        <span className="text-gold font-bold text-base">
                                            {event.ticketPrice === 0 ? 'FREE' : `₹${event.ticketPrice}`}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;