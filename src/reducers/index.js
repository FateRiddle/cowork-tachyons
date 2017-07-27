import { combineReducers } from 'redux'
import projects from './projects'
import tasks, * as fromTasks from './tasks'
import users from './users'
import { search } from './search'
import { completed } from './completed'
import current from './current'
import { isEmpty } from 'lodash'
import { sidebarHidden } from './visualStates'
import { me } from './me'

const app = combineReducers({
  projects,
  tasks,
  users,
  completed,
  search,
  sidebarHidden,
  me,
  warning: current.warning,
  currentTask: current.task,
  currentSubtask: current.subTask
})

export default app

//all the selectors

export const getAlltasks = ({ tasks }) => fromTasks.getAlltasks(tasks)

export const getTaskByCompleted = state =>
  getAlltasks(state).filter(task => {
    return state.completed === 'all' || task.completed === state.completed
  })

export const getTaskById = (state, taskId) =>
  getAlltasks(state).find(task => task.id === taskId)

export const getAllProjects = ({ projects }) => {
  if (projects) {
    return projects.allIds.map(id => projects.byId[id])
  }
  return []
}

export const getProjectById = (state, projectId) =>
  getAllProjects(state).find(project => project.id === projectId)

export const getAllUsers = ({ users }) => {
  if (users) {
    return users.allIds.map(id => users.byId[id])
  }
  return []
}

export const getUserById = (state, userId) =>
  getAllUsers(state).find(user => user.id === userId)

export const getUserByTask = (state, taskId) => {
  //users in the group of a project that task belong to

  const { projectId } = getTaskById(state, taskId) || '' //a task can have no project
  const { group } = getProjectById(state, projectId) || ''
  const groupUsers = group || []
  return getAllUsers(state).filter(user => groupUsers.indexOf(user.id) > -1)
}

export const getSubtasksById = (state, taskId) => {
  const allTasks = getAlltasks(state)
  return allTasks.filter(task => task.upTaskId === taskId)
}

export const getSubtasks = state => {
  const allTasks = getAlltasks(state)
  return allTasks.filter(task => task.upTaskId === state.currentTask)
}
//recursion
export const getAllSubtasks = ({ tasks }, id) =>
  fromTasks.getAllSubtasks(tasks, id)

export const getTaskStack = ({ tasks }, id) => fromTasks.getTaskStack(tasks, id)

// export const getFilteredTasks = (state, projectId) => {
//   const allTasks = getAlltasks(state)
//   const { projects, search, completed } = state
//   if (projectId === 'search' && !isEmpty(search)) {
//     return allTasks.filter(t => {
//       return (
//         (!search.assignee || t.assignee === search.assignee) &&
//         (!search.createdBy || t.createdBy === search.createdBy) &&
//         (!search.createdAt || t.createdAt === search.createdAt) &&
//         (!search.dueAt || t.dueAt === search.dueAt)
//       )
//     })
//   }
//   if (projectId === state.me.id) {
//     return allTasks
//       .filter(t => completed === 'all' || t.completed === completed)
//       .filter(t => t.assignee === projectId)
//   }
//   if (projects.allIds.indexOf(projectId) > -1) {
//     return allTasks
//       .filter(t => completed === 'all' || t.completed === completed)
//       .filter(t => t.projectId === projectId)
//   }
//   return []
// }
