const project = (state, action) => {
  switch (action.type) {
    case "ADD_PROJECT":
    console.log(state);
      return {
        id: action.id,
        title: action.title,
        group: action.group,
      }
    case "EDIT_PROJECT":
      return {
        ...state,
        title: action.title,
        group: action.group,
      }
    default:
      return state
  }
}

export default project
