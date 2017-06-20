import React from 'react'
import { Route, Link } from 'react-router-dom'
import Login from './Login'
import Signup from './Signup'
import classnames from 'classnames'
import Warning from './Warning'

class Home extends React.Component {
  render() {
    const { match } = this.props
    return (
      <div className="Home">
        <Warning />
        <header>
          <Link to="/home/login">登陆</Link>
          <Link to="/home/signup">注册</Link>
        </header>
        <main
          className={classnames({
            empty: match.isExact
          })}
        >
          <h1>Cowork</h1>
          <div>things make easy</div>
        </main>
        <Route exact path="/home/login" component={Login} />
        <Route exact path="/home/signup" component={Signup} />
      </div>
    )
  }
}

export default Home
