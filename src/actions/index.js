import { v4 } from 'uuid'
import api from '../api'
import { getTaskById } from '../reducers'
import moment from 'moment'

//utility
const nullToEmptyString = obj => {
  let newObj = { ...obj }
  for (let key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] === null) {
      newObj = {
        ...newObj,
        [key]: ''
      }
    }
  }
  return newObj
}

const formatDate = task => {
  const { createdAt, dueAt, modifiedAt } = task
  return {
    ...task,
    createdAt: createdAt ? moment(createdAt) : null,
    dueAt: dueAt ? moment(dueAt) : null,
    modifiedAt: modifiedAt ? moment(modifiedAt) : null
  }
}

////////////////project action:
export const addProject = (title = '', group = []) => {
  const data = {
    id: v4(),
    title,
    group
  }
  return {
    type: 'ADD_PROJECT',
    payload: {
      promise: api.Projects.add(data),
      data
    }
  }
}

export const deleteProject = id => ({
  type: 'DELETE_PROJECT',
  payload: {
    id
  }
})

export const editProject = (title, group, id) => {
  const data = {
    id,
    title,
    group
  }
  return {
    //group is array of userIds
    type: 'EDIT_PROJECT',
    payload: {
      promise: api.Projects.update(data),
      data
    }
  }
}

//no async
export const addUserToProject = (userId, projectId) => ({
  type: 'ADD_USER_TO_PROJECT',
  payload: {
    userId,
    id: projectId
  }
})

//no async
export const removeUserFromProject = (userId, projectId) => ({
  type: 'REMOVE_USER_FROM_PROJECT',
  payload: {
    userId,
    id: projectId
  }
})

/////////////////TASK:

export const addTask = projectId => (dispatch, getState) => {
  const id = v4()
  const me = getState().me
  const isMe = projectId === me.id
  const data = {
    id,
    assignee: isMe ? projectId : '',
    projectId: isMe ? '' : projectId
  }
  const taskOrder = getState().tasks.allIds.length + 1
  dispatch({
    type: 'ADD_TASK',
    payload: {
      promise: api.Tasks.add({ ...data, taskOrder }),
      data
    }
  })
}

//insert the task right after taskId in allIds array

export const insertTask = (projectId, taskId) => (dispatch, getState) => {
  const id = v4()
  const me = getState().me
  const isMe = projectId === me.id
  console.log(projectId, me.id)
  const data = {
    id,
    assignee: isMe ? projectId : '',
    projectId: isMe ? '' : projectId,
    taskId
  }
  dispatch({
    type: 'INSERT_TASK',
    payload: {
      promise: api.Tasks.insert(data),
      data
    }
  })
}

export const deleteTask = id => ({
  type: 'DELETE_TASK',
  payload: {
    promise: api.Tasks.del({ id }),
    data: { id }
  }
})

//no async
export const editTaskTitle = (title, id) => ({
  type: 'EDIT_TASK_TITLE',
  payload: {
    title,
    id
  }
})

export const saveTaskTitle = (title, id) => ({
  type: 'SAVE_TASK_TITLE',
  payload: api.Tasks.editTitle({ title, id })
})

//no async
export const editTaskDetail = (detail, id) => ({
  type: 'EDIT_TASK_DETAIL',
  payload: {
    detail,
    id
  }
})

export const saveTaskDetail = (detail, id) => ({
  type: 'SAVE_TASK_DETAIL',
  payload: api.Tasks.editDetail({ detail, id })
})

export const editTaskProject = (projectId, id) => {
  const data = {
    projectId,
    id
  }
  return {
    type: 'EDIT_TASK_PROJECT',
    payload: {
      promise: api.Tasks.editProject(data),
      data
    }
  }
}

export const editTaskAssignee = (assignee, id) => {
  const data = {
    assignee,
    id
  }
  return {
    type: 'EDIT_TASK_ASSIGNEE',
    payload: {
      promise: api.Tasks.editAssignee(data),
      data
    }
  }
}

export const editTaskDue = (dueAt, id) => {
  const data = {
    dueAt: dueAt,
    id
  }
  return {
    type: 'EDIT_TASK_DUE',
    payload: {
      promise: api.Tasks.editDue(data),
      data
    }
  }
}

export const toggleTask = id => ({
  type: 'TOGGLE_TASK',
  payload: {
    promise: api.Tasks.toggle({ id }),
    data: { id }
  }
})

