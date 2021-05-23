import React from 'react'
import { useState } from 'react'
import applicationService from '../services/application'
import { Redirect, Link} from 'react-router-dom'

import '../styles/index.css'

const Login = ({ setToken }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    if(localStorage.getItem('token') != null)
    {
        return (
            <div>
            <Redirect to='/dashboard' />
            </div>
        )
    }

    const login = async (e) => {
        e.preventDefault()

        const token = await applicationService.login(username,password) 
        if(token === null){
            return
        }

        localStorage.setItem('token', token['token'])
        window.location.reload()
    }

    return (
    <div class="flex flex-row justify-center">
        <div class="bg-white rounded border-gray-400 m-4 p-5 w-10/12 h-60 items-center flex flex-row justify-center">
            <form onSubmit={login}>
                <label>
                    <p>Username</p>
                    <input type="text" class="border-2" onChange={e => setUsername(e.target.value)}></input>
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" class="border-2" onChange={e => setPassword(e.target.value)}></input>
                </label>
                <div>
                    <button class="bg-blue-600 text-base text-white mt-2 p-2 rounded w-40" type="submit">Log in</button>
                </div>

                <div>
                    <Link to="/signup">Sign up</Link>
                </div>
            </form>
        </div>
    </div>
   )
}

export default Login
