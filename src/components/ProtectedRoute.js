import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
    if (isAuthenticated()) {
       if (localStorage.getItem('role') === '1') {
            return children;
    }
    }
    return <Navigate to="/login" />;
};

export default ProtectedRoute;
