
import React from 'react'
import { useState } from 'react'
import userService from '../services/user'
import InfoBox from './InfoBox'

import '../styles/index.css'

const SignUp = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const signup = (e) => {

        e.preventDefault()

        // This fixes a warning to prevent race conditions.
        const f = async () => {

            if(password !== confirmPassword)
            {
                setError('Password fields don\'t match.')
                return false  
            }

            const user_exists = await userService.userExists(username)
            if(user_exists)
            {
                setError('User already exists.')
                return false
            }

            await userService.createNewUser(username,password) 
            setSuccess('User successfully created.')
            return true
        }

        const ret = f()
        if(!ret)
        {
            return
        }
    }

    return (
    <div class="flex flex-col justify-center items-center">
        <div class="bg-white rounded border-gray-400 m-4 p-5 w-10/12 md:w-1/4 h-60 items-center flex flex-col justify-center">
            <form onSubmit={signup}>
                    <p>Username:</p>
                    <input type="text" class="border-2" onChange={e => setUsername(e.target.value)}></input>
                    <p>Password:</p>
                    <input type="password" class="border-2" onChange={e => setPassword(e.target.value)}></input>
                    <p>Confirm password:</p>
                    <input type="password" class="border-2" onChange={e => setConfirmPassword(e.target.value)}></input>
                <div>
                    <a href="/" class="text-blue-400"> Already have an account?</a>
                </div>
                <div>
                    <button class="bg-blue-600 text-base text-white mt-2 p-2 rounded w-40" type="submit">Sign up</button>
                </div>
            </form>
        </div>

            {error !== '' && <InfoBox message={error} type='error' displayTime='5000' />}
            {success !== '' && <InfoBox message={success} type='success' displayTime='5000' />}
    </div>
   )
}

export default SignUp 
