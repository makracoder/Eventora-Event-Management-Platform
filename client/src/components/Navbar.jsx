import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaTicketAlt, FaMoon, FaSun } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('darkMode') === 'true';
        setDarkMode(saved);
        document.documentElement.classList.toggle('dark', saved);
    }, []);

    const toggleDarkMode = () => {
        const next = !darkMode;
        setDarkMode(next);
        localStorage.setItem('darkMode', next);
        document.documentElement.classList.toggle('dark', next);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-ink sticky top-0 z-50 border-b border-white/10">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center py-4 gap-4">
                    <Link to="/" className="text-paper font-display text-xl flex items-center gap-2 hover:text-coral transition-colors duration-300">
                        <FaTicketAlt className="text-coral" /> EVENTORA
                    </Link>
                    <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-7">
                        <Link to="/#events" className="relative text-gray-300 hover:text-paper transition-colors duration-300 group text-sm font-medium tracking-wide">
    EVENTS
                            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-coral transition-all duration-300 group-hover:w-full"></span>
                        </Link>

                        {user ? (
                            <>
                                <Link to="/my-bookings" className="relative text-gray-300 hover:text-paper transition-colors duration-300 group text-sm font-medium tracking-wide">
                                    MY TICKETS
                                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-coral transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                                {user.role === 'admin' && (
                                    <Link to="/admin" className="relative text-gray-300 hover:text-paper transition-colors duration-300 group text-sm font-medium tracking-wide">
                                        ADMIN
                                        <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-coral transition-all duration-300 group-hover:w-full"></span>
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="bg-white/10 hover:bg-coral text-paper px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="relative text-gray-300 hover:text-paper transition-colors duration-300 group text-sm font-medium tracking-wide">
                                    LOGIN
                                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-coral transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-coral hover:bg-gold hover:text-ink text-white px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 active:scale-95"
                                >
                                    Sign up
                                </Link>
                            </>
                        )}

                        <button
                            onClick={toggleDarkMode}
                            aria-label="Toggle dark mode"
                            className="text-gray-300 hover:text-gold transition-all duration-300 hover:rotate-12 text-lg"
                        >
                            {darkMode ? <FaSun /> : <FaMoon />}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;