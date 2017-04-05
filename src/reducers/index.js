import { combineReducers } from 'redux'
import projects from './projects'
import tasks from './tasks'
import users from './users'
import { currentTask,currentProject,currentUser } from './current'
import { filter } from './filter'

const app = combineReducers({
  projects,
  tasks,
  users,
  currentUser,
  currentProject,
  currentTask,
  filter,
})

export default app

export const getFilteredTasks = ({ tasks, currentProject, currentUser,filter }) => {
  if(currentProject === 'me'){
    return tasks.allIds.filter( id => tasks.byId[id].assignee === currentUser)
  } else {
    return tasks.allIds.filter( id => tasks.byId[id].projectId === currentProject)
  }
}
