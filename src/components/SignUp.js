
import React from 'react'
import { useState } from 'react'
import applicationService from '../services/application'
import userService from '../services/user'
import { Redirect, Link} from 'react-router-dom'

import '../styles/index.css'

const SignUp = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    /*
    if(localStorage.getItem('token') != null)
    {
        return (
            <div>
            <Redirect to='/dashboard' />
            </div>
        )
    }
    */

    const signup = async (e) => {
        e.preventDefault()

        if(password != confirmPassword)
        {
            // TODO DO ERROR MESSAGE
            return
        }

        const users = await userService.getAllUsers()
        const filteredUsers = users.filter((user) => {
            return user.username === username
        })

        if(filteredUsers.length > 0)
        {
            // TODO DO ERROR MESSAGE
            return
        }

        const response = await userService.createNewUser(username,password) 
        window.location.reload()
    }

    return (
    <div class="flex flex-row justify-center">
        <div class="bg-white rounded border-gray-400 m-4 p-5 w-1/5 h-60 items-center flex flex-row justify-center">
            <form onSubmit={signup}>
                    <p>Username:</p>
                    <input type="text" class="border-2" onChange={e => setUsername(e.target.value)}></input>
                    <p>Password:</p>
                    <input type="password" class="border-2" onChange={e => setPassword(e.target.value)}></input>
                    <p>Confirm password:</p>
                    <input type="password" class="border-2" onChange={e => setConfirmPassword(e.target.value)}></input>
                <div>
                    <button class="bg-blue-600 text-base text-white mt-2 p-2 rounded w-40" type="submit">Sign up</button>
                </div>
            </form>
        </div>
    </div>
   )
}

export default SignUp 
