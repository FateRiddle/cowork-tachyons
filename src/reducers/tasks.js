import { combineReducers } from 'redux'
import task from './task'

const byId = (state = {}, action) => {
  const { payload } = action
  switch (action.type) {
    case "ADD_TASK_LOADING":
    case "INSERT_TASK_LOADING":
    case "EDIT_TASK_TITLE":
    case "EDIT_TASK_DETAIL":
    case "EDIT_TASK_ASSIGNEE_LOADING":
    case "EDIT_TASK_DUE_LOADING":
    case "EDIT_TASK_PROJECT_LOADING":
    case "TOGGLE_TASK_LOADING":
      return {
        ...state,
        [payload.id]: task(state[payload.id], action),
      }
    case "UPDATE_MY_TASKS_SUCCESS":
    case "UPDATE_PROJECT_TASKS_SUCCESS":
    case "SEARCH_TASKS_SUCCESS":
      const nextState = {}
      payload.forEach(task => {
        nextState[task.id] = task
      })
      return nextState
    default:
      return state
  }
}

const allIds = (state = [], action) => {
  const { payload } = action
  switch (action.type) {
    case "ADD_TASK_LOADING":
      return [...state, payload.id]
    case "INSERT_TASK_LOADING":
      const index = state.indexOf(payload.taskId)
      return [...state.slice(0,index+1),
        payload.id,
        ...state.slice(index+1),
      ]
    case "DELETE_TASK_LOADING":
      return state.filter(id => id !== payload.id)
    case "CHANGE_TASK_ORDER_LOADING":
      const { oldIndex,newIndex } = payload
      const id = state[oldIndex]
      if(oldIndex<newIndex){
        return [...state.slice(0,oldIndex),
          ...state.slice(oldIndex+1,newIndex+1),
          id,
          ...state.slice(newIndex+1)
        ]
      } else {
        return [...state.slice(0,newIndex),
          id,
          ...state.slice(newIndex,oldIndex),
          ...state.slice(oldIndex+1)
        ]
      }
    case "UPDATE_MY_TASKS_SUCCESS":
    case "UPDATE_PROJECT_TASKS_SUCCESS":
    case "SEARCH_TASKS_SUCCESS":
      return payload.map(task => task.id)

    default:
      return state
  }
}

const tasks = combineReducers({
  byId,
  allIds,
})

export default tasks
