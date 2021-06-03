import React, { useState, useEffect, useRef } from 'react'
import appartmentService from '../services/appartment'
import Utils from './Utils'
import Calendar from 'react-calendar'
import ValidationErrors from './ValidationErrors'

import { Icon, InlineIcon } from '@iconify/react';
import closeIcon from '@iconify-icons/clarity/window-close-line';

import '../styles/index.css'
import 'react-calendar/dist/Calendar.css';

import useFormValidator from './useFormValidator'

const NewAppartment = ({setCreateNewVisible, setAppartments}) => {

    const calendarWrapperRef = useRef(null)

    const [formTitle, setFormTitle] = useState('')
    const [formUrl, setFormUrl] = useState('')
    const [formDate, setFormDate] = useState(new Date(Date.now()))
    const [formAddress, setFormAddress] = useState('')
    const [formSize, setFormSize] = useState('')
    const [formRooms, setFormRooms] = useState('')

    const [calendarVisible, setCalendarVisible] = useState(false)
    const [createNewFlag, setCreateNewFlag] = useState(false)
    const [displayErrors, setDisplayErrors] = useState(false)

    const validationFields = [
            {id:'title', type:'string', required:true},
            {id:'url', type:'string', required:true},
            {id:'address', type:'string', required:true},
            {id:'size', type:'int', required:true}
    ]

    const [validationState, validateForm] = useFormValidator(validationFields)

    useEffect(() => {

        document.onclick = (e) => {
            if(e.target.id !== "calendar" && calendarWrapperRef.current && !calendarWrapperRef.current.contains(e.target))
            {
                setCalendarVisible(false)        
            }
        }

        if(validationState.success)
        {
            createNew()
        }

    }, [validationState, calendarWrapperRef])

    const createNew = async (e) => {

        const appartmentSize = parseInt(formSize,10)
        setFormSize(appartmentSize)

        await appartmentService.createUserAppartment({
            title: formTitle,
            url: formUrl,
            address : formAddress,
            size: appartmentSize,
            image: '',
            free_date: formDate,
            rooms: formRooms
        })

        const appartments = await appartmentService.getUserAppartments()
        setAppartments(appartments)

        setCreateNewVisible(false)
    }

    const fadeOut = () => {
        const element = document.getElementById('appartment')
        element.classList.add('fade-out')

        setTimeout(() => {
            setCreateNewVisible(false)
        },100)
    }

    const calendarDiv = <div ref={calendarWrapperRef}><Calendar value={formDate} onClickDay={(v,e) => {setFormDate(new Date(Date.parse(v))); setCalendarVisible(false)}} /></div>

    return (
        <div id="appartment" class="fade-in flex flex-col justify-center items-center relative bg-white rounded border-gray-400 m-3 p-10 lg:w-1/2 shadow-md"> 

            {/* Delete post */}
            <div class="absolute top-2 right-3 z-10 cursor-pointer">
                <Icon icon={closeIcon} onClick={fadeOut} color='#bbbbbb' height='20px' width='20px'/>
            </div>

            {/* Input area */}
            <div class="flex flex-col justify-center items-start pr-5 w-10/12">

                <div class="text-lg">Title:</div> <input id="title" class="border-2 w-full" type="text" onChange={(e) => {e.target.style.border = ''; setFormTitle(e.target.value)}}/>

                <div class="text-lg">Url:</div> <input id="url" class="border-2 w-full" type="text" onChange={(e) => {e.target.style.border = ''; setFormUrl(e.target.value)}}/>

                <div class="text-lg">Address:</div> <input id="address" class="border-2 w-full" type="text" onChange={(e) => {e.target.style.border =''; setFormAddress(e.target.value)}}/>

                <div class="text-lg">Size:</div><input id="size" class="border-2 w-full" type="text" onChange={(e) => {e.preventDefault(); setFormSize(e.target.value)}}/>

                <div class="text-lg">Rooms:</div><input id="rooms" class="border-2 w-full" type="text" onChange={(e) => {e.preventDefault(); setFormRooms(e.target.value)}}/>

                <div class="text-lg">Free date:</div><input class="border-2 w-full" id="calendar" type="text" value={Utils.getDateFormat(formDate)} onFocus={() => {setCalendarVisible(true)}} />

                {calendarVisible && calendarDiv}

                <ValidationErrors validationState = {validationState} />

                <div class="flex flex-row justify-center pt-6 w-full">
                    <button class="bg-blue-600 text-base text-white p-2 rounded w-40" onClick={validateForm}>Create</button>
                </div>
            </div>
        </div>

    )
}

export default NewAppartment
