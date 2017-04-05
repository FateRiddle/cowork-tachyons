// import axios from 'axios'
import moment from 'moment'
import { v4 } from 'uuid'

// taskId projectId taskName contents createDate deadline creatorId isComplete completeDate
// taskId: id
// projectId: projectId
// taskName: title
// contents: detail
// createDate: createdAt
// creatorId: creator
// deadline: dueAt
// isComplete: completed
// completeDate: completedAt

const thisFilter = {
  projectId:['1'],
   creator:['3'],
  completed:'notCompleted',//'completed','notCompleted'
  // createdBetween:['moment1','moment2']
}

//先让assignee 默认等于 creator， 之后再改

const fakedb = {
  projects:{
    allIds:['1','2'],
    byId:{
      '1':{id:'1',title:"project1"},
      '2':{id:'2',title:"project2"},
    },
  },
  tasks:{
    allIds:['1','2','3','4','5'],
    byId:{
      '1':{id:'1',projectId:'1',title:'task1',detail:'', createdAt: moment(), creator: '3', assignee:'3', dueAt: '', completed:false, completedAt:'' },
      '2':{id:'2',projectId:'2',title:'task2',detail:'', createdAt: moment(), creator: '3', assignee:'3', dueAt: '', completed:false, completedAt:'' },
      '3':{id:'3',projectId:'2',title:'task3',detail:'', createdAt: moment(), creator: '1', assignee:'1', dueAt: '', completed:false, completedAt:'' },
      '4':{id:'4',projectId:'',title:'task4',detail:'', createdAt: moment(), creator: '3', assignee:'3', dueAt: '', completed:false, completedAt:'' },
      '5':{id:'5',projectId:'1',title:'task5',detail:'', createdAt: moment(), creator: '2', assignee:'2', dueAt: '', completed:true, completedAt:'' },
    }
  },
  users:{
    allIds:['1','2','3'],
    byId:{
      '1':{qq:'1',name:"Luosang"},
      '2':{qq:'2',name:"Luoshui"},
      '3':{qq:'3',name:"Riddle"}
    }
  },

  me: {
    qq:'1'
  }
}

const getFilteredTasks = (tasks,filter = {}) => {
  const { projectId,creator,completed,createdBetween } = filter
  let filtered = tasks.allIds
  if(projectId && projectId.length > 0){
    console.log('inprojectId');
    filtered = filtered.filter( id =>
      projectId.indexOf(tasks.byId[id].projectId)>-1
    )
  }
  if(creator && creator.length > 0){
    console.log('increator',creator);
    filtered = filtered.filter( id =>
      creator.indexOf(tasks.byId[id].creator)>-1
    )
  }
  if(completed && completed !== 'all'){
    console.log('inComplete',completed);
    const isComplete = (completed === 'completed')?true:false
    filtered = filtered.filter( id =>
      tasks.byId[id].completed === isComplete
    )
  }
  if(createdBetween && createdBetween !== []){
    console.log('increateBtw');
    filtered = filtered.filter( id =>
      tasks.byId[id].createdAt > createdBetween[0] &&
      tasks.byId[id].createdAt < createdBetween[1]
    )
  }
  let byId = {}
  filtered.forEach(id => {
    byId = {...byId,[id]:tasks.byId[id]}
  })

  return {allIds:filtered,byId:byId}
}

const delay = ms =>
  new Promise(resolve => setTimeout(resolve,ms))

//filter is an object in redux store that pass by action:{}

export const fetchProjects = () => delay(1000).then(() => fakedb.projects)

export const fetchTasks = (filter={}) => delay(1000).then(() => getFilteredTasks(fakedb.tasks,filter))

export const fetchUsers = () => delay(1000).then(() => fakedb.users)

const task = {id:v4(),projectId:'1',title:'task1',detail:'', createdAt: moment(), creator: '3', assignee:'3', dueAt: '', completed:false, completedAt:'' },

export const insertTask = (task) => delay(1000).then(() => )

// export const fetchData / insertData / updateData / deleteData

// export const fetchData = () => {
//   return axios.get('/user').then(res => res.data)
// }
//
//
// export const auth = (name,password) => delay(600).then(() => {
//   return fakedb.auth.name === name && fakedb.auth.password === password
// })
