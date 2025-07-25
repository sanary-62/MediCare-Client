import React, { Children } from 'react';
import useAuth from '../hooks/useAuth';
import useUserRole from '../hooks/useUserRole';

const AdminRoute = ({children}) => {
    const {user, loading} = useAuth();
    const {role, roleLoading} = useUserRole();



    if (loading || roleLoading) {
    return <span className="loading loading-dots loading-lg"></span>;
  }

  if (!user || role !== 'admin') {
    return <Navigate to="/forbidden" />;
  }

  return children;
  
};

export default AdminRoute;