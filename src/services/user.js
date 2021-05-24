import axios from 'axios'

const baseUrl = '/api'

const getUser = async () => {

    const token = localStorage.getItem('token')
    if(token === null)
    {
        return null
    }

    const config = {
        headers : { 'Authorization' : `Bearer ${token}`, 'Content-Type' : 'application/json'}
    }

    const response = await axios.get(baseUrl+'/users/from_token', config)
    return response.data
}

const getAllUsers = async () => {
    const response = await axios.get(baseUrl+'/users') 
    return response.data
}

const createNewUser = async (user, pass) => {
    
    const newUser = {
        username: user,
        password: pass 
    }

    const config = {
        headers : {'Content-Type' : 'application/json'}
    }

    const response = await axios.post(baseUrl+'/users', newUser, config)
    return response.data
}

export default {getUser, getAllUsers, createNewUser}
