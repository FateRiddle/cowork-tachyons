import React from 'react'
// import { Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { signup } from 'actions'

class Signup extends React.Component {
  signup = () => {
    this.props
      .signup(
        this.input_name.value,
        this.input_password.value,
        this.input_password_repeat.value,
        this.input_slogan.value
      )
      .then(res => {
        if (res.value.message) {
          this.input_name.value = ''
          this.input_password.value = ''
          this.input_password_repeat.value = ''
          this.input_slogan.value = ''
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
        <input
          className="pa2 mb3 w5 f4 ba b--black-50 br2"
          type="password"
          ref={n => (this.input_password_repeat = n)}
          placeholder="再写一遍密码"
        />
        <input
          className="pa2 mb3 w5 f4 ba b--black-50 br2"
          ref={n => (this.input_slogan = n)}
          placeholder="我们的口号是？"
        />
        <div
          className="ph3 pv2 dim tracked-mega f4 br2 ba b--black-50 black-60"
          href="#"
          onClick={this.signup}
        >
          注册
        </div>
      </div>
    )
  }
}

Signup = connect(null, { signup })(Signup)

export default Signup
