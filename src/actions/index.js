import { v4 } from 'uuid'
import { me } from '../data'

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

export const addTask = (projectId) => {
  if(projectId === me.id) {
    return {
      type: 'ADD_TASK_FOR_ME',
      id: v4(),
      assignee:projectId,
    }
  }
  return {
    type: 'ADD_TASK_FOR_PROJECT',
    id: v4(),
    projectId,
  }
}

//insert the task right after taskId in allIds array

export const insertTask = (projectId,taskId) => {
  if(projectId === me.id){
    return {
      type: 'INSERT_TASK_FOR_ME',
      id: v4(),
      assignee:projectId,
      taskId,
    }
  }
  return {
    type: 'INSERT_TASK_FOR_PROJECT',
    id: v4(),
    projectId,
    taskId,
  }
}

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

export const editTaskDue = (dueDate,id) =>({
  type: 'EDIT_TASK_DUE',
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

// export const changeCurrentTask = (id) => ({
//   type: 'CHANGE_CURRENT_TASK',
//   id,
// })
//
// export const changeCurrentProject = (id) => ({
//   type: 'CHANGE_CURRENT_PROJECT',
//   id,
// })

export const changeTaskOrder = (oldIndex, newIndex) => ({
  type:'CHANGE_TASK_ORDER',
  oldIndex,
  newIndex,
})

// export const changeFilter = (filter = {}) => ({  //filter is an object
//   type:'CHANGE_FILTER',
//   ...filter,
// })

export const changeCompleted = (completed) => ({
  type:'CHANGE_COMPLETED',
  completed,
})

export const changeSearch = (search = {}) => ({
  type:'CHANGE_SEARCH',
  search,
})

export const changeFilter = (filter) => dispatch => {
  const { completed,search } = filter
  if(completed){
    dispatch ({
      type:'CHANGE_COMPLETED',
      completed,
    })
  }
  if(search){
    dispatch ({
      type:'CHANGE_SEARCH',
      search,
    })
  }
}
