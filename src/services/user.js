import axios from 'axios'

let host = ''
if(process.env.NODE_ENV === 'development')
{
    host = 'http://localhost:3001'
}

const baseUrl = host + '/api'

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


    console.log(response.data)
    return response.data
}

const userExists = async(username) => {

    const config = {
        headers : {'Content-Type' : 'application/json'}
    }

    try {
        const result = await axios.get(baseUrl+'/users/exists/'+username, config)
        return result.data.user_exists

    } catch(error) {
        console.log(error)
    }
}

const userService = {
    getUser, 
    getAllUsers, 
    createNewUser,
    userExists
}

export default userService
