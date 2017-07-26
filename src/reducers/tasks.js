import { combineReducers } from 'redux'
import task from './task'
import { arrayMove } from 'react-sortable-hoc'

const byId = (state = {}, action) => {
  const { payload } = action
  switch (action.type) {
    case 'ADD_TASK_LOADING':
    case 'INSERT_TASK_LOADING':
    case 'ADD_SUBTASK_LOADING':
    case 'INSERT_SUBTASK_LOADING':
    case 'EDIT_TASK_TITLE':
    case 'EDIT_TASK_DETAIL':
    case 'EDIT_TASK_PROJECT_LOADING':
    case 'EDIT_TASK_ASSIGNEE_LOADING':
    case 'EDIT_TASK_DUE_LOADING':
    case 'EDIT_TASK_PROGRESS_LOADING':
    case 'EDIT_TASK_AMOUNT_LOADING':
    case 'TOGGLE_TASK_LOADING':
      return {
        ...state,
        [payload.id]: task(state[payload.id], action)
      }
    // case 'EDIT_UPTASK_PROGRESS':

    case 'UPDATE_MY_TASKS_SUCCESS':
    case 'UPDATE_PROJECT_TASKS_SUCCESS':
    case 'SEARCH_TASKS_SUCCESS':
    case 'UPDATE_ALL_TASKS_BY_PROJECT_SUCCESS':
      const nextState1 = {}
      payload.forEach(task => {
        nextState1[task.id] = task
      })
      return nextState1
    case 'UPDATE_SUBTASKS_SUCCESS':
    case 'UPDATE_ROOTTASK_SUCCESS':
    case 'UPDATE_TASK_BY_ID_SUCCESS':
      const nextState2 = { ...state }
      payload.forEach(task => {
        nextState2[task.id] = task
      })
      return nextState2
    default:
      return state
  }
}

const allIds = (state = [], action) => {
  const { payload } = action
  switch (action.type) {
    case 'ADD_TASK_LOADING':
    case 'ADD_SUBTASK_LOADING':
      return [...state, payload.id]
    case 'INSERT_TASK_LOADING':
    case 'INSERT_SUBTASK_LOADING':
      const index = state.indexOf(payload.insertAt)
      return [
        ...state.slice(0, index + 1),
        payload.id,
        ...state.slice(index + 1)
      ]
    // case 'EDIT_TASK_ASSIGNEE_LOADING':
    //   const _index = state.indexOf(payload.id)
    //   return arrayMove(state, _index, 0) //移动到第一个
    case 'DELETE_TASK_LOADING':
    case 'DELETE_SUBTASK_LOADING':
      return state.filter(id => id !== payload.id)
    case 'CHANGE_TASK_ORDER_LOADING':
    case 'CHANGE_MY_ORDER_LOADING':
      const { oldIndex, newIndex } = payload
      const newState = arrayMove(state, oldIndex, newIndex)
      return newState
    case 'UPDATE_MY_TASKS_SUCCESS':
    case 'UPDATE_PROJECT_TASKS_SUCCESS':
    case 'SEARCH_TASKS_SUCCESS':
    case 'UPDATE_ALL_TASKS_BY_PROJECT_SUCCESS':
      return payload.map(task => task.id)
    case 'UPDATE_SUBTASKS_SUCCESS':
    case 'UPDATE_ROOTTASK_SUCCESS':
    case 'UPDATE_TASK_BY_ID_SUCCESS':
      const newTaskIds = payload.map(task => task.id)
      const _ids = newTaskIds.filter(id => state.indexOf(id) === -1) //重复的就不添加上去了
      return [..._ids, ...state]
    default:
      return state
  }
}

const taskFetched = (state = false, action) => {
  switch (action.type) {
    case 'SEARCH_TASKS_SUCCESS':
    case 'UPDATE_MY_TASKS_SUCCESS':
    case 'UPDATE_PROJECT_TASKS_SUCCESS':
    case 'UPDATE_ALL_TASKS_BY_PROJECT_SUCCESS':
      return true
    default:
      return state
  }
}

const subtaskFetched = (state = false, action) => {
  switch (action.type) {
    case 'UPDATE_SUBTASKS_SUCCESS':
      return true
    default:
      return state
  }
}

const tasks = combineReducers({
  byId,
  allIds,
  taskFetched,
  subtaskFetched
})

export default tasks

export const getAlltasks = state => {
  if (state) {
    return state.allIds.map(id => state.byId[id])
  }
  return []
}

export const getAllSubtasks = (state, id) => {
  const allTasks = getAlltasks(state)
  let subtasks = []
  allTasks.forEach(task => {
    if (task.upTaskId === id) {
      subtasks.push(task.id)
      let subIds = getAllSubtasks(state, task.id)
      if (subIds) {
        subtasks = subtasks.concat(subIds)
      }
    }
  })
  return subtasks
}

export const getTaskStack = (state, id) => {
  const alltasks = getAlltasks(state)
  const task = alltasks.find(t => t.id === id)
  if (!task) {
    return []
  }
  const uptask = alltasks.find(t => t.id === task.upTaskId)
  if (uptask) {
    const uptasks = getTaskStack(state, uptask.id)
    return [...uptasks, uptask.id]
  }
  return []
}
