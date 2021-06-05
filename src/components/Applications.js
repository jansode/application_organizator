import React, { useState, useEffect } from 'react'
import applicationService from '../services/application'
import Application from './Application'
import NewApplication from './NewApplication'
import 'react-dropdown/style.css'

import '../styles/index.css'

import Icon from '@iconify/react'
import plusCircleOutlined from '@iconify-icons/ant-design/plus-circle-outlined';


const Applications = ({searchValue, sortBy, setSortByValues}) => {

    const [applications, setApplications] = useState([])
    const [createNewVisible, setCreateNewVisible] = useState(false)
    
    useEffect(() => {

        setSortByValues(['Title', 'Location'])

        const f = async () => {
            const apps = await applicationService.getUserApplications()
            setApplicationsWrapper(apps)
        }

        f()

    }, [searchValue, sortBy]);

    const setApplicationsWrapper = (apps) => {
        sortApplications(apps)
    }

    const sortApplications = (apps) => {
        let filteredList = [...apps]
        if(searchValue !== '')
        {
            filteredList = apps.filter((element) => {
                return element[sortBy].toLowerCase().startsWith(searchValue.toLowerCase()) 
            })
        }

        if(filteredList.length !== 0)
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

            <Icon icon={plusCircleOutlined} width='50' height='50' color='#bbbbbb' onClick={(e) => {e.preventDefault(); setCreateNewVisible(true)}}/>
        }

        {applications.length !== 0 ? 
            applications.map((application) => ( 
                <Application key={application.id} application={application} deleteApplication={deleteApplication} updateApplication={updateApplication} />
            ))
            :
            <div></div>
        }
        </div>
        </div>
    )
}

export default Applications
