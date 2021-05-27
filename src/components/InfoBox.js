import React, { useState, useEffect } from 'react'

import '../styles/index.css'

const InfoBox = ({message, type}) => {
    const [style, setStyle] = useState(type === 'error' ? 'border-2 text-red-600 bg-red-200 border-red-400 ' : 'border-2 text-green-600 bg-green-200 border-green-400 ')

    return (
        <div class={`flex justify-center w-1/4 ${style} mb-3`}>
            <p>{message}</p>
        </div>
    )
}

export default InfoBox
