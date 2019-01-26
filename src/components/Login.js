import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Form, Icon, Input, Button, Checkbox } from 'antd'

class Login extends Component {
  constructor () {
    super()
    this.state = {
      username: '',
      password: '',
      message: ''
    }
  }
  onChange = e => {
    const state = this.state
    state[e.target.name] = e.target.value
    this.setState(state)
  }

  onSubmit = e => {
    e.preventDefault()

    const { username, password } = this.state

    axios
      .post('http://localhost:3000/api/auth/login', { username, password })
      .then(result => {
        localStorage.setItem('jwtToken', result.data.token)
        this.setState({ message: '' })
        this.props.history.push('/')
      })
      .catch(error => {
        if (error.response.status === 401) {
          this.setState({
            message: 'Login failed. Username or password not match'
          })
        }
      })
  }

  render () {
    const { username, password, message } = this.state
    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          minHeight: '100vh'
        }}
      >
        <Form
          style={{
            maxWidth: '350px',
            alignSelf: 'center',
            border: '1px solid #ddd',
            padding: '25px',
            borderRadius: '4px'
          }}
          onSubmit={this.onSubmit}
          className='login-form'
        >
          <Form.Item>
            <Input
              prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
              name='username'
              onChange={this.onChange}
              value={username}
              placeholder='Username'
            />
          </Form.Item>
          <Form.Item>
            <Input
              prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
              name='password'
              onChange={this.onChange}
              value={password}
              type='password'
              placeholder='Password'
            />
          </Form.Item>
          <Form.Item>
            <a className='login-form-forgot' href=''>
              Forgot password
            </a>
            <Button
              type='primary'
              htmlType='submit'
              className='login-form-button'
              style={{
                width: '100%'
              }}
            >
              Log in
            </Button>
            Or <Link to='/register'>register now!</Link>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default Login
