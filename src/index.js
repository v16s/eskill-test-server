import React from 'react'
import { render } from 'react-dom'
import App from './App'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import Login from './components/Login'
import Register from './components/Register'

render(
  <Router>
    <div>
      <Route exact path='/' component={App} />
      <Route path='/login' component={Login} />
      <Route path='/register' component={Register} />
    </div>
  </Router>,
  document.getElementById('root')
)
