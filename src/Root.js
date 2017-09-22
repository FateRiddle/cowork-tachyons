import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import createBrowserHistory from 'history/createBrowserHistory'
import { Router, Switch, Route, Redirect } from 'react-router-dom'
import App from './App'
import Home from './components/Homepage'

export const history = createBrowserHistory() //export to share with configureStore

const loggedIn = () => {
  if (window.localStorage.getItem('token')) {
    return true
  }
  return false
}

const PrivateRoute = ({ component, ...rest }) => {
  if (loggedIn()) {
    return <Route {...rest} component={component} />
  } else {
    return <Redirect to="/Home" />
  }
}

const Root = ({ store }) =>
  <Router history={history}>
    <Provider store={store}>
      <Switch>
        <Route path="/home" component={Home} />
        <PrivateRoute component={App} />
      </Switch>
    </Provider>
  </Router>

Root.propTypes = {
  store: PropTypes.object.isRequired
}

export default Root
