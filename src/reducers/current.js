export const warning = (state='', action) => {
  switch (action.type) {
    case 'EDIT_PROJECT_ERROR':
    case 'ADD_TASK_ERROR':
    case 'INSERT_TASK_ERROR':
    case 'LOGIN_ERROR':
    case 'SIGNUP_ERROR':
      if(action.payload.response.data.errors){
        return action.payload.response.data.errors
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
