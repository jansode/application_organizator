import { useState } from 'react'
import Login from './components/Login'
import Applications from './components/Applications'
import Appartments from './components/Appartments'
import NewApplication from './components/NewApplication'
import TopBar from './components/TopBar'
import SignUp from './components/SignUp'

import AuthRoute from './components/AuthRoute'

import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom'

const App = () => {

    const [searchValue, setSearchValue] = useState('')
    const [sortBy, setSortBy] = useState('title')

    const [createNewVisible, setCreateNewVisible] = useState('')

    const checkLogin = () => {
        return localStorage.getItem('token') != null
    }

    const logout = (e) => {
        e.preventDefault()
        localStorage.removeItem('token')

        window.location.href = '/'
    }

    return (
        <div>
            <Router>
                <TopBar loggedIn={checkLogin()} setSearchValue={setSearchValue} setSortBy={setSortBy} logout={logout} setCreateNewVisible={setCreateNewVisible}/>
                <Switch>
                    <Route exact path="/">
                        <Login />
                    </Route>
                    <Route exact path="/signup">
                        <SignUp />
                    </Route>
                    <AuthRoute exact path="/applications">
                        <Applications searchValue={searchValue} sortBy={sortBy} setCreateNewVisible={setCreateNewVisible} createNewVisible={createNewVisible} />
                    </AuthRoute>
                    <AuthRoute exact path="/appartments">
                        <Appartments searchValue={searchValue} sortBy={sortBy} setCreateNewVisible={setCreateNewVisible} createNewVisible={createNewVisible} />
                    </AuthRoute>
                </Switch>
            </Router>
        </div>
    )
}

export default App;
