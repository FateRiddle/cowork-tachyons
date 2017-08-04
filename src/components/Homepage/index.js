import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Route, Link } from 'react-router-dom'
import Login from './Login'
import Signup from './Signup'
import Warning from './Warning'

class Home extends React.Component {
  componentDidUpdate() {
    console.log('update')
  }

  render() {
    const { match, warning } = this.props
    console.log(warning)
    return (
      <div className="flex flex-column">
        <Warning />
        <main>
          <header className="absolute flex justify-end items-center w-100 h3">
            <Link
              className="ph4 f4 tracked black-50 hover-red"
              to="/home/login"
            >
              登陆
            </Link>
            <Link
              className="ph4 f4 tracked black-50 hover-red"
              to="/home/signup"
            >
              注册
            </Link>
          </header>
          <main
            className={`flex-center ${match.isExact
              ? 'vh-100'
              : 'vh-50'} flex-column tp-h`}
          >
            <h1 className="f-6 tracked">
              C<span className="red">o</span>w<span className="red">o</span>rk
            </h1>
            <div className="f3 tracked">Work made simple</div>
          </main>
          <Route exact path="/home/login" component={Login} />
          <Route exact path="/home/signup" component={Signup} />
        </main>
      </div>
    )
  }
}

const mapStateToProps = ({ warning }) => ({ warning: warning.home })

const ConnectedHome = withRouter(connect(mapStateToProps)(Home))

export default Home
