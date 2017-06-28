import 'es6-shim'
import React from 'react'
import ReactDOM from 'react-dom'
import configureStore from './configureStore'
import Root from './Root'
import './index.css'
import 'semantic-ui-css/semantic.min.css'

const store = configureStore()

// getting state as global object accessible from outside React, if needed
// store.subscribe(() => window.reduxStore = store.getState())

ReactDOM.render(<Root store={store} />, document.getElementById('root'))
