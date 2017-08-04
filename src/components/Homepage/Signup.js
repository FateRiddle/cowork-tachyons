import React from 'react'
import { withRouter } from 'react-router'
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
          setTimeout(_ => this.props.history.push('./login'), 1500)
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
        <input
          className="pv2 pl3 mb3 w5 f4 outline-0 ba b--black-50 br-pill br2-ns"
          type="password"
          ref={n => (this.input_password_repeat = n)}
          placeholder="再写一遍密码"
        />
        <input
          className="pv2 pl3 mb3 w5 f4 outline-0 ba b--black-50 br-pill br2-ns"
          ref={n => (this.input_slogan = n)}
          placeholder="我们的口号是？"
        />
        <div
          className="ph3 pv-btn tracked-mega w5 tc f4 br-pill br2-ns bg-red white hover-bg-dark-red pointer"
          onClick={this.signup}
        >
          注册
        </div>
      </div>
    )
  }
}

Signup = withRouter(connect(null, { signup })(Signup))

export default Signup
