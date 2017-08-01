import { combineReducers } from 'redux'

const main = (state = '', action) => {
  switch (action.type) {
    case 'EDIT_PROJECT_ERROR':
    case 'ADD_TASK_ERROR':
    case 'INSERT_TASK_ERROR':
      const { errors } = action.payload.response.data
      if (errors) {
        return errors
      } else {
        return '连接服务器失败。请刷新重试。'
      }
    case 'RESET_ERROR_MESSAGE':
      return ''
    default:
      return state
  }
}

const home = (state = '', action) => {
  switch (action.type) {
    case 'LOGIN_ERROR':
    case 'SIGNUP_ERROR':
      const { errors } = action.payload.response.data
      if (errors) {
        return errors
      } else {
        return '连接服务器失败。请刷新重试。'
      }
    case 'SIGNUP_SUCCESS':
      return action.payload.message
    case 'RESET_ERROR_MESSAGE':
      return ''
    default:
      return state
  }
}

const userSettings = (state = '', action) => {
  switch (action.type) {
    case 'CHANGE_USER_WARNING':
      return action.warning
    default:
      return state
  }
}

const warning = combineReducers({
  main,
  home,
  userSettings
})

const task = (state = '', action) => {
  switch (action.type) {
    case 'CHANGE_CURRENT_TASK':
      return action.id
    default:
      return state
  }
}

const subTask = (state = '', action) => {
  switch (action.type) {
    case 'CHANGE_CURRENT_SUBTASK':
      return action.id
    default:
      return state
  }
}

export default {
  task,
  subTask,
  warning
}