export const addTaskTag = (tag, id) => ({
  type: 'ADD_TASK_TAG',
  payload: {
    tag,
    id
  }
})

// TODO: simpler way?
export const changeTaskOrder = (oldIndex, newIndex) => (dispatch, getState) => {
  const allTasks = getState().tasks.allIds.map(id => getState().tasks.byId[id])
  let { taskOrder: order, id } = allTasks[oldIndex]
  const newOrder = allTasks[newIndex].taskOrder
  switch (true) {
    case newIndex === 0:
      // console.log(1);
      order = newOrder / 2
      break
    case newIndex === allTasks.length - 1:
      // console.log(2);
      order = newOrder + 1
      break
    case newIndex < oldIndex:
      // console.log(3);
      const formerTask = allTasks[newIndex - 1]
      order = (newOrder + formerTask.taskOrder) / 2
      break
    case newIndex > oldIndex:
      // console.log(4);
      const latterTask = allTasks[newIndex + 1]
      order = (newOrder + latterTask.taskOrder) / 2
      break
    default:
  }
  // console.log(newIndex,order);
  dispatch({
    type: 'CHANGE_TASK_ORDER',
    payload: {
      promise: api.Tasks.changeOrder({ id, order }),
      data: {
        oldIndex,
        newIndex
      }
    }
  })
}

export const addSubtask = taskId => (dispatch, getState) => {
  const projectId = getTaskById(getState(), taskId).projectId
  const data = {
    id: v4(),
    upTaskId: taskId,
    projectId
  }
  dispatch({
    type: 'ADD_SUBTASK',
    payload: {
      promise: api.Tasks.addSubtask(data),
      data
    }
  })
}

// export const changeFilter = (filter) => dispatch => {
//   const { completed,search } = filter
//   if(completed){
//     dispatch ({
//       type:'CHANGE_COMPLETED',
//       payload:{
//         completed,
//       }
//     })
//   }
//   if(search){
//     dispatch ({
//       type:'CHANGE_SEARCH',
//       payload:{
//         search,
//       }
//     })
//   }
// }

//UI interactions

//visual changing actions

export const toggleSidebar = () => ({
  type: 'TOGGLE_SIDEBAR'
})

////////////////////////////new actions /////////////////////////
//async
export const updateState = () => ({
  // update projects and users
  type: 'UPDATE_ALL',
  payload: {
    promise: Promise.all([
      api.Projects.all(),
      api.Users.all()
    ]).then(([projects, users]) => {
      //把所有null值变成''
      const newProjects = projects.map(project => nullToEmptyString(project))
      const newUsers = users.map(user => nullToEmptyString(user))
      return {
        projects: newProjects,
        users: newUsers
      }
    })
  }
})

export const updateProjectTasks = id => ({
  type: 'UPDATE_PROJECT_TASKS',
  payload: {
    promise: api.Tasks
      .byProject(id)
      .then(tasks => tasks.map(task => formatDate(task))) //最后这步处理是为了返回的数据结构一致，可以用一个reducer case来写。
  }
})

export const updateUserTasks = id => ({
  type: 'UPDATE_MY_TASKS',
  payload: {
    promise: api.Tasks
      .byUser(id)
      .then(tasks => tasks.map(task => formatDate(task)))
  }
})

export const changeCompleted = completed => ({
  type: 'CHANGE_COMPLETED',
  payload: {
    completed
  }
})

export const changeSearch = search => ({
  type: 'CHANGE_SEARCH',
  payload: {
    search
  }
})

export const searchTasks = (search = {}) => dispatch => {
  console.log(search)
  dispatch({
    type: 'SEARCH_TASKS',
    payload: {
      promise: api.Tasks
        .bySearch(search)
        .then(tasks => tasks.map(task => formatDate(task)))
    }
  })
  //how do I dispatch changeSearch after api call? can use .then() it seems
  // dispatch(changeSearch(search))
}

export const resetErrorMessage = () => ({
  type: 'RESET_ERROR_MESSAGE'
})

export const saveUser = (id, name) => {
  return {
    type: 'SAVE_USER',
    payload: {
      promise: api.Auth.save(id, name)
    }
  }
}

export const login = (name, password) => ({
  type: 'LOGIN',
  payload: {
    promise: api.Auth.login(name, password)
  }
})

export const logout = () => ({
  type: 'LOGOUT'
})

export const signup = (name, password, password2, slogan) => ({
  type: 'SIGNUP',
  payload: {
    promise: api.Auth.signup(name, password, password2, slogan)
  }
})
