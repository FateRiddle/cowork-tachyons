export const completed = (state='active', action) => {
  switch (action.type) {
    case "CHANGE_COMPLETED":
      return action.payload.completed
    default:
      return state
  }
}
