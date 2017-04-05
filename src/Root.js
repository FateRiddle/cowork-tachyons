import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'

const Root = ({ store }) => (
  <Provider store={store} >
    <Router>
      <App />
    </Router>
  </Provider>
)

Root.propTypes = {
  store: React.PropTypes.object.isRequired
}

export default Root
