import React from 'react'
// import { Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { signup } from '../../actions'

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
      <div className="Signup">
        <input ref={n => (this.input_name = n)} placeholder="用户名" />
        <input
          type="password"
          ref={n => (this.input_password = n)}
          placeholder="密码"
        />
        <input
          type="password"
          ref={n => (this.input_password_repeat = n)}
          placeholder="再写一遍密码"
        />
        <input ref={n => (this.input_slogan = n)} placeholder="我们的口号是？" />
        <div className="button" onClick={this.signup}>注册</div>
      </div>
    )
  }
}

Signup = connect(null, { signup })(Signup)

export default Signup
