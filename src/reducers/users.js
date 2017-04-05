import { combineReducers } from 'redux'
import user from './user'

const byId = (state = {}, action) => {
  switch (action.type) {
    case "ADD_USER":
      return {
        ...state,
        [action.qq]: user(state[action.qq], action),
      }
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
    default:
      return state
  }
}

const users = combineReducers({
  byId,
  allIds,
})

export default users
