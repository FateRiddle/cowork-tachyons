import { combineReducers } from 'redux'
import projects from './projects'
import tasks from './tasks'
import users from './users'
import { me } from '../data'
import { search } from './search'
import { completed } from './completed'
import { isEmpty } from 'lodash'

const app = combineReducers({
  projects,
  tasks,
  users,
  completed,
  search,
})

export default app

const getAlltasks = ({ tasks }) =>
  tasks.allIds.map(id => tasks.byId[id])

export const getAllProjects = ({ projects }) =>
  projects.allIds.map(id => projects.byId[id])

export const getAllUsers = ({ users }) =>
  users.allIds.map(id => users.byId[id])

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
    return allTasks.filter(t => t.completed === completed)
    .filter(t => t.projectId === projectId)
  }
  return []
}
