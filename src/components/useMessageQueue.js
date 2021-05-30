import React, { useState } from 'react'

const useMessageQueue = (removeInterval) => {
    const [key, setKey] = useState(0)
    const [elements, setElements] = useState([])

    const addMessage = (m) => {

        // Prevent duplicate messages
        if(elements.filter((e) => e.message === m.message).length !== 0)
        {
            return
        }

        // Remove first element based on removeInterval
        setTimeout(() => {
            setElements((e) => {
                let newElements = e.filter((e,i) => {if(i != 0) {return e}})
                return newElements
            })

            setKey(k => k - 1)
        }, removeInterval)

        const new_element = {...m, key: key}
        setKey(key + 1)

        let newElements = [...elements, new_element]
        setElements(newElements)
    }

    return [elements, addMessage]
}

export default useMessageQueue 

