export const me = (state = null, action) => {
  switch (action.type) {
    case 'EDIT_MY_NAME_LOADING':
      return {
        ...state,
        name: action.payload.name
      }
    case 'LOGIN_SUCCESS':
      return {
        name: action.payload.name,
        id: action.payload.id
      }
    case 'LOGOUT':
      return null
    default:
      return state
  }
}
