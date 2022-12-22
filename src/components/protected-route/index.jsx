import { memo } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from 'src/hooks';

const ProtectedRoutes = () => {
  const isAuth = useAuth();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default memo(ProtectedRoutes);
