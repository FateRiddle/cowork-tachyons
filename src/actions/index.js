import { v4 } from 'uuid'

////////////////project action:
export const addProject = (title) => ({
  type: 'ADD_PROJECT',
  id: v4(),
  title
})

export const deleteProject = (id) => ({
  type: 'DELETE_PROJECT',
  id,
})

/////////////////TASK:
export const addTaskForMe = (assignee) => ({
  type: 'ADD_TASK_FOR_ME',
  id: v4(),
  assignee,
})

//insert the task right after taskId in allIds array
export const insertTaskForMe = (assignee,taskId) => ({
  type: 'INSERT_TASK_FOR_ME',
  id: v4(),
  assignee,
  taskId,
})

export const addTaskForProject = (projectId) => ({
  type: 'ADD_TASK_FOR_PROJECT',
  id: v4(),
  projectId,
})

export const insertTaskForProject = (projectId,taskId) => ({
  type: 'INSERT_TASK_FOR_PROJECT',
  id: v4(),
  projectId,
  taskId,
})

export const deleteTask = (id) => ({
  type: 'DELETE_TASK',
  id,
})

export const editTaskTitle = (title,id) => ({
  type: 'EDIT_TASK_TITLE',
  title,
  id,
})

export const editTaskDetail = (detail,id) => ({
  type: 'EDIT_TASK_DETAIL',
  detail,
  id,
})

export const editTaskProject = (projectId,id) => ({
  type: 'EDIT_TASK_PROJECT',
  projectId,
  id,
})

export const editTaskAssignee = (assignee,id) =>({
  type: 'EDIT_TASK_ASSIGNEE',
  assignee,
  id,
})

export const editTaskDueDate = (dueDate,id) =>({
  type: 'EDIT_TASK_DUEDATE',
  dueDate,
  id,
})

export const toggleTask = (id) =>({
  type: 'TOGGLE_TASK',
  id,
})

export const addTaskTag = (tag,id) => ({
  type: 'ADD_TASK_TAG',
  tag,
  id,
})
/////////////////////

export const changeCurrentTask = (id) => ({
  type: 'CHANGE_CURRENT_TASK',
  id,
})

export const changeCurrentProject = (id) => ({
  type: 'CHANGE_CURRENT_PROJECT',
  id,
})

export const changeCurrentUser = (qq) => ({
  type: 'CHANGE_CURRENT_USER',
  qq,
})

export const changeTaskOrder = (oldIndex, newIndex) => ({
  type:'CHANGE_TASK_ORDER',
  oldIndex,
  newIndex,
})

export const changeFilter = (filter = {}) => ({  //filter is an object of detailed filter like in graphql
  type:'CHANGE_FILTER',
  filter
})
