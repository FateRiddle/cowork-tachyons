const project = (state, action) => {
  switch (action.type) {
    case "ADD_PROJECT":
      return {
        id: action.id,
        title: action.title,
      }

    default:
      return state
  }
}

export default project
