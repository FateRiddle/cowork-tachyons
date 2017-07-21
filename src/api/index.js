import axios from 'axios'

//constant
const API_ROOT = '/api'
let token = null

token = window.localStorage.getItem('token')

//setting up request
const request = axios.create({
  baseURL: API_ROOT
})

axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

//methods
// const encode = encodeURIComponent
const responseBody = res => res.data.recordset
const responseOutput = res => res.data

const ax = {
  del: url => request.delete(url).then(responseOutput),
  get: url => request.get(url).then(responseBody),
  put: (url, body) => request.put(url, body).then(responseOutput), //put is for update
  post: (url, body) => request.post(url, body).then(responseOutput) //post is for create
}

const Auth = {
  login: (name, password) =>
    ax.post('/auth/login', { user: { name, password } }),
  signup: (name, password, password2, slogan) =>
    ax.post('/auth', { user: { name, password, password2 }, slogan })
}

const Projects = {
  all: () => ax.get('/projects'),
  add: ({ id, title, group }) => ax.post('/projects', { id, title, group }),
  update: ({ id, title, group }) => ax.put('/projects', { id, title, group })
}

const Tasks = {
  all: () => ax.get('/tasks'),
  byProject: id => ax.get(`/tasks?projectId=${id}`),
  byUser: id => ax.get(`/tasks?userId=${id}`),
  bySearch: search => ax.post(`/tasks/search`, search),
  subtasks: id => ax.get(`/tasks?upTaskId=${id}`),
  rootTask: id => ax.get(`/tasks?rootOf=${id}`),
  allByProject: id => ax.get(`/tasks?projectIdAll=${id}`),
  getById: id => ax.get(`/tasks/${id}`),
  // const {
  //   assignee,
  //   createdBy,
  //   createdAt,
  //   dueAt,
  //   projectId,
  //   completed,
  // } = search
  add: ({ id, projectId, assignee }) =>
    ax.post('/tasks', { id, projectId, assignee }),
  insert: ({ id, projectId, assignee, insertAt }) =>
    ax.post('/tasks', { id, projectId, assignee, insertAt }),
  addSubtask: ({ id, upTaskId, rootTaskId, upTaskTitle }) =>
    ax.post(`/tasks`, { id, upTaskId, rootTaskId, upTaskTitle }),
  insertSubtask: ({ id, upTaskId, insertAt, rootTaskId, upTaskTitle }) =>
    ax.post(`/tasks`, { id, upTaskId, insertAt, rootTaskId, upTaskTitle }),
  del: ({ id }) => ax.del(`/tasks/${id}`),
  editTitle: ({ id, title }) => ax.put(`/tasks/${id}`, { title }),
  editDetail: ({ id, detail }) => ax.put(`/tasks/${id}`, { detail }),
  editProject: ({ id, projectId }) => ax.put(`/tasks/${id}`, { projectId }),
  editAssignee: ({ id, assignee }) => ax.put(`/tasks/${id}`, { assignee }),
  editDue: ({ id, dueAt }) =>
    ax.put(`/tasks/${id}`, { dueAt: dueAt ? dueAt.format() : null }),
  editProgress: ({ id, progress }) => ax.put(`/tasks/${id}`, { progress }),
  editAmount: ({ id, amount }) => ax.put(`/tasks/${id}`, { amount }),

  toggle: ({ id }) => ax.put(`/tasks/${id}`, { toggle: true }),
  taskOrder: ({ id, before, targetId }) =>
    ax.put(`/tasks/order/${id}`, { before, type: 'task', targetId }),
  myOrder: ({ id, before, targetId }) =>
    ax.put(`/tasks/order/${id}`, { before, type: 'my', targetId })
}

const Users = {
  all: () => ax.get('/users')
  // current: () => ax.get('/user'),
  // save: (id,name) => ax.put('/user', { user: { id,name } }),
}

export default {
  request,
  Auth,
  Projects,
  Tasks,
  Users,
  setToken: _token => {
    token = _token
  }
  // getToken: () => { return token }
}

//
// const delay = ms =>
//   new Promise(resolve => setTimeout(resolve,ms))
//
// const fetchState = () => delay(1000).then(() => fakedb)
