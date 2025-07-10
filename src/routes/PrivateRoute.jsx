import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate } from 'react-router';

const PrivateRoute = ({childern}) => {

    const {user,loading} = useAuth();

    if(loading) {
        return <span className="loading loading-dots loading-lg"></span>
    }

    if(!user) {
        <Navigate to = "/login"></Navigate>
    }

    return childern;
};

export default PrivateRoute;