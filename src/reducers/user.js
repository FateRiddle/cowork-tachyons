const user = (state, action) => {
  const { payload } = action
  switch (action.type) {
    case "ADD_USER":
    case "EDIT_USER":
      return {
        qq: payload.qq,
        name: payload.name,
      }

    default:
      return state
  }
}

export default user


//assignee: id name qq password
