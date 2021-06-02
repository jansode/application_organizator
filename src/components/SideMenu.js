import React, { useState, useEffect } from 'react'
import CheeseburgerMenu from 'cheeseburger-menu'
import ReactRoundedImage from 'react-rounded-image'
import orava from '../images/squirell.jpeg'
import { Link } from 'react-router-dom'

import { Icon, InlineIcon } from '@iconify/react';
import profileIcon from '@iconify-icons/gg/profile';

const SideMenu = ({menuOpen, setMenuOpen, username, logout}) => {

    return (
        <div>
            <CheeseburgerMenu isOpen={menuOpen} closeCallback={() => {setMenuOpen(false)}}>
                <div class="flex flex-col items-center h-full p-5">
                    <Icon icon={profileIcon} width="100" height="100" color="#bbbbbb"/>
                    <p class="text-2xl">{username}</p>
                    <button onClick={logout}>Log out</button>

                    <div class="pt-10">
                        <div><Link to="/applications">Applications</Link></div>
                        <div><Link to="/appartments">Appartments</Link></div>
                    </div>
                </div>
            </CheeseburgerMenu>
        </div>
    )
}

export default SideMenu
