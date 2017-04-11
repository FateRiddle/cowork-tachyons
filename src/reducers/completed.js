export const completed = (state='active', action) => {
  switch (action.type) {
    case "CHANGE_COMPLETED":
      return action.completed
    default:
      return state
  }
}
