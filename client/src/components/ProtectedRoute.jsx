import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const owner = localStorage.getItem('owner');
    const token = localStorage.getItem('token');

    if (!owner || !token){
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute