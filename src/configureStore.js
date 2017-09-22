import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import promise from 'redux-promise-middleware'
// import { persistedState } from './data'
import app from './reducers'
import { loadUser, saveUser, loadSearch, saveSearch } from './localStorage'
import throttle from 'lodash/throttle'
import api from './api'
import { history } from './Root'

const clearLocalStorage = () => {
  window.localStorage.setItem('token', '')
  api.setToken(null)
  //because subscription, 'me' will sync with state, so also be cleared... really?No, the otherway around
}

const localStorageMiddleware = store => next => action => {
  if (action.type === 'LOGIN_SUCCESS') {
    if (!action.payload.error) {
      window.localStorage.setItem('token', action.payload.token)
      saveUser({ name: action.payload.name, id: action.payload.id })
      api.setToken(action.payload.token)
    }
  } else if (
    action.type.endsWith('_ERROR') &&
    action.payload.response.status === 401
  ) {
    setTimeout(_ => {
      history.push('/home/login')
      clearLocalStorage()
      store.dispatch({ type: 'LOGOUT' })
    }, 2000)
    //Here I want to manually route to /home
    // setTimeout(_ => history.push('/home/login'), 1500)
  } else if (action.type === 'LOGOUT') {
    clearLocalStorage()
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
