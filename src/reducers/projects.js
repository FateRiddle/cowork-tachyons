import { combineReducers } from 'redux'
import project from './project'

const byId = (state = {}, action) => {
  const { payload } = action
  switch (action.type) {
    case "ADD_PROJECT_LOADING":
    case "EDIT_PROJECT_LOADING":
    case "ADD_USER_TO_PROJECT":
    case "REMOVE_USER_FROM_PROJECT":
      return {
        ...state,
        [payload.id]: project(state[payload.id], action),
      }
    case "UPDATE_ALL_SUCCESS":
      const nextState = {}
      payload.projects.forEach(project => {
        nextState[project.id] = project
      })
      return nextState
    default:
      return state
  }
}

const allIds = (state = [], action) => {
  const { payload } = action
  switch (action.type) {
    case "ADD_PROJECT_LOADING":
      return [...state, payload.id]
    case "DELETE_PROJECT":
      return state.filter(id => id !== payload.id)
    case "UPDATE_ALL_SUCCESS":
      return payload.projects.map(project => project.id)
    default:
      return state
  }
}

const projects = combineReducers({
  byId,
  allIds,
})

export default projects
