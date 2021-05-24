import { useState, useEffect } from 'react'
import applicationService from './services/application'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Application from './components/Application'
import NewApplication from './components/NewApplication'
import TopBar from './components/TopBar'
import SignUp from './components/SignUp'

import AuthRoute from './components/AuthRoute'

import {
    BrowserRouter as Router,
    Switch,
    Link,
    Redirect,
    Route
} from 'react-router-dom'

const App = () => {

    const [token, setToken] = useState()
    const [users, setUsers] = useState([])

    const [searchValue, setSearchValue] = useState(false)
    const [sortBy, setSortBy] = useState('title')

    const [createNewVisible, setCreateNewVisible] = useState('')

    const checkLogin = () => {
        return localStorage.getItem('token') != null
    }

    const logout = (e) => {
        e.preventDefault()
        localStorage.removeItem('token')

        window.location.reload()
    }

    return (
        <div>
            <Router>
                <TopBar loggedIn={checkLogin()} setSearchValue={setSearchValue} setSortBy={setSortBy} logout={logout} setCreateNewVisible={setCreateNewVisible}/>
                <Switch>
                    <Route exact path="/">
                        <Login setToken = { setToken } />
                    </Route>
                    <Route exact path="/signup">
                        <SignUp />
                    </Route>
                    <AuthRoute exact path="/dashboard">
                        <Dashboard searchValue={searchValue} sortBy={sortBy} setCreateNewVisible={setCreateNewVisible} createNewVisible={createNewVisible}/>
                    </AuthRoute>
                    <AuthRoute path="/application/:id">
                        <Application />
                    </AuthRoute>

                    <AuthRoute path="/applications/new">
                        <NewApplication />
                    </AuthRoute>
                </Switch>
            </Router>
        </div>
    )
}

export default App;
