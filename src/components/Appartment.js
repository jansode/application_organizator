import React, { useState, useEffect, useRef } from 'react'
import Utils from './Utils'

import { saveAs } from 'file-saver'
import { pdfExporter } from 'quill-to-pdf'

import appartmentImage from '../images/appartment.jpeg'

import Calendar from 'react-calendar'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import Delta from 'quill-delta'

import appartmentService from '../services/appartment'
import Constants from '../constants'

const Appartment = ({appartment, deleteAppartment, updateAppartment}) => {

    const quillRef = useRef(null) 
    const calendarWrapperRef = useRef(null)
    const editCardWrapperRef = useRef(null)

    const [statusImage, setStatusImage] = useState('edit')
    const [editing, setEditing] = useState(false)

    const [editTitle, setEditTitle] = useState(appartment.title)
    const [editUrl, setEditUrl] = useState(appartment.url)
    const [editAddress, setEditAddress] = useState(appartment.address)
    const [editSize, setEditSize] = useState(appartment.size)
    const [editDate, setEditDate] = useState(new Date(Date.parse(appartment.free_date)))

    const [calendarVisible, setCalendarVisible] = useState(false)

    useEffect(() => {
        document.onclick = (e) => {

            if(e.target.id !== "calendar" && calendarWrapperRef.current && !calendarWrapperRef.current.contains(e.target))
            {
                setCalendarVisible(false)        
            }

            if(e.target.id !== 'edit-button' && editCardWrapperRef.current && !editCardWrapperRef.current.contains(e.target))
            {
                setEditing(false)
            }
        }

    }, [editCardWrapperRef, calendarWrapperRef])

    const updateSentStatus = async (status) => {
        const data = {'status': status}
        await appartmentService.updateUserAppartment(appartment.id,data)

        setStatusImage(status)
    }

    const updateListItem = async () => {

        let missingFields = false
        if(editTitle === "")
        {
            document.getElementById('title').style.border = '1px solid #EF4444'
            missingFields = true
        }
        if(editUrl === "")
        {
            document.getElementById('url').style.border = '1px solid #EF4444'
            missingFields = true
        }
        if(editAddress === "")
        {
            document.getElementById('address').style.border = '1px solid #EF4444'
            missingFields = true
        }
        if(editSize === "")
        {
            document.getElementById('size').style.border = '1px solid #EF4444'
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

        const updated_appartment = {
            id: appartment.id,
            title: editTitle,
            url: editUrl,
            location: editAddress,
            status: statusImage,
            free_date: editDate,
        }

        await appartmentService.updateUserAppartment(appartment.id, updated_appartment)
        updateAppartment(updated_appartment)
        setEditing(false)
    }

    const handleUrlPrefix = () => {
        let formatted = appartment.url.trim()
        if(!formatted.startsWith('http://') && !formatted.startsWith('https://'))
        {
            formatted = 'https://' + formatted 
        }

        return formatted
    }

    const limitDisplayTextSize = (text, max_size) => {
        let substring = text.substring(0,max_size)
        if(substring.length == max_size)
        {
            substring += '...' 
        }
        return substring 
    }

    const calendarDiv = <div ref={calendarWrapperRef} class="md:w-1/2"><Calendar value={editDate} onClickDay={(v,e) => {setEditDate(new Date(Date.parse(v))); setCalendarVisible(false)}} /></div>

    return (
        <div ref={editCardWrapperRef} id="list-card-div" class="relative grid grid-rows-1 grid-cols-4 bg-white rounded border-gray-400 m-3 p-2 lg:w-1/2 shadow-md" key={appartment.id}> 

            {/* Delete post X */}
            <div class="absolute top-2 right-3">
                <a href="" onClick={(e) => {e.preventDefault(); deleteAppartment(appartment.id)}}>x</a>
            </div>
            
            {/* Edit/Sent icon X */}
            {!editing ? 
            <div class="row-span-1 col-span-1 flex flex-row items-center">
                <a href="" onClick={(e) => {e.preventDefault()}}><img src={appartmentImage} width="150" height="150"></img></a>
            </div>
            :
            <div></div>
            }

            {/* Info area */}
            {!editing ?

            <div class="row-span-1 col-span-2 pl-2">
                <div class="text-wrap text-lg text-blue-600">{limitDisplayTextSize(appartment.title,Constants.MAX_TITLE_SIZE)}</div>
                <a href={handleUrlPrefix()}  class=" text-wrap text-base text-blue-400">{limitDisplayTextSize(appartment.url,Constants.MAX_URL_SIZE)}</a>
                <p class="text-wrap text-base">{appartment.address}</p>
                <p class="text-wrap text-base">{appartment.size}</p>
                <p class="text-base">{Utils.getDateFormat(new Date(Date.parse(appartment.free_date)))}</p>
                <div><a href="" id="edit-button" class="text-base text-blue-400" onClick={(e) => {e.preventDefault(); setEditing(true)}}>Edit</a></div>
            </div>

            :

            <div class="row-span-1 col-span-4 pl-2 pr-6">
                <div class="text-lg text-blue-600 border-2"><input id="title" class="w-full" value={editTitle}  onChange={(e) => {setEditTitle(e.target.value)}}/></div>
                <div class="text-base text-blue-400 border-2"><input id="url" class="w-full" value={editUrl}  onChange={(e) => {setEditUrl(e.target.value)}}/></div>
                <div class="text-base border-2"><input id="address" class="w-full" value={editAddress} onChange={(e) => {setEditAddress(e.target.value)}}/></div>
                <div class="text-base border-2"><input id="size" class="w-full" value={editSize} onChange={(e) => {setEditSize(e.target.value)}}/></div>
                <div class="text-base border-2"><input class="w-full" id="calendar" value={Utils.getDateFormat(editDate)} onFocus={() => {setCalendarVisible(true)}}/></div>

                {calendarVisible && calendarDiv}

                <a href="" class="text-base text-blue-400" onClick={(e) => {e.preventDefault(); updateListItem()}}>Save</a>
            </div>

            }
        </div>
    )

}

export default Appartment 
