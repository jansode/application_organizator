import React, { useState, useEffect } from 'react'
import applicationService from '../services/application'
import Utils from './Utils'
import ListCard from './ListCard'
import NewApplication from './NewApplication'

import 'react-dropdown/style.css'

import squirell from '../images/squirell.jpeg'
import plusImage from '../images/plus.jpg'

import '../styles/index.css'

import {
    Link
} from 'react-router-dom'

const Applications = ({searchValue, sortBy}) => {

    const [applications, setApplications] = useState([])
    const [createNewVisible, setCreateNewVisible] = useState(false)
    

    useEffect( async () => {
        const applications = await applicationService.getUserApplications()
        setApplications(applications)
    }, [])


    const deleteApplication = async (applicationId) => {
        await applicationService.deleteUserApplication(applicationId)

        const applications = await applicationService.getUserApplications()
        setApplications(applications)
    }

    let filteredList = applications 
    if(searchValue != '')
    {
        filteredList = applications.filter((element) => {
            return element[sortBy].toLowerCase().startsWith(searchValue.toLowerCase()) 
        })
    }

    if(filteredList.length != 0)
    {
        filteredList.sort((a,b) => {
            return a[sortBy].localeCompare(b[sortBy],'en-US',{ignorePunctuation : true})
            })
    }

    return (
        <div>

        <div class="flex flex-col justify-center items-center pt-1">
        { createNewVisible ? 
            <NewApplication setCreateNewVisible={setCreateNewVisible} setApplications={setApplications}/> : 
            <div class="add-new-plus mt-3 mb-4" onClick={(e) => {e.preventDefault(); setCreateNewVisible(true)}}>
                <div class="add-new-plus1 mt-3"></div>
                <div class="add-new-plus2 mt-3"></div>
            </div>
        }

        {
            filteredList.length != 0 ? filteredList.map((application,index) => ( 
                <ListCard application={application} index={index} deleteApplication={deleteApplication}/>
            ))
            :
            <div></div>
        }
        <a class="text-gray-400 pt-10" href="https://www.vecteezy.com/free-vector/envelope-icon">Envelope Icon Vectors by Vecteezy</a>
        </div>
        </div>
    )
}

export default Applications
