import React, { useState, useEffect, useRef } from 'react'
import appartmentService from '../services/appartment'
import Utils from './Utils'

import Calendar from 'react-calendar'

import '../styles/index.css'
import 'react-calendar/dist/Calendar.css';
import 'quill/dist/quill.snow.css'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import Delta from 'quill-delta'

const NewAppartment = ({setCreateNewVisible, setAppartments}) => {

    const quillRef = useRef(null) 
    const calendarWrapperRef = useRef(null)

    const [formTitle, setFormTitle] = useState('')
    const [formUrl, setFormUrl] = useState('')
    const [formDate, setFormDate] = useState(new Date(Date.now()))
    const [formAddress, setFormAddress] = useState('')

    const [calendarVisible, setCalendarVisible] = useState(false)
    const [createNewFlag, setCreateNewFlag] = useState(false)

    useEffect(() => {

        document.onclick = (e) => {
            if(e.target.id !== "calendar" && calendarWrapperRef.current && !calendarWrapperRef.current.contains(e.target))
            {
                setCalendarVisible(false)        
            }
        }

        if(createNewFlag)
        {
            createNew()
            setCreateNewFlag(false)
        }

    }, [createNewFlag, calendarWrapperRef])

    const createNewButtonHandler = async () => {
        
        let missingFields = false
        if(formTitle === "")
        {
            document.getElementById('title').style.border = '1px solid #EF4444'
            missingFields = true
        }
        if(formUrl === "")
        {
            document.getElementById('url').style.border = '1px solid #EF4444'
            missingFields = true
        }
        if(formAddress === "")
        {
            document.getElementById('address').style.border = '1px solid #EF4444'
            missingFields = true
        }

        if(missingFields)
        {
            return
        }

        if(quillRef.current != null)
        {
            await quillRef.current.blur()
        }
        setCreateNewFlag(true)
    }

    const createNew = async (e) => {
        await appartmentService.createUserAppartment({
            title: formTitle,
            url: formUrl,
            address : formAddress,
            free_date: formDate,
        })

        const appartments = await appartmentService.getUserAppartments()
        setAppartments(appartments)

        setCreateNewVisible(false)
    }

    const calendarDiv = <div ref={calendarWrapperRef}><Calendar value={formDate} onClickDay={(v,e) => {setFormDate(new Date(Date.parse(v))); setCalendarVisible(false)}} /></div>

    return (
        <div class="flex flex-col justify-center items-center relative bg-white rounded border-gray-400 m-3 p-10 lg:w-1/2"> 

            {/* Delete post */}
            <div class="absolute top-2 right-3 z-10">
                <a href="" onClick={(e) => {e.preventDefault(); setCreateNewVisible(false)}}>x</a>
            </div>

            {/* Input area */}
            <div class="flex flex-col justify-center items-start pr-5 w-10/12">

                <div class="text-lg">Title:</div> <input id="title" class="border-2 w-full" type="text" onChange={(e) => {e.target.style.border = ''; setFormTitle(e.target.value)}}/>

                <div class="text-lg">Url:</div> <input id="url" class="border-2 w-full" type="text" onChange={(e) => {e.target.style.border = ''; setFormUrl(e.target.value)}}/>

                <div class="text-lg">Address:</div> <input id="address" class="border-2 w-full" type="text" onChange={(e) => {e.target.style.border =''; setFormAddress(e.target.value)}}/>

                <div class="text-lg">Free date:</div><input class="border-2 w-full" id="calendar" type="text" value={Utils.getDateFormat(formDate)} onFocus={() => {setCalendarVisible(true)}} />

                {calendarVisible && calendarDiv}

                <div class="flex flex-row justify-center pt-6 w-full">
                    <button class="bg-blue-600 text-base text-white p-2 rounded w-40" onClick={createNewButtonHandler}>Create</button>
                </div>

            </div>
        </div>

    )
}

export default NewAppartment
