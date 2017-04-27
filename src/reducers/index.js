import { combineReducers } from 'redux'
import projects from './projects'
import tasks from './tasks'
import users from './users'
import { me } from '../data'
import { search } from './search'
import { completed } from './completed'
import { completedTab } from './current'
import { isEmpty } from 'lodash'
import { sidebarHidden } from './visualStates'

const app = combineReducers({
  projects,
  tasks,
  users,
  completed,
  search,
  completedTab,
  sidebarHidden,
})

export default app

//all the selectors

const getAlltasks = ({ tasks }) =>
  tasks.allIds.map(id => tasks.byId[id])

export const getTaskById = (state,taskId) =>
  getAlltasks(state).find(task => task.id === taskId)

export const getAllProjects = ({ projects }) =>
  projects.allIds.map(id => projects.byId[id])

export const getProjectById = (state,projectId) =>
  getAllProjects(state).find(project => project.id === projectId)

export const getAllUsers = ({ users }) =>
  users.allIds.map(id => users.byId[id])

export const getUserById = (state,userId) =>
  getAllUsers(state).find(user => user.id === userId)

export const getUserByTask = (state,taskId) => {   //users in the group of a project that task belong to

  const { projectId } = getTaskById(state,taskId) || ''  //a task can have no project
  const { group } = getProjectById(state,projectId) || ''
  const groupUsers = group || []
  return getAllUsers(state).filter(user => groupUsers.indexOf(user.id) > -1)
}

export const getFilteredTasks = (state,projectId) => {
  const allTasks = getAlltasks(state)
  const { projects,search,completed } = state
  if(!isEmpty(search)){
    return allTasks.filter(t => {
      return (!search.assignee || t.assignee === search.assignee) &&
      (!search.createdBy || t.createdBy === search.createdBy) &&
      (!search.createdAt || t.createdAt === search.createdAt) &&
      (!search.dueAt || t.dueAt === search.dueAt)
    })
  }

  if(projectId === me.id){
    return allTasks.filter(t => completed === 'all' || t.completed === completed)
    .filter(t => t.assignee === projectId)
  }
  if(projects.allIds.indexOf(projectId)>-1){
    return allTasks.filter(t => completed === 'all' || t.completed === completed)
    .filter(t => t.projectId === projectId)
  }
  return []
}
