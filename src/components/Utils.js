import React from 'react'

const getDateFormat = (date) => {
    console.log("getDateFormat:")
    console.log(date)

    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
    let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
    return `${da}-${mo}-${ye}`
}

export default {getDateFormat} 
