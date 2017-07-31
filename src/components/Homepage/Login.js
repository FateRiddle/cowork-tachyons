import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { login } from 'actions'

class Login extends React.Component {
  state = { message: '' }

  login = () => {
    this.props
      .login(this.input_name.value, this.input_password.value)
      .then(res => {
        if (res.value.token && res.value.id) {
          this.props.history.push('/')
        }
      })
  }

  render() {
    return (
      <div className="flex flex-column items-center vh-25">
        <input
          className="pa2 mb3 w5 f4 ba b--black-50 br2"
          ref={n => (this.input_name = n)}
          placeholder="用户名"
        />
        <input
          className="pa2 mb3 w5 f4 ba b--black-50 br2"
          type="password"
          ref={n => (this.input_password = n)}
          placeholder="密码"
        />
        <div
          className="ph3 pv2 dim tracked-mega f4 br2 ba b--black-50 black-60 pointer"
          onClick={this.login}
        >
          登陆
        </div>
      </div>
    )
  }
}

Login = withRouter(connect(null, { login })(Login))

export default Login
