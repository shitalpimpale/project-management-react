// src/components/Auth/Login.js
import React, { useState } from 'react';
import API from '../../api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        try {
            const { data } = await API.post('/auth/login', formData);
            console.log(data)
           // navigate('/dashboard'); // Redirect to dashboard
            if (data.status === 200) {
                localStorage.setItem('token', data.token); // Save token to localStorage
                localStorage.setItem('id', data.id);
                localStorage.setItem('email', data.email);
                localStorage.setItem('role', data.role);
                navigate('/dashboard'); // Redirect to dashboard
            } else {
                setError('Login failed');
            }

        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            }
    };
    return (
        <div className="container mt-5">
            <h2 className="text-center">Login</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Email</label>
                    <input
                        type="email"
                        id="username"
                        name="username"
                        className="form-control"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-control"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>
        </div>
    );
};

export default Login;
