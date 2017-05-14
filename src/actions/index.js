import { v4 } from 'uuid'
import { me } from '../data'
import * as api from '../api'

////////////////project action:
export const addProject = (title='', group=[]) => ({
  type: 'ADD_PROJECT',
  id: v4(),
  title,
  group,
})

export const deleteProject = (id) => ({
  type: 'DELETE_PROJECT',
  id,
})

export const editProject = (title,group,id) => ({  //group is array of userIds
  type: 'EDIT_PROJECT',
  title,
  group,
  id,
})

//no async
export const addUserToProject = (userId,projectId) => ({
  type: 'ADD_USER_TO_PROJECT',
  userId,
  id:projectId,
})

//no async
export const removeUserFromProject = (userId,projectId) => ({
  type: 'REMOVE_USER_FROM_PROJECT',
  userId,
  id:projectId,
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

//no async
export const editTaskTitle = (title,id) => ({
  type: 'EDIT_TASK_TITLE',
  title,
  id,
})

//no async
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

//no async
export const changeTaskOrder = (oldIndex, newIndex) => ({
  type:'CHANGE_TASK_ORDER',
  oldIndex,
  newIndex,
})

// export const changeCompleted = (completed) => ({
//   type:'CHANGE_COMPLETED',
//   completed,
// })
//
// export const changeSearch = (search = {}) => ({
//   type:'CHANGE_SEARCH',
//   search,
// })

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

export const changeCompletedTab = (id) => ({
  type:"CHANGE_COMPLETED_TAB",
  id,
})

//visual changing actions

export const toggleSidebar = () => ({
  type: 'TOGGLE_SIDEBAR',
})

//subtask:

export const addSubTask = (taskId) => ({
  type: 'ADD_SUBTASK',
  id: v4(),
  upTaskId: taskId,
})


//async

export const updateState = () => dispatch => {
  dispatch({
    type: 'FETCH_STATE_REQUEST',
  })
  return api.fetchState().then(state => {
    dispatch({
      type: 'UPDATE_STATE',
      ...state
    })
  })
}

export const saveTaskEdit = (task) => dispatch => {
  dispatch({
    type: 'SAVE_TASK_REQUEST',
  })
  return api.saveTaskEdit(task).then(output => dispatch({
    type: 'SAVE_TASK_SUCCESS',
  }))
}
