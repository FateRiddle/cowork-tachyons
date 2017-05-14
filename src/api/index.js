// import axios from 'axios'
import moment from 'moment'
import { v4 } from 'uuid'
import axios from 'axios'
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

//先让assignee 默认等于 creator， 之后再改

const fakedb = {
  projects:[
    {id:'11',title:"project1",group:['1','2','3']},
    {id:'22',title:"project2",group:['2']},
  ],

  tasks:[
    {id:'111',assignee:'3',projectId:'',title:'task1:',detail:'',completed:'active',createdAt:'',createdBy:'3',dueAt:''},
    {id:'222',assignee:'3',projectId:'22',title:'task2',detail:'more',completed:'active',createdAt:'',createdBy:'3',dueAt:''},
    {id:'333',assignee:'1',projectId:'22',title:'task3',detail:'',completed:'active',createdAt:'',createdBy:'1',dueAt:''},
    {id:'444',assignee:'3',projectId:'',title:'task4',detail:'',completed:'active',createdAt:'',createdBy:'3',dueAt:''},
    {id:'555',assignee:'',projectId:'11',title:'task5',detail:'',completed:'active',createdAt:'',createdBy:'3',dueAt:''},
  ],

  users:[
    {id:'1',name:"Luosang"},
    {id:'2',name:"Luoshui"},
    {id:'3',name:"Riddle"}
  ],

  //这几个属性不需要每次加载，只要default就行！
  completed: 'active', // completed,active,all

  search:{
    // assignee:me.id,
    // createdBy:me.id,
    // createdAt:'',
    // dueAt:'',
  },
  me: {
    name:"Riddle",id:"3",psw:"123123"
  }
}

const delay = ms =>
  new Promise(resolve => setTimeout(resolve,ms))


export const fetchState = () => delay(1000).then(() => fakedb)


/////////////////////////////////////async
