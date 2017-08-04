import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { login } from 'actions'
import api from 'api'

class Login extends React.Component {
  state = { message: '' }

  login = () => {
    const { login, history } = this.props
    login(this.input_name.value, this.input_password.value).then(res => {
      if (res.value.token && res.value.id) {
        api.setToken(res.value.token)
        setTimeout(_ => history.push('/'), 500)
      }
    })
  }

  render() {
    return (
      <div className="flex flex-column items-center vh-25">
        <input
          className="pv2 pl3 mb3 w5 f4 outline-0 ba b--black-50 br-pill br2-ns"
          ref={n => (this.input_name = n)}
          placeholder="用户名"
        />
        <input
          className="pv2 pl3 mb3 w5 f4 outline-0 ba b--black-50 br-pill br2-ns"
          type="password"
          ref={n => (this.input_password = n)}
          placeholder="密码"
        />
        <div
          className="pv-btn tracked-mega w5 tc f4 br-pill br2-ns white bg-red hover-bg-dark-red pointer"
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
