export const currentProject = (state="me", action) => {
  switch (action.type) {
    case "CHANGE_CURRENT_PROJECT":
      return action.id
    default:
      return state
  }
}

export const currentTask = (state="0", action) => {
  switch (action.type) {
    case "CHANGE_CURRENT_TASK":
      return action.id
    default:
      return state
  }
}

export const currentUser = (state="3", action) => {
  switch (action.type) {
    case "CHANGE_CURRENT_USER":
      return {
        qq:action.qq
      }
    default:
      return state
  }
}
