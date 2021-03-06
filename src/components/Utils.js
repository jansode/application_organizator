const capitalizeFirst = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

const getDateFormat = (date) => {

    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
    let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
    return `${da}-${mo}-${ye}`
}

const Utils = {
    getDateFormat,
    capitalizeFirst
}

export default Utils 
