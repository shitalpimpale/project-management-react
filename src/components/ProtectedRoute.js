import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
    if (isAuthenticated()) {
        if (localStorage.getItem('role') === 'admin') {
            return children;
        }
    }
    return <Navigate to="/login" />;
};

export default ProtectedRoute;
