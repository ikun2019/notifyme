import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
	if (isLoading) {
		return <LoadingSpinner />;
	}
	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}
	return children;
};

export default ProtectedRoute;
