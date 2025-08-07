import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

interface Props {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const token = Cookies.get('token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
