import React, { useState, useEffect, useRef } from 'react'
import applicationService from '../services/application'
import Utils from './Utils'
import useFormValidator from './useFormValidator'
import ValidationErrors from './ValidationErrors'

import Calendar from 'react-calendar'

import '../styles/index.css'
import 'react-calendar/dist/Calendar.css';
import 'quill/dist/quill.snow.css'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import Delta from 'quill-delta'

const NewApplication = ({setCreateNewVisible, setApplications}) => {

    const quillRef = useRef(null) 
    const calendarWrapperRef = useRef(null)

    const [formTitle, setFormTitle] = useState('')
    const [formUrl, setFormUrl] = useState('')
    const [formDate, setFormDate] = useState(new Date(Date.now()))
    const [formLocation, setFormLocation] = useState('')
    const [formCoverLetter, setFormCoverLetter] = useState(new Delta())

    const [calendarVisible, setCalendarVisible] = useState(false)
    const [coverLetterVisible, setCoverLetterVisible] = useState(false)
    const [createNewFlag, setCreateNewFlag] = useState(false)

    const validationFields = [
            {id:'title', type:'string', required:true},
            {id:'url', type:'string', required:true},
            {id:'location', type:'string', required:true},
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
        if(formLocation === "")
        {
            document.getElementById('location').style.border = '1px solid #EF4444'
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
        await applicationService.createUserApplication({
            title: formTitle,
            url: formUrl,
            location: formLocation,
            status: 'edit',
            end_date: formDate,
            cover_letter: formCoverLetter
        })

        const applications = await applicationService.getUserApplications()
        setApplications(applications)

        setCreateNewVisible(false)
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

    const calendarDiv = <div ref={calendarWrapperRef}><Calendar value={formDate} onClickDay={(v,e) => {setFormDate(new Date(Date.parse(v))); setCalendarVisible(false)}} /></div>

    const coverLetterDiv = <div class="cover-letter"> <ReactQuill ref={quillRef} value={formCoverLetter} onBlur={(previousRange, source, editor) => {setFormCoverLetter(editor.getContents())}} modules={modules} formats={formats} style={{height : '500px'}}/></div>


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

                <div class="text-lg">Location:</div> <input id="location" class="border-2 w-full" type="text" onChange={(e) => {e.target.style.border =''; setFormLocation(e.target.value)}}/>

                <div class="text-lg">End date:</div><input class="border-2 w-full" id="calendar" type="text" value={Utils.getDateFormat(formDate)} onFocus={() => {setCalendarVisible(true)}} />

                {calendarVisible && calendarDiv}
                
                <div class="text-lg"><a href="" class="text-lg text-blue-400 " onClick={(e) => {e.preventDefault(); setCoverLetterVisible(!coverLetterVisible)}}>Cover letter</a></div>

                {coverLetterVisible && coverLetterDiv}

                <ValidationErrors validationState = {validationState} />

                <div class="flex flex-row justify-center pt-6 w-full">
                    <button class="bg-blue-600 text-base text-white p-2 rounded w-40" onClick={validateForm}>Create</button>
                </div>
            </div>
        </div>

    )
}

export default NewApplication
