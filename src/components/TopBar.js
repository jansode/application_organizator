import React, { useState, useEffect } from 'react'
import Dropdown from 'react-dropdown'
import userService from '../services/user'
import SideMenu from './SideMenu'

import '../styles/index.css'

const TopBar = ({loggedIn, setSearchValue, setSortBy, logout, setCreateNewVisible}) => {

    const [menuOpen, setMenuOpen] = useState(false)
    const [username, setUsername] = useState('')

    useEffect(() => {

        const f = async () =>{
            const user = await userService.getUser()
            if(loggedIn)
            {
                setUsername(user.username)
            }
        }

        f()

    }, [loggedIn])

    const dropdownOptions = [
        "Title",
        "Url",
        "Location"
    ]

    const defaultOption = dropdownOptions[0]

    if(loggedIn)
    {
        return (
            <div class="flex justify-center bg-gray-50 p-2">
            <div class="hamburger-menu mr-2" onClick={() => {setMenuOpen(!menuOpen)}}>
                <div class="hamburger-menu-bar1"></div>
                <div class="hamburger-menu-bar2"></div>
                <div class="hamburger-menu-bar3"></div>
            </div>
                <SideMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} username={username} logout={logout}/>

                <div class="flex flex-row justify-between lg:w-1/2 w-full items-center">
                    <input class="border-2 focus:border-2 focus:border-blue-200 text-gray-500 w-full h-11" type="text" onChange={(e) =>{setSearchValue(e.target.value)}}/>
                    <Dropdown options={dropdownOptions} onChange={(option) => {setSortBy(option.label.toLowerCase())}} value={defaultOption}/>
                </div>
            </div>
        )
    }


    return (
        <div> 
        </div>
    )
}

export default TopBar
