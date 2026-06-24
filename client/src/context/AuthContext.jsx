import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const saveUser = (data) => {
        const userInfo = { _id: data._id, name: data.name, email: data.email, role: data.role };
        localStorage.setItem('token', data.token);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        setUser(userInfo);
    };

    const register = async (name, email, password) => {
        const { data } = await api.post('/auth/register', { name, email, password });
        return data;
    };

    const verifyOtp = async (email, otp) => {
        const { data } = await api.post('/auth/verify-otp', { email, otp });
        saveUser(data);
        return data;
    };

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        saveUser(data);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, register, verifyOtp, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};