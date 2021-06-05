import React, { useState, useEffect } from 'react'
import appartmentService from '../services/appartment'
import Appartment from './Appartment'
import NewAppartment from './NewAppartment'

import Icon from '@iconify/react'
import plusCircleOutlined from '@iconify-icons/ant-design/plus-circle-outlined';

import 'react-dropdown/style.css'
import '../styles/index.css'

const Appartments = ({searchValue, sortBy, setSortByValues}) => {

    const [appartments, setAppartments] = useState([])
    const [createNewVisible, setCreateNewVisible] = useState(false)


    useEffect(() => {
    
        setSortByValues(['Title','Address'])

        const f = async () => {
            const apps = await appartmentService.getUserAppartments()
            setAppartmentsWrapper(apps)
        }

        f()

    }, [searchValue, sortBy]);

    const setAppartmentsWrapper = (apps) => {
        sortAppartments(apps)
    }

    const sortAppartments = (apps) => {
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
        setAppartments(filteredList)
    }

    const updateAppartment = (appartment) => {
        const index = appartments.findIndex((a) => {
            return a.id === appartment.id
        })

        const tmp = [...appartments]
        tmp[index] = appartment 
        setAppartments(tmp)
    }

    const deleteAppartment = async (appartmentId) => {
        await appartmentService.deleteUserAppartment(appartmentId)

        const a = await appartmentService.getUserAppartments()
        setAppartmentsWrapper(a)
    }

    return (
        <div>

        <div class="flex flex-col justify-center items-center pt-1">
        { createNewVisible ? 
            <NewAppartment setCreateNewVisible={setCreateNewVisible} setAppartments ={setAppartments}/> : 
            <Icon icon={plusCircleOutlined} width='50' height='50' color='#bbbbbb' onClick={(e) => {e.preventDefault(); setCreateNewVisible(true)}}/>
        }

        {appartments.length !== 0 ? 
            appartments.map((appartment) => ( 
                <Appartment key={appartment.id} appartment={appartment} deleteAppartment ={deleteAppartment} updateAppartment = {updateAppartment} />
            ))
            :
            <div></div>
        }
        </div>
        </div>
    )
}

export default Appartments 
