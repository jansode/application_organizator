
import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import userService from '../services/user'
import InfoBox from './InfoBox'

import useMessageQueue from './useMessageQueue'

import '../styles/index.css'

const SignUp = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [messages, addMessage] = useMessageQueue(10000)

    const signup = (e) => {

        e.preventDefault()

        let missingFields = false
        if(username === '')
        {
            document.getElementById('username').style.border = '1px solid #EF4444'
            missingFields = true
        }
        if(password === '')
        {
            document.getElementById('password').style.border = '1px solid #EF4444'
            missingFields = true
        }
        if(confirmPassword === '')
        {
            document.getElementById('confirm-password').style.border = '1px solid #EF4444'
            missingFields = true
        }

        if(missingFields)
        {
            addMessage({message:'Missing fields', type:'error'})
            return
        }

        // This fixes a warning to prevent race conditions.
        const f = async () => {

            if(password !== confirmPassword)
            {
                addMessage({message:'Password fields don\'t match', type:'error'})
                setError('Password fields don\'t match.')
                return false  
            }

            const user_exists = await userService.userExists(username)
            if(user_exists)
            {
                addMessage({message:'User already exists.', type:'error'})
                return false
            }

            await userService.createNewUser(username,password) 
            addMessage({message:'User successfully created.', type:'success'})
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
        <div class="bg-white rounded border-gray-400 m-4 p-5 w-10/12 md:w-1/4 h-90 items-center flex flex-col justify-center">
            <h2 class="text-3xl pt-5">Sign up</h2>
            <form class="pt-5" onSubmit={signup}>
                    <p>Username:</p>
                    <input id="username" type="text" class="border-2" onChange={e => setUsername(e.target.value)}></input>
                    <p>Password:</p>
                    <input id="password" type="password" class="border-2" onChange={e => setPassword(e.target.value)}></input>
                    <p>Confirm password:</p>
                    <input id="confirm-password" type="password" class="border-2" onChange={e => setConfirmPassword(e.target.value)}></input>
                <div>
                    <button class="bg-blue-600 text-base text-white mt-2 p-2 rounded w-40" type="submit">Sign up</button>
                </div>
                <div class="pt-2">
                    <Link to="/" class="text-blue-400"> Already have an account?</Link>
                </div>
            </form>
        </div>
        {messages && messages.map((e,i) => {
            return <InfoBox message={e.message} type={e.type} key={e.key}/>
        })}
    </div>
   )
}

export default SignUp 
