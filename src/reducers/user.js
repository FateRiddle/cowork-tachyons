const user = (state, action) => {
  const { payload } = action
  switch (action.type) {
    // case 'ADD_USER':
    case 'EDIT_MY_NAME_LOADING':
      if (payload.id === state.id) {
        return {
          ...state,
          name: payload.name
        }
      }
      return state
    default:
      return state
  }
}

export default user

//assignee: id name qq password
