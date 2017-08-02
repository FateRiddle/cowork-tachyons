import { combineReducers } from 'redux'
import user from './user'

const byId = (state = {}, action) => {
  const { payload } = action
  switch (action.type) {
    // case 'ADD_USER':
    case 'EDIT_MY_NAME_LOADING':
      return {
        ...state,
        [payload.id]: user(state[payload.id], action)
      }
    case 'UPDATE_ALL_SUCCESS':
      const nextState = {}
      payload.users.forEach(user => {
        nextState[user.id] = user
      })
      return nextState
    case 'LOGOUT':
      return {}
    default:
      return state
  }
}

const allIds = (state = [], action) => {
  const { payload } = action
  switch (action.type) {
    case 'ADD_USER':
      return [...state, payload.qq]
    case 'DELETE_USER':
      return state.filter(qq => qq !== payload.qq)
    case 'UPDATE_ALL_SUCCESS':
      return payload.users.map(user => user.id)
    case 'LOGOUT':
      return []
    default:
      return state
  }
}

const users = combineReducers({
  byId,
  allIds
})

export default users
