import React, { useState, useEffect } from 'react'

import '../styles/index.css'

const InfoBox = ({message, type, displayTime}) => {

    const [visible, setVisible] = useState(true)
    const [style, setStyle] = useState(type === 'error' ? 'border-2 text-red-600 bg-red-200 border-red-400 ' : 'border-2 text-green-600 bg-green-200 border-green-400 ')

    setTimeout(() => {
       setStyle('')
       setVisible(false) 
    }, displayTime)

    return (

        <div class={`flex justify-center w-1/4 ${style}`}>
        { visible ? <p>{message}</p>:<div></div>}
        </div>
    )
}

export default InfoBox
