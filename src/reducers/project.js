const project = (state, action) => {
  const { payload } = action
  switch (action.type) {
    case "ADD_PROJECT_LOADING":
      return {
        id: payload.id,
        title: payload.title,
        group: payload.group,
      }
    case "EDIT_PROJECT_LOADING":
      return {
        ...state,
        title: payload.title,
        group: payload.group,
      }
    default:
      return state
  }
}

export default project
