import { combineReducers } from 'redux'
import task from './task'

const byId = (state = {}, action) => {
  switch (action.type) {
    case "ADD_TASK_FOR_PROJECT":
    case "ADD_TASK_FOR_ME":
    case "INSERT_TASK_FOR_PROJECT":
    case "INSERT_TASK_FOR_ME":
    case "EDIT_TASK_TITLE":
    case "EDIT_TASK_DETAIL":
    case "EDIT_TASK_ASSIGNEE":
    case "EDIT_TASK_DUEDATE":
    case "EDIT_TASK_PROJECT":
    case "TOGGLE_TASK":
      return {
        ...state,
        [action.id]: task(state[action.id], action),
      }
    case "UPDATE_TASKS":
      const nextState = {...state}
      action.tasks.forEach((task) => {
        nextState.byId[task] = task
      })
      return nextState
    default:
      return state
  }
}

const allIds = (state = [], action) => {
  switch (action.type) {
    case "ADD_TASK_FOR_PROJECT":
    case "ADD_TASK_FOR_ME":
      return [...state, action.id]
    case "INSERT_TASK_FOR_PROJECT":
    case "INSERT_TASK_FOR_ME":
      const index = state.indexOf(action.taskId)
      return [...state.slice(0,index+1),
        action.id,
        ...state.slice(index+1),
      ]
    case "DELETE_TASK":
      return state.filter(id => id !== action.id)
    case "CHANGE_TASK_ORDER":
      const { oldIndex,newIndex } = action
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

    default:
      return state
  }
}

const tasks = combineReducers({
  byId,
  allIds,
})

export default tasks
