const user = (state, action) => {
  switch (action.type) {
    case "ADD_USER":
    case "EDIT_USER":
      return {
        qq: action.qq,
        name: action.name,
      }

    default:
      return state
  }
}

export default user


//assignee: id name qq password
