import React from 'react'
import { Redirect, Route } from 'react-router'

const isLoggedIn = () => {
    return localStorage.getItem('token') != null
}

const AuthRoute = (props) => {

    if(!isLoggedIn())
    {
        return <Redirect to="/" />
    }

   return <Route {...props}/> 
}

export default AuthRoute
