import axios from 'axios'


let host = ''
if(process.env.NODE_ENV === 'development')
{
    host = 'http://localhost:3001'
}

const baseUrl = host + '/api'

const getUserAppartments = async () => {

    const token = localStorage.getItem('token')
    if(token === null)
    {
        return [] 
    }

    const config = {
        headers : { 'Authorization' : `Bearer ${token}` , 'Content-Type' : 'application/json'}
    }

    const response = await axios.get(baseUrl+'/appartments', config)
    return response.data
}

const getUserAppartment = async (appartmentId) => {

    const token = localStorage.getItem('token')
    if(token === null)
    {
        return null 
    }

    const config = {
        headers : { 'Authorization' : `Bearer ${token}` , 'Content-Type' : 'application/json'}
    }

    const response = await axios.get(baseUrl+`/appartments/${appartmentId}`, config)
    return response.data
}

const updateUserAppartment = async (appartmentId, data) => {

    const token = localStorage.getItem('token')
    if(token === null)
    {
        return null 
    }

    const config = {
        headers : { 'Authorization' : `Bearer ${token}` , 'Content-Type' : 'application/json'}
    }

    const response = await axios.put(baseUrl+`/appartments/${appartmentId}`, data, config)
    return response.data
}

const deleteUserAppartment = async (appartmentId) => {

    const token = localStorage.getItem('token')
    if(token === null)
    {
        return null 
    }

    const config = {
        headers : { 'Authorization' : `Bearer ${token}` , 'Content-Type' : 'application/json'}
    }

    const response = await axios.delete(baseUrl+`/appartments/${appartmentId}`, config)
    return response.data
}

const createUserAppartment = async (appartment) => {

    const token = localStorage.getItem('token')
    if(token === null)
    {
        return null 
    }

    const config = {
        headers : { 'Authorization' : `Bearer ${token}` , 'Content-Type' : 'application/json'}
    }

    const data = {
        ...appartment,
        user: token.user 
    }

    const response = await axios.post(baseUrl+'/appartments/', data, config)
    return response.data
}

const uploadAppartmentImage = async (appartmentId, formData) => {

    const token = localStorage.getItem('token')
    if(token === null)
    {
        return null 
    }

    const config = {
        headers : { 'Authorization' : `Bearer ${token}` , 'Content-Type' : 'multipart/form-data'}
    }
    const response = await axios.post(baseUrl+'/appartments/'+appartmentId+'/upload_image', formData, config)

    return response.data
}

const appartmentService = {
    getUserAppartments, 
    getUserAppartment, 
    updateUserAppartment, 
    uploadAppartmentImage,
    deleteUserAppartment, 
    createUserAppartment
}

export default appartmentService 
