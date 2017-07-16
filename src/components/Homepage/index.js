import React from 'react'
import { Route, Link } from 'react-router-dom'
import Login from './Login'
import Signup from './Signup'
import Warning from './Warning'

class Home extends React.Component {
  render() {
    const { match } = this.props
    return (
      <div className="flex flex-column">
        <Warning />
        <header className="absolute flex justify-end items-center w-100 h3">
          <Link className="ph4 f4 black-50 hover-thin-blue" to="/home/login">
            登陆
          </Link>
          <Link className="ph4 f4 black-50 hover-thin-blue" to="/home/signup">
            注册
          </Link>
        </header>
        <main
          className={`flex-center ${match.isExact
            ? 'vh-100'
            : 'vh-50'} flex-column tp-h`}
        >
          <h1 className="f-6">Cowork</h1>
          <div className="f3">things make easy</div>
        </main>
        <Route exact path="/home/login" component={Login} />
        <Route exact path="/home/signup" component={Signup} />
      </div>
    )
  }
}

export default Home
