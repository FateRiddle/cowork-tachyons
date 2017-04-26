import { combineReducers } from 'redux'
import project from './project'

const byId = (state = {}, action) => {
  switch (action.type) {
    case "ADD_PROJECT":
    case "EDIT_PROJECT":
    case "ADD_USER_TO_PROJECT":
    case "REMOVE_USER_FROM_PROJECT":
      return {
        ...state,
        [action.id]: project(state[action.id], action),
      }
    default:
      return state
  }
}

const allIds = (state = [], action) => {
  switch (action.type) {
    case "ADD_PROJECT":
      return [...state, action.id]
    case "DELETE_PROJECT":
      return state.filter(id => id !== action.id)
    default:
      return state
  }
}

const projects = combineReducers({
  byId,
  allIds,
})

export default projects
