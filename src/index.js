import 'es6-shim'
import React from 'react'
import ReactDOM from 'react-dom'
import configureStore from './configureStore'
import Root from './Root'
import 'semantic-ui-css/semantic.min.css'
import 'tachyons/css/tachyons.min.css'
import './index.css' //要在tachyons下，覆盖

const store = configureStore()

console.log(store.getState())
// getting state as global object accessible from outside React, if needed
// store.subscribe(() => window.reduxStore = store.getState())

ReactDOM.render(<Root store={store} />, document.getElementById('root'))
