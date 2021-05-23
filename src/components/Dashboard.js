import React, { useState, useEffect } from 'react'
import applicationService from '../services/application'
import Appartments from './Appartments'
import Applications from './Applications'

import '../styles/index.css'

import {
    Redirect,
    Link
} from 'react-router-dom'

const Dashboard = ({searchValue, sortBy, setCreateNewVisible, createNewVisible}) => {

    const [selectedList, setSelectedList] = useState('applications')

    return (
        <div>
            <div>
                {
                   selectedList === "applications" ? <Applications searchValue={searchValue} sortBy={sortBy} createNewVisible={createNewVisible} setCreateNewVisible={setCreateNewVisible} /> : <Appartments />
                }
            </div>
        </div>
    )
}

export default Dashboard
