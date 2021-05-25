import axios from 'axios'

let host = ''
if(process.env.NODE_ENV === 'development')
{
    host = 'http://localhost:3001'
}

const baseUrl = host + '/api'

const login = async (user,pass) => {

    const params = {
        username : user,
        password : pass 
    }

    const response = await axios.post(baseUrl+'/login', params)
    return response.data
}

const getUserApplications = async () => {

    const token = localStorage.getItem('token')
    if(token === null)
    {
        return [] 
    }

    const config = {
        headers : { 'Authorization' : `Bearer ${token}` , 'Content-Type' : 'application/json'}
    }

    const response = await axios.get(baseUrl+'/applications', config)
    return response.data
}

const getUserApplication = async (applicationId) => {

    const token = localStorage.getItem('token')
    if(token === null)
    {
        return null 
    }

    const config = {
        headers : { 'Authorization' : `Bearer ${token}` , 'Content-Type' : 'application/json'}
    }

    const response = await axios.get(baseUrl+`/applications/${applicationId}`, config)
    return response.data
}

const updateUserApplication = async (applicationId, data) => {

    const token = localStorage.getItem('token')
    if(token === null)
    {
        return null 
    }

    const config = {
        headers : { 'Authorization' : `Bearer ${token}` , 'Content-Type' : 'application/json'}
    }

    const response = await axios.put(baseUrl+`/applications/${applicationId}`, data, config)
    return response.data
}

const deleteUserApplication = async (applicationId) => {

    const token = localStorage.getItem('token')
    if(token === null)
    {
        return null 
    }

    const config = {
        headers : { 'Authorization' : `Bearer ${token}` , 'Content-Type' : 'application/json'}
    }

    const response = await axios.delete(baseUrl+`/applications/${applicationId}`, config)
    return response.data
}

const createUserApplication = async (application) => {

    const token = localStorage.getItem('token')
    if(token === null)
    {
        return null 
    }

    const config = {
        headers : { 'Authorization' : `Bearer ${token}` , 'Content-Type' : 'application/json'}
    }

    const data = {
        ...application,
        user: token.user 
    }

    console.log('createUserApplication: ')
    console.log(data)

    const response = await axios.post(baseUrl+'/applications/', data, config)
    return response.data
}


const getUserAppartments = async () => {

    const token = localStorage.getItem('token')
    if(token === null)
    {
        return [] 
    }

    const config = {
        headers : { 'Authorization' : `Bearer ${token}` }
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
        headers : { 'Authorization' : `Bearer ${token}` }
    }


    const response = await axios.get(baseUrl+`/appartment/${appartmentId}`, config)
    return response.data
}

const deleteUserAppartment = async (appartmentId) => {

    const token = localStorage.getItem('token')
    if(token === null)
    {
        return null 
    }

    const config = {
        headers : { 'Authorization' : `Bearer ${token}` }
    }

    const response = await axios.delete(baseUrl+`/appartments/${appartmentId}`, config)
    return response.data
}

const applicationService = {
    login, 
    getUserApplications, 
    getUserApplication, 
    updateUserApplication, 
    getUserAppartment, 
    getUserAppartments, 
    deleteUserApplication, 
    deleteUserAppartment, 
    createUserApplication 
}

export default applicationService 
