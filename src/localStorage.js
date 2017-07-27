export const loadUser = () => {
  try {
    const serializedUser = localStorage.getItem('me')
    if (serializedUser === null) {
      return undefined
    }
    return JSON.parse(serializedUser)
  } catch (e) {
    return undefined
  }
}

export const saveUser = user => {
  try {
    const serializedUser = JSON.stringify(user)
    localStorage.setItem('me', serializedUser)
  } catch (e) {}
}

export const loadSearch = () => {
  try {
    const serializedSearch = localStorage.getItem('search')
    if (serializedSearch === null) {
      return undefined
    }
    return JSON.parse(serializedSearch)
  } catch (e) {
    return undefined
  }
}

export const saveSearch = search => {
  try {
    const serializedSearch = JSON.stringify(search)
    localStorage.setItem('search', serializedSearch)
  } catch (e) {}
}
