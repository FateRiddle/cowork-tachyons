export const me = (state=null, action) => {

  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return  {
        name: action.payload.name,
        id: action.payload.id,
      }
    case 'LOGOUT':
      return null
    default:
      return state
  }
}
