import React, { useState, useEffect } from 'react'
import Dropdown from 'react-dropdown'
import CheeseburgerMenu from 'cheeseburger-menu'
import ReactRoundedImage from 'react-rounded-image'
import userService from '../services/user'
import orava from '../images/squirell.jpeg'

import '../styles/index.css'

import {
    useLocation,
    Link
} from 'react-router-dom'

const TopBar = ({loggedIn, setSearchValue, setSortBy, logout, setCreateNewVisible}) => {

    const [menuOpen, setMenuOpen] = useState(false)
    const [username, setUsername] = useState('')

    useEffect( async () => {
        const user = await userService.getUser()
        if(loggedIn)
        {
            setUsername(user.username)
        }

    }, [])

    const dropdownOptions = [
        "Title",
        "Url",
        "Location"
    ]

    const defaultOption = dropdownOptions[0]

    const location = useLocation().pathname

    if(loggedIn)
    {
        return (
            <div class="flex justify-center bg-gray-50 p-2">
            <div class="hamburger-menu mr-2" onClick={() => {setMenuOpen(!menuOpen)}}>
                <div class="hamburger-menu-bar1"></div>
                <div class="hamburger-menu-bar2"></div>
                <div class="hamburger-menu-bar3"></div>
            </div>
            {/*<button class="" onClick={() => {setMenuOpen(!menuOpen)}}></button>*/}

                <CheeseburgerMenu isOpen={menuOpen} closeCallback={() => {setMenuOpen(false)}}>
                    <div class="flex flex-col items-center h-full p-5">
                        <ReactRoundedImage imageWidth="100" imageHeight="100" image={orava}/>
                        <p class="text-lg">{username}</p>
                        <button onClick={logout}>Log out</button>
                    </div>
                </CheeseburgerMenu>

                <div class="flex flex-row justify-between lg:w-1/2 w-full items-center">
                    <input class="border-2 focus:border-2 focus:border-blue-200 text-gray-500 w-full h-11" type="text" onChange={(e) =>{setSearchValue(e.target.value)}}/>
                    <Dropdown options={dropdownOptions} onChange={(option) => {setSortBy(option.label.toLowerCase())}} value={defaultOption}/>
                </div>
            </div>
        )
    }


    return (
        <div>{/*
        <div class="flex justify-between items-center bg-gray-50 p-2">
            <div></div>
            <div class="text-lg font-bold">
                { location === '/login' ? <span>Sign up</span> : <span>Log in</span> }
            </div>
            */}
        
        </div>
    )
}

export default TopBar
