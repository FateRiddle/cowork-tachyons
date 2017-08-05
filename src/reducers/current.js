import { combineReducers } from 'redux'

const main = (state = '', action) => {
  const { type, payload } = action
  if (type.endsWith('_ERROR')) {
    const { status } = payload.response
    if (status === 401) {
      return '授权失败，请尝试重新登录。'
    }
    if (status === 404) {
      return '404 Not Found'
    }
    if (status === 500) {
      return '500 服务器内部错误。'
    }
    return '连接服务器失败。请检查网络。'
  }
  if (type === 'CHANGE_MAIN_WARNING') {
    return payload.warning
  }
  if (type === 'RESET_ERROR_MESSAGE') {
    return ''
  }
  return state
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
      return action.payload.warning
    case 'EDIT_MY_PASSWORD_SUCCESS':
      if (action.payload.output.message) {
        return action.payload.output.message
      }
      return state
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
