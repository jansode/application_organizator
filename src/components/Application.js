import React, { useState, useEffect } from 'react'
import applicationService from '../services/application'

import {
    useParams
} from 'react-router-dom'

import '../styles/index.css'

const Application = () => {

    const id = useParams().id
    const [application, setApplication] = useState({})

    useEffect( async () => {
        const application  = await applicationService.getUserApplication(id)
        setApplication(application)
    }, [])

    if(application === null)
    {
        return (<div>Error: Could not retrieve application!</div>)
    }
    
    return (
        <div>
            <div class="header">
                <h2> {application.title} </h2>
            </div>

            <div class="content">
                <form>
                </form>
            </div>
        </div>
    )
}

export default Application
