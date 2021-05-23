import React from 'react'
import { Redirect, Route } from 'react-router'

const isLoggedIn = () => {
    return localStorage.getItem('token') != null
}

const AuthRoute = (props) => {

    const { path } = props
    if(!isLoggedIn())
    {
        return <Redirect to="/login" />
    }

   return <Route {...props}/> 
}

export default AuthRoute
