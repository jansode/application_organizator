import React, { useState, useEffect, useRef } from 'react'
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

    const didMountRef = useRef(false)

    const [applications, setApplications] = useState([])
    const [createNewVisible, setCreateNewVisible] = useState(false)
    
    useEffect( async () => {
        const apps = await applicationService.getUserApplications()
        setApplicationsWrapper(apps)
    }, [searchValue, sortBy]);

    const setApplicationsWrapper = (apps) => {
        sortApplications(apps)
    }

    const sortApplications = (apps) => {
        let filteredList = [...apps]
        if(searchValue != '')
        {
            filteredList = apps.filter((element) => {
                return element[sortBy].toLowerCase().startsWith(searchValue.toLowerCase()) 
            })
        }

        if(filteredList.length != 0)
        {
            filteredList.sort((a,b) => {
                return a[sortBy].localeCompare(b[sortBy],'en-US',{ignorePunctuation : true})
                })

        }
        setApplications(filteredList)
    }

    const updateApplication = (application) => {
        const index = applications.findIndex((a) => {
            return a.id === application.id
        })

        const tmp = [...applications]
        tmp[index] = application
        setApplicationsWrapper(tmp)
    }

    const deleteApplication = async (applicationId) => {
        await applicationService.deleteUserApplication(applicationId)

        const a = await applicationService.getUserApplications()
        setApplicationsWrapper(a)
    }

    return (
        <div>

        <div class="flex flex-col justify-center items-center pt-1">
        { createNewVisible ? 
            <NewApplication setCreateNewVisible={setCreateNewVisible} setApplications={setApplicationsWrapper}/> : 
            <div class="add-new-plus mt-3 mb-4" onClick={(e) => {e.preventDefault(); setCreateNewVisible(true)}}>
                <div class="add-new-plus1 mt-3"></div>
                <div class="add-new-plus2 mt-3"></div>
            </div>
        }

        {
            applications.length != 0 ? applications.map((application) => ( 
                <ListCard key={application.id} application={application} deleteApplication={deleteApplication} updateApplication={updateApplication} />
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
