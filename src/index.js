import 'es6-shim'
import React from 'react'
import ReactDOM from 'react-dom'
import configureStore from './configureStore'
import Root from './Root'
import './index.css'

const store = configureStore()

console.log(store.getState());

ReactDOM.render(
    <Root store={store} />,
  document.getElementById('root')
)
