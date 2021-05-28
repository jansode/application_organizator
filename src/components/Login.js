import React from 'react'
import { useState } from 'react'
import applicationService from '../services/application'
import { Redirect, Link} from 'react-router-dom'
import InfoBox from './InfoBox'

import '../styles/index.css'

import useMessageQueue from './useMessageQueue'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [messages, addMessage] = useMessageQueue(10000)

    if(localStorage.getItem('token') != null)
    {
        return (
            <div>
                <Redirect to='/applications' />
            </div>
        )
    }

    const login = async (e) => {

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

        if(missingFields)
        {
            addMessage({message:'Missing fields.',type:'error'})
            return
        }

        const token = await applicationService.login(username,password) 
        if(token === null){
            addMessage({message:'Username or password is incorrect.', type:'error'})
            return
        }

        localStorage.setItem('token', token['token'])
        window.location.reload()
    }

    return (
    <div class="flex flex-col justify-center items-center">
        <div class="bg-white rounded border-gray-400 m-4 p-5 w-10/12 md:w-1/3 h-80 items-center flex flex-col justify-center shadow-md">
            <h2 class="text-3xl pt-5">Log in</h2>
            <form class="pt-5" onSubmit={login}>
                <label>
                    <p>Username</p>
                    <input id="username" type="text" class="border-2" onChange={e => setUsername(e.target.value)}></input>
                </label>
                <label>
                    <p>Password</p>
                    <input id="password" type="password" class="border-2" onChange={e => setPassword(e.target.value)}></input>
                </label>
                <div>
                    <button class="bg-blue-600 text-base text-white mt-2 p-2 rounded w-40" type="submit">Log in</button>
                </div>

                <div class="pt-2">
                    <Link to="/signup" class="text-blue-400">Sign up</Link>
                </div>
            </form>
        </div>
            
        {messages && messages.map((e,i) => {
            return <InfoBox message={e.message} type={e.type} key={e.key}/>
        })}


    </div>
   )
}

export default Login
