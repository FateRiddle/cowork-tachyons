const project = (state, action) => {
  switch (action.type) {
    case "ADD_PROJECT":
      return {
        id: action.id,
        title: action.title,
        group: action.group,
      }
    case "EDIT_PROJECT_TITLE":
      return {
        ...state,
        title:action.title,
      }
    case "EDIT_PROJECT_GROUP":
      return {
        ...state,
        group:action.group,
      }
    case "ADD_USER_TO_PROJECT":
      return {
        ...state,
        group:[...state.group,action.userId]
      }
    case "REMOVE_USER_FROM_PROJECT":
      const newGroup = state.group.filter(id => id !== action.userId)
      return {
        ...state,
        group:newGroup
      }
    default:
      return state
  }
}

export default project
