import { combineReducers } from 'redux'

const sidebarHidden = (state = false, action) => {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return !state
    default:
      return state
  }
}

const userSettingsHidden = (state = true, action) => {
  switch (action.type) {
    case 'TOGGLE_USERSETTINGS':
      return !state
    default:
      return state
  }
}

const userSettingsTab = (state = 'info', action) => {
  switch (action.type) {
    case 'CHANGE_USERSETTINGS_TAB':
      return action.tab
    default:
      return state
  }
}

export const visual = combineReducers({
  sidebarHidden,
  userSettingsHidden,
  userSettingsTab
})
