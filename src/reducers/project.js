const project = (state, action) => {
  const { payload } = action
  switch (action.type) {
    case 'ADD_PROJECT_SUCCESS':
      if (payload.output.message === '') {
        return {
          id: payload.id,
          title: payload.title,
          group: payload.group,
        }
      }
      return state
    case 'EDIT_PROJECT_SUCCESS':
      if (payload.output.message === '') {
        return {
          ...state,
          title: payload.title,
          group: payload.group,
        }
      }
      return state
    default:
      return state
  }
}

export default project
