import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

export default function ProtectedRoute({ children, roles }) {
  const auth = useContext(AuthContext);
  if (!auth?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length) {
    const has = (auth.roles || []).some((r) => roles.includes(r));
    if (!has) return <div className="p-8">Unauthorized — insufficient role.</div>;
  }

  return children;
}
