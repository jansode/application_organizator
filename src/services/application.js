import axios from 'axios'

const baseUrl = 'http://localhost:3001/api'

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

    console.log(response)
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

export default { login, getUserApplications, getUserApplication, getUserAppartment, getUserAppartments, deleteUserApplication, deleteUserAppartment, createUserApplication }
