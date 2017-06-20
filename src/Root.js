import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router,Switch,Route,Redirect } from 'react-router-dom'
import App from './App'
import Home from './components/Homepage'

const loggedIn = () => {
  if(window.localStorage.getItem('token')){
    return true
  }
  return false
}

const PrivateRoute = ({component, ...rest}) => {
  if(loggedIn()){
    return <Route {...rest} component={component} />
  }else{
    return <Redirect to="/Home" />
  }
}

const Root = ({ store }) => (
  <Router>
    <Provider store={store} >
      <Switch>
        <Route path='/home' component={Home} />
        <PrivateRoute component={App} />
      </Switch>
    </Provider>
  </Router>
)

Root.propTypes = {
  store: React.PropTypes.object.isRequired
}

export default Root
