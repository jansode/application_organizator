
import React from 'react'
import { useState } from 'react'
import userService from '../services/user'

import '../styles/index.css'

const SignUp = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const signup = (e) => {

        // This fixes a warning to prevent race conditions.
        const f = async () => {
            e.preventDefault()

            if(password !== confirmPassword)
            {
                // TODO DO ERROR MESSAGE
                return false  
            }

            const users = await userService.getAllUsers()
            const filteredUsers = users.filter((user) => {
                return user.username === username
            })

            if(filteredUsers.length > 0)
            {
                // TODO DO ERROR MESSAGE
                return false
            }

            await userService.createNewUser(username,password) 
            return true
        }

        if(!f())
        {
            return
        }

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
