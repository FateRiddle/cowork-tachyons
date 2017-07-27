import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import promise from 'redux-promise-middleware'
// import { persistedState } from './data'
import app from './reducers'
import { loadUser, saveUser, loadSearch, saveSearch } from './localStorage'
import throttle from 'lodash/throttle'
import api from './api'

const localStorageMiddleware = store => next => action => {
  if (action.type === 'LOGIN_SUCCESS') {
    if (!action.payload.error) {
      window.localStorage.setItem('token', action.payload.token)
      saveUser({ name: action.payload.name, id: action.payload.id })
      api.setToken(action.payload.token)
    }
  } else if (action.type === 'LOGOUT') {
    window.localStorage.setItem('token', '')
    window.localStorage.setItem('me', '')
    window.localStorage.setItem('search', '')
    api.setToken(null)
    //because subscription, 'me' will sync with state, so also be cleared... really?
  }
  next(action)
}

const configureStore = () => {
  const middlewares = [
    thunk,
    promise({
      promiseTypeSuffixes: ['LOADING', 'SUCCESS', 'ERROR']
    }),
    localStorageMiddleware
  ]
  //rewrite dispatch
  if (process.env.NODE_ENV !== 'production') {
    middlewares.push(logger)
  }

  const store = createStore(
    app,
    { me: loadUser(), search: loadSearch() },
    applyMiddleware(...middlewares)
  )

  store.subscribe(
    throttle(() => {
      saveUser(store.getState().me)
      saveSearch(store.getState().search)
      window.store = store
    }, 1000)
  )

  return store
}

export default configureStore
