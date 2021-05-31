import React, { useState, useEffect, useRef } from 'react'

import Utils from './Utils'
import Constants from '../constants'
import appartmentImage from '../images/appartment.jpeg'

import { saveAs } from 'file-saver'
import { pdfExporter } from 'quill-to-pdf'

import Calendar from 'react-calendar'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import Delta from 'quill-delta'

import appartmentService from '../services/appartment'

import useFormValidator from './useFormValidator'
import ValidationErrors from './ValidationErrors'

import { Icon, InlineIcon } from '@iconify/react'
import fileImageOutline from '@iconify-icons/mdi/file-image-outline'

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

            if(e.target.id !== 'edit-button' && editCardWrapperRef.current && !editCardWrapperRef.current.contains(e.target))
            {
                setEditing(false)
            }
        }

        if(validationState.success)
        {
            updateListItem()
        }

    }, [validationState, editCardWrapperRef, calendarWrapperRef])

    const updateListItem = async () => {

        if(quillRef.current != null)
        {
            await quillRef.current.blur()
        }

        const updated_appartment = {
            id: appartment.id,
            title: editTitle,
            url: editUrl,
            address: editAddress,
            free_date: editDate,
            size: editSize
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

    const chooseImage = () => {

        let input = document.createElement('input')
        input.type = 'file'
        input.id = 'file-input'
        input.click()
        input.onchange = () => {

            const f = async () => 
            {
                const file = input.files[0]

                if(!file.type.match('image.*'))
                {
                    alert("The uploaded file needs to be an image.")
                    return
                }

                let formData = new FormData()
                formData.append('imageData', input.files[0])
                const updated = await appartmentService.uploadAppartmentImage(appartment.id,formData)
                updateAppartment(updated)
            }

            f()
        }
    }

    const calendarDiv = <div ref={calendarWrapperRef} class="md:w-1/2"><Calendar value={editDate} onClickDay={(v,e) => {setEditDate(new Date(Date.parse(v))); setCalendarVisible(false)}} /></div>

    return (
        <div ref={editCardWrapperRef} id="list-card-div" class="relative grid grid-rows-1 grid-cols-4 bg-white rounded border-gray-400 m-3 p-2 lg:w-1/2 shadow-md" key={appartment.id}> 

            {/* Delete post X */}
            <div class="absolute top-2 right-3">
                <a href="" onClick={(e) => {e.preventDefault(); deleteAppartment(appartment.id)}}>x</a>
            </div>
            
            {/* Appartment image */}
            {!editing ? 
            <div onClick={() => { chooseImage() } } class="row-span-1 col-span-1 flex flex-row items-center justify-center" style={{cursor : 'pointer'}}>
                    <Icon icon={fileImageOutline} width="150" height="150" />
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
                <p class="text-wrap text-base">{appartment.size}m<sup>2</sup></p>
                <p class="text-base">{Utils.getDateFormat(new Date(Date.parse(appartment.free_date)))}</p>
                <div><a href="" id="edit-button" class="text-base text-blue-400" onClick={(e) => {e.preventDefault(); setEditing(true)}}>Edit</a></div>
            </div>

            :

            <div class="row-span-1 col-span-4 pl-2 pr-6 w-10/12">
                <div class="text-lg">Title:</div><div class="text-lg text-blue-600 border-2"><input id="title" class="w-full" value={editTitle}  onChange={(e) => {setEditTitle(e.target.value)}}/></div>
                <div class="text-lg">Url:</div><div class="text-base text-blue-400 border-2"><input id="url" class="w-full" value={editUrl}  onChange={(e) => {setEditUrl(e.target.value)}}/></div>
                <div class="text-lg">Address:</div><div class="text-base border-2"><input id="address" class="w-full" value={editAddress} onChange={(e) => {setEditAddress(e.target.value)}}/></div>
                <div class="text-lg">Size:</div><div class="text-base border-2"><input id="size" class="w-full" value={editSize} onChange={(e) => {setEditSize(e.target.value)}}/></div>
                <div class="text-lg">Free date:</div><div class="text-base border-2"><input class="w-full" id="calendar" value={Utils.getDateFormat(editDate)} onFocus={() => {setCalendarVisible(true)}}/></div>
                {calendarVisible && calendarDiv}

                <ValidationErrors validationState = {validationState} />

                <a href="" class="text-base text-blue-400" onClick={(e) => {e.preventDefault(); validateForm()}}>Save</a>
            </div>

            }
        </div>
    )
}

export default Appartment 
