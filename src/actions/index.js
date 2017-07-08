import { v4 } from 'uuid'
import api from '../api'
import {
  getTaskById,
  getAlltasks,
  getSubtasksById,
  getAllSubtasks
} from '../reducers'
import moment from 'moment'
import { arrayMove } from 'react-sortable-hoc'

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

const formatDate = tasks =>
  tasks.map(task => {
    const { createdAt, dueAt, modifiedAt } = task
    return {
      ...task,
      createdAt: createdAt ? moment(createdAt) : null,
      dueAt: dueAt ? moment(dueAt) : null,
      modifiedAt: modifiedAt ? moment(modifiedAt) : null
    }
  })

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
  const { me } = getState()
  const isMe = projectId === me.id
  const data = {
    id,
    assignee: isMe ? projectId : '',
    projectId: isMe ? '' : projectId
  }

  dispatch({
    type: 'ADD_TASK',
    payload: {
      promise: api.Tasks.add(data),
      data
    }
  })
}

//insert the task right after taskId in allIds array

export const insertTask = (projectId, taskId) => (dispatch, getState) => {
  const id = v4()
  const { me, tasks: { allIds } } = getState()
  const isMe = projectId === me.id
  const data = {
    id,
    assignee: isMe ? projectId : '',
    projectId: isMe ? '' : projectId,
    insertAt: taskId
  }
  dispatch({
    type: 'INSERT_TASK',
    payload: {
      promise: api.Tasks.insert(data),
      data
    }
  })
}

//insert the task right after taskId in allIds array

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

export const insertSubtask = (taskId, subTaskId) => (dispatch, getState) => {
  const projectId = getTaskById(getState(), taskId).projectId
  const data = {
    id: v4(),
    upTaskId: taskId,
    insertAt: subTaskId,
    projectId
  }
  dispatch({
    type: 'INSERT_SUBTASK',
    payload: {
      promise: api.Tasks.insertSubtask(data),
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

export const editTaskProject = (projectId, id) => (dispatch, getState) => {
  const data = {
    projectId,
    id,
    ids: getAllSubtasks(getState(), id)
  }
  dispatch({
    type: 'EDIT_TASK_PROJECT',
    payload: {
      promise: api.Tasks.editProject(data),
      data
    }
  })
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
//
// export const editSubtaskAssignee = (assignee, id) => (dispatch, getState) => {
//   const data = {
//     assignee,
//     id
//   }
//   //当子任务assign给自己时，要第一时间显示出来，且位置对。且对应的myOrder也要对。
//   const getOrder = () => {
//     if (assignee === getState().me) {
//       const tasks = getAlltasks(getState()).filter(t => t.assignee === assignee)
//       const myOrders = tasks.map(t => t.myOrder).filter(o => !!o) //去除undefined和null,一般不会有
//       return Math.min(...myOrders) - 1
//     }
//     return undefined
//   }
//
//   dispatch({
//     type: 'EDIT_SUBTASK_ASSIGNEE',
//     payload: {
//       promise: api.Tasks.editAssignee(data),
//       data: { ...data, myOrder: getOrder() }
//     }
//   })
// }

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

export const changeTaskOrder = (oldIndex, newIndex) => (dispatch, getState) => {
  const tasks = getAlltasks(getState())
  const task = tasks[oldIndex]
  const target = tasks[newIndex]
  // const newTasks = arrayMove(tasks, oldIndex, newIndex) // use arrayMove from react-sortable-hoc
  // const index = newTasks.indexOf(task)
  //
  // const orderByIndex = (index, tasks) => {
  //   switch (index) {
  //     case 0:
  //       return tasks[1].taskOrder - 1
  //     case tasks.length - 1:
  //       return tasks[tasks.length - 2].taskOrder + 1
  //     default:
  //       return (tasks[index - 1].taskOrder + tasks[index + 1].taskOrder) / 2
  //   }
  // }
  // const order = orderByIndex(index, newTasks)
  let before = true
  if (oldIndex < newIndex) {
    before = false
  }
  dispatch({
    type: 'CHANGE_TASK_ORDER',
    payload: {
      promise: api.Tasks.taskOrder({
        id: task.id,
        before,
        targetId: target.id
      }),
      data: {
        oldIndex,
        newIndex
      }
    }
  })
}

export const changeMyOrder = (oldIndex, newIndex) => (dispatch, getState) => {
  const tasks = getAlltasks(getState())
  const task = tasks[oldIndex]
  const target = tasks[newIndex]
  let before = true
  if (oldIndex < newIndex) {
    before = false
  }
  dispatch({
    type: 'CHANGE_MY_ORDER',
    payload: {
      promise: api.Tasks.myOrder({ id: task.id, before, targetId: target.id }),
      data: {
        oldIndex,
        newIndex
      }
    }
  })
}

export const changeCurrentTask = (id = '') => ({
  type: 'CHANGE_CURRENT_TASK',
  id
})

export const changeCurrentSubtask = (id = '') => ({
  type: 'CHANGE_CURRENT_SUBTASK',
  id
})

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
    promise: api.Tasks.byProject(id).then(tasks => formatDate(tasks)) //最后这步处理是为了返回的数据结构一致，可以用一个reducer case来写。
  }
})

export const updateUserTasks = id => ({
  type: 'UPDATE_MY_TASKS',
  payload: {
    promise: api.Tasks.byUser(id).then(tasks => formatDate(tasks))
  }
})

export const updateSubtasks = id => ({
  type: 'UPDATE_SUBTASKS',
  payload: {
    promise: api.Tasks.subtasks(id).then(tasks => formatDate(tasks)),
    data: {
      id
    }
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
      promise: api.Tasks.bySearch(search).then(tasks => formatDate(tasks))
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
