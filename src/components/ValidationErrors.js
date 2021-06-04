import React, { useState } from 'react'
import InfoBox from './InfoBox'

const ValidationErrors = ({validationState}) => {

    let error_messages = [] 
    if(!validationState.success) 
    {
        validationState.errors.forEach((error) => {
            error_messages.push(<InfoBox message={`- ${error}`} type='error' />)
        })
    }

    return (
        <div class="flex flex-col justify-center item-center w-full">

            { !validationState.success && error_messages }

        </div>
    )

}

export default ValidationErrors 
