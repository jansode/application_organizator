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

        const validation = async () => {
            if(validationState.success)
            {
                if(quillRef.current != null)
                {
                    await quillRef.current.blur()
                }
                createNew()
            }
        }

        validation()

    }, [validationState, calendarWrapperRef])

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

    const fadeOut = () => {

        const element = document.getElementById('application')
        element.classList.add('fade-out')

        setTimeout(() => {
            setCreateNewVisible(false)
        },100)
    }

    const calendarDiv = <div ref={calendarWrapperRef}><Calendar value={formDate} onClickDay={(v,e) => {setFormDate(new Date(Date.parse(v))); setCalendarVisible(false)}} /></div>


    const initializeQuillWidth = () => {

        console.log(quillRef.current.props.style)
        if(quillRef.current && !quillRef.current.props.style.width)
        {
            const style = quillRef.current.props.style
            quillRef.current.props.style = {...style, width : document.getElementById('cover-letter').offsetWidth}
        }
    }

    const coverLetterDiv = <div id="cover-letter"> <ReactQuill ref={quillRef} value={formCoverLetter} onBlur={(previousRange, source, editor) => {setFormCoverLetter(editor.getContents())}} modules={modules} formats={formats} style={{height : '500px', width : '100%'}} /></div>


    return (
        <div id="application" class="fade-in flex flex-col justify-center items-center relative bg-white rounded border-gray-400 m-3 p-10 w-11/12 lg:w-1/2 shadow-md"> 

            {/* Delete post */}
            <div class="absolute top-2 right-3 z-10">
                <a href="" onClick={(e) => {e.preventDefault(); fadeOut()}}>x</a>
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
