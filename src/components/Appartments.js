import React, { useState, useEffect } from 'react'
import applicationService from '../services/application'

import '../styles/index.css'

import {
    Redirect,
    Link
} from 'react-router-dom'

const Appartments = () => {
    const [appartments, setAppartments] = useState([])

    useEffect( async () => {
        const appartments = await applicationService.getUserAppartments()
        setAppartments(appartments)
    }, [])

    const deleteAppartment = async (appartmentId) => {
        await applicationService.deleteUserAppartment(appartmentId)

        const appartments = await applicationService.getUserAppartments()
        setAppartments(appartments)
    }

    return (
        <div>
        {
            appartments.map((appartment,index) => (
                <div class="bg-white rounded" key={index}> 
                <div></div>
                <h3>{appartment.header}</h3>
                <Link to={'/appartments/' + appartment.id} className="application-link">Edit</Link>
                <a href="" onClick={(e) => {e.preventDefault(); deleteAppartment(appartment.id)}} className="application-link">Delete</a>
                </div>
            ))
        }
        </div>
    )
}

export default Appartments;
