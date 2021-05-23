import React, { useState } from 'react'
import Utils from './Utils'

import { saveAs } from 'file-saver'
import { pdfExporter } from 'quill-to-pdf'

import ReactQuill from 'react-quill'
import Delta from 'quill-delta';

import QuillToPdf from 'quill-to-pdf'

import sentImage from '../images/mail-sent.jpg'
import editImage from '../images/mail-edited.jpg'

import {
    Link
} from 'react-router-dom'

const ListCard = ({application, index, deleteApplication}) => {

    const MAX_URL_SIZE = 60
    const DEFAULT_PDF_NAME = 'cover-letter.pdf'

    const [statusImage, setStatusImage] = useState('edit')

    const delta = new Delta(application.cover_letter)

    const downloadPdf = async () => {

        const pdfAsBlob = await pdfExporter.generatePdf(delta)
        saveAs(pdfAsBlob,DEFAULT_PDF_NAME)
    }

    const getUrlFormat = () => {
        let formatted = application.url
        if(!application.url.trim().startsWith('http://'))
        {
            formatted = 'http://' + formatted 
        }

        return formatted
    }

    return (
        <div class="relative grid grid-rows-1 grid-cols-4 bg-white rounded border-gray-400 m-3 p-2 lg:w-1/2" key={index}> 

            {/* Delete post X */}
            <div class="absolute top-2 right-3">
                <a href="" onClick={(e) => {e.preventDefault(); deleteApplication(application.id)}}>x</a>
            </div>

            {/* Edit/Sent icon X */}
            <div class="row-span-1 col-span-1 flex flex-row items-center">
                <a href="" onClick={(e) => {e.preventDefault()}}><img src={statusImage === 'edit' ? editImage : sentImage} onClick={() => {setStatusImage(statusImage === 'edit' ? 'sent' : 'edit')}}width="150" height="150"></img></a>
            </div>

            {/* Info area */}
            <div class="row-span-1 col-span-2 pl-2">
                <div class="text-lg text-blue-600"><Link to={"/application/"+application.id}>{application.title}</Link></div>
                <a href={getUrlFormat()}  class="text-base text-blue-400">{application.url.substring(0,MAX_URL_SIZE)}</a>
                <p class="text-base">{application.location}</p>
                <p class="text-base">{Utils.getDateFormat(application.end_date)}</p>

                {
                    delta.length() != 0 ?
                    <a href="" class="text-base text-green-400" onClick={(e) => {e.preventDefault(); downloadPdf()}}>Cover letter</a>
                    :
                    <p class="text-base text-red-400">No letter added</p>

                }
            </div>

            <div class="col-span-1"></div>
        </div>
    )

}

export default ListCard
