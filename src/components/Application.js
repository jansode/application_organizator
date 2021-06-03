import React, { useState, useEffect, useRef } from 'react'
import Utils from './Utils'

import { saveAs } from 'file-saver'
import { pdfExporter } from 'quill-to-pdf'

import sentImage from '../images/mail-sent.jpg'
import editImage from '../images/mail-edited.jpg'

import Calendar from 'react-calendar'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import Delta from 'quill-delta'

import applicationService from '../services/application'
import Constants from '../constants'

import useFormValidator from './useFormValidator'
import ValidationErrors from './ValidationErrors'

import { Icon, InlineIcon } from '@iconify/react';
import envelopeIcon from '@iconify-icons/bi/envelope';
import envelopeFill from '@iconify-icons/bi/envelope-fill';
import closeIcon from '@iconify-icons/clarity/window-close-line';

const Application = ({application, deleteApplication, updateApplication}) => {

    const quillRef = useRef(null) 
    const calendarWrapperRef = useRef(null)
    const editCardWrapperRef = useRef(null)

    const [statusImage, setStatusImage] = useState(application.status)
    const [editing, setEditing] = useState(false)

    const [editTitle, setEditTitle] = useState(application.title)
    const [editUrl, setEditUrl] = useState(application.url)
    const [editLocation, setEditLocation] = useState(application.location)
    const [editDate, setEditDate] = useState(new Date(Date.parse(application.end_date)))
    const [editCoverLetter, setEditCoverLetter] = useState(new Delta(application.cover_letter))

    const [calendarVisible, setCalendarVisible] = useState(false)
    const [coverLetterVisible, setCoverLetterVisible] = useState(false)

    const validationFields = [
            {id:'title', type:'string', required:true},
            {id:'url', type:'string', required:true},
            {id:'location', type:'string', required:true}
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

    const updateSentStatus = async (status) => {
        const data = {'status': status}
        await applicationService.updateUserApplication(application.id,data)

        setStatusImage(status)
    }

    const updateListItem = async () => {

        if(quillRef.current != null)
        {
            await quillRef.current.blur()
        }

        const updated_application = {
            id: application.id,
            title: editTitle,
            url: editUrl,
            location: editLocation,
            status: statusImage,
            end_date: editDate,
            cover_letter: editCoverLetter 
        }

        await applicationService.updateUserApplication(application.id, updated_application)
        updateApplication(updated_application)
        setEditing(false)
    }

    const downloadPdf = async () => {

        const pdfAsBlob = await pdfExporter.generatePdf(editCoverLetter)
        saveAs(pdfAsBlob,Constants.DEFAULT_PDF_NAME)
    }

    const handleUrlPrefix = () => {
        let formatted = application.url.trim()
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

    const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link'],
      ['clean']
    ],
    }

    const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link' 
    ]

    const fadeOut = () => {
        const element = document.getElementById(application.id)
        element.classList.add('fade-out')
        deleteApplication(application.id)
    }

    const calendarDiv = <div ref={calendarWrapperRef} class="md:w-1/2"><Calendar value={editDate} onClickDay={(v,e) => {setEditDate(new Date(Date.parse(v))); setCalendarVisible(false)}} /></div>

    const coverLetterDiv = <div class="cover-letter"> <ReactQuill ref={quillRef} value={editCoverLetter} onBlur={(previousRange, source, editor) => {setEditCoverLetter(editor.getContents())}} modules={modules} formats={formats} style={{height : '500px', marginBottom: '100px'}}/></div>

    const animate = editing ? 'fade-in' : ''

    return (
        <div ref={editCardWrapperRef} id={application.id} class={`${animate} relative grid grid-rows-1 grid-cols-4 bg-white rounded border-gray-400 m-3 p-2 w-11/12 lg:w-1/2 shadow-md`} key={application.id}> 

            {/* Delete post X */}
            <div class="absolute top-2 right-3 cursor-pointer">
                <Icon icon={closeIcon} onClick={fadeOut} color='#bbbbbb' height='20px' width='20px'/>
            </div>
            
            {/* Edit/Sent icon X */}
            {!editing ? 
            <div class="row-span-1 col-span-1 flex flex-row items-center justify-center">
                <Icon icon={statusImage === 'edit' ? envelopeIcon : envelopeFill} onClick={() => {updateSentStatus(statusImage === 'edit' ? 'sent' : 'edit')}} width='80' height='80' color='#bbbbbb'/>
            </div>
            :
            <div></div>
            }

            {/* Info area */}
            {!editing ?


            <div class="row-span-1 col-span-2 pl-2">
                <div class="text-wrap text-lg text-blue-600"><a href={handleUrlPrefix()}>{limitDisplayTextSize(application.title,Constants.MAX_TITLE_SIZE)}</a></div>
                <p class="text-wrap text-base">{application.location}</p>
                <p class="text-base">{Utils.getDateFormat(new Date(Date.parse(application.end_date)))}</p>

                {
                    editCoverLetter.length() != 0 ?
                    <a href="" class="text-base text-green-400" onClick={(e) => {e.preventDefault(); downloadPdf()}}>Cover letter</a>
                    :
                    <p class="text-base text-red-400">No letter added</p>

                }
                    <div><a href="" id="edit-button" class="text-base text-blue-400" onClick={(e) => {e.preventDefault(); setEditing(true)}}>Edit</a></div>
            </div>

            :

            <div class="row-span-1 col-span-4 pl-2 pr-6">
                <div class="text-lg">Title:</div><div class="text-lg text-blue-600 border-2"><input id="title" class="w-full" value={editTitle}  onChange={(e) => {setEditTitle(e.target.value)}}/></div>
                <div class="text-lg">Url:</div><div class="text-base text-blue-400 border-2"><input id="url" class="w-full" value={editUrl}  onChange={(e) => {setEditUrl(e.target.value)}}/></div>
                <div class="text-lg">Location:</div><div class="text-base border-2"><input id="location" class="w-full" value={editLocation} onChange={(e) => {setEditLocation(e.target.value)}}/></div>
                <div class="text-lg">End date:</div><div class="text-base border-2"><input class="w-full" id="calendar" value={Utils.getDateFormat(editDate)} onFocus={() => {setCalendarVisible(true)}}/></div>

                {calendarVisible && calendarDiv}

                <div class="text-lg">Cover letter:</div>
                {(coverLetterVisible || editing) && coverLetterDiv}

                <ValidationErrors validationState = {validationState} />

                <a href="" class="text-base text-blue-400" onClick={(e) => {e.preventDefault(); validateForm()}}> Save</a>
            </div>

            }
        </div>
    )

}

export default Application 
