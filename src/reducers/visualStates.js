export const sidebarHidden = (state=false,action) => {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return !state
    default:
      return state
  }
}
