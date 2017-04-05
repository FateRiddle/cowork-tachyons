import React from 'react'
import ReactDOM from 'react-dom'
import Root from './Root'
import configureStore from './configureStore'

it('renders without crashing', () => {
  const store = configureStore()
  const div = document.createElement('div');
  ReactDOM.render(<Root store={store} />, div);
});
