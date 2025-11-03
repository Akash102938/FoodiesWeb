import React from 'react'
import {Navigate} from 'react-router-dom'

function PrivateRoute({children}) {
    const isAuthenticated = Boolean(localStorage.getItem('loginData'));
    return isAuthenticated ? children : <Navigate to='/login' replace/>
}

export default PrivateRoute