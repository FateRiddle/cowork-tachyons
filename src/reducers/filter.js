export const filter = (state={}, action) => {
  switch (action.type) {
    case "CHANGE_FILTER":
      return action.filter
    default:
      return state
  }
}
