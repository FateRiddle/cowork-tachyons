import { combineReducers } from 'redux'
import user from './user'

const byId = (state = {}, action) => {
  switch (action.type) {
    case "ADD_USER":
      return {
        ...state,
        [action.qq]: user(state[action.qq], action),
      }
    case "UPDATE_STATE":
      const nextState = {}
      action.users.forEach(user => {
        nextState[user.id] = user
      })
      return nextState
    default:
      return state
  }
}

const allIds = (state = [], action) => {
  switch (action.type) {
    case "ADD_USER":
      return [...state, action.qq]
    case "DELETE_USER":
      return state.filter(qq => qq !== action.qq)
    case "UPDATE_STATE":
      return action.users.map(user => user.id)
    default:
      return state
  }
}

const users = combineReducers({
  byId,
  allIds,
})

export default users
