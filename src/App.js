import React, { Component } from 'react'
import { BrowserRouter, Route, Redirect } from 'react-router-dom'
import firebase from 'firebase'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@fortawesome/fontawesome-free/css/all.min.css'

import Navigation from './components/UI/Navigation'
import withAuthentication from './withAuthentication'

import Main from './components/Main'
import Profile from './components/Profile'
import Login from './components/Login'
import Marketplace from './components/Marketplace'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
}
firebase.initializeApp(firebaseConfig)

const Logout = () => {
  firebase.auth().signOut()
  return <Redirect to='/login' />
}

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      authUser: null
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(authUser => {
      authUser
        ? this.setState({ authUser })
        : this.setState({ authUser: null })
    })
  }

  render() {
    return (
      <BrowserRouter>
        <div className='container-fluid p-0 m-0'>
          <Navigation />

          <div className='p-3'>
            <Route exact path="/" component={Main} />
            <Route exact path="/marketplace" component={Marketplace} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/logout" component={Logout} />
            <Route exact path="/login" component={Login} />
          </div>
        </div>
      </BrowserRouter>
    )
  }
}

export default withAuthentication(App)
