import React, { useState, useRef } from 'react'
import InfoBox from './InfoBox'
import useMessageQueue from './useMessageQueue'
import Utils from './Utils'

/*
{
    [
        {
            id : 'title',
            type: 'string' ,
            {required: true, message: 'Missing field.'},
            {check_type: true, message: ''} 
        },
        {
            id : 'size',
            type: 'int' ,
            {required: true, message: 'Missing field.'},
            {check_type: true, message: 'Integer type expected.'} 
        }
        ...
    ]
}
*/

const defaultSettings = {
    border_style: '1px solid #EF4444'
}

const useFormValidator = (validationFields, validationSettings = defaultSettings) => {

    const [validationState, setValidationState] = useState({success:false, errors:[]})

    const validate = () => {
        let fields_with_errors = []
        let error_messages  = []
        validationFields.forEach((field) => {
            let has_error = false
            const element = document.getElementById(field.id)
            if(!element)
            {
                throw new TypeError('validationFields prop contains a non-existing id','useFormValidator.js')
            }

            if(element.value === '' && field.required)
            {
                has_error = true
                error_messages  = [...error_messages, `${Utils.capitalizeFirst(field.id)} field required.`]
            }
            else
            {
                if(field.type === 'int')
                {
                    const value = parseInt(element.value, 10)

                    if(Number.isNaN(value))
                    {
                        has_error = true
                        error_messages = [...error_messages, `${Utils.capitalizeFirst(field.id)} field must be an integer value.`]
                    }
                }
                else if(field.type === 'float')
                {
                    const value = parseFloat(element.value)

                    if(Number.isNaN(value))
                    {
                        has_error = true
                        error_messages = [...error_messages, `${Utils.capitalizeFirst(field.id)} field must be a float value.`]
                    }
                }
            }

            if(has_error)
            {
                element.style.border = validationSettings.border_style
                fields_with_errors = [...fields_with_errors, field]
            }
        })

        setValidationState({success:(fields_with_errors.length === 0),errors:error_messages}) 
    }

    return [validationState, validate]
}

export default useFormValidator 
