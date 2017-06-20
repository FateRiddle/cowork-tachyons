//Login data:
export const me = {name:"fateriddle",id:"3",psw:"123123"}

export const persistedState = {
  projects:{
    allIds:['11','22'],
    byId:{
      '11':{id:'11',title:"project1",group:['1','2','3']},
      '22':{id:'22',title:"project2",group:['2']},
    },
  },

  tasks:{
    allIds:['111','222','333','444','555'],
    byId:{
      '111':{id:'111',assignee:'3',projectId:'',upTaskId:'',title:'task1:',detail:'',completed:'active',createdAt:'',createdBy:'3',dueAt:''},
      '222':{id:'222',assignee:'3',projectId:'22',upTaskId:'',title:'task2',detail:'more',completed:'active',createdAt:'',createdBy:'3',dueAt:''},
      '333':{id:'333',assignee:'1',projectId:'22',upTaskId:'',title:'task3',detail:'',completed:'active',createdAt:'',createdBy:'1',dueAt:''},
      '444':{id:'444',assignee:'3',projectId:'',upTaskId:'',title:'task4',detail:'',completed:'active',createdAt:'',createdBy:'3',dueAt:''},
      '555':{id:'555',assignee:'',projectId:'11',upTaskId:'',title:'task5',detail:'',completed:'active',createdAt:'',createdBy:'3',dueAt:''},
    }
  },

  users:{
    allIds:['1','2','3'], //这个id以后就是qq
    byId:{
      '1':{id:'1',name:"Luosang"},
      '2':{id:'2',name:"Luoshui"},
      '3':{id:'3',name:"Riddle"}
    }
  },

  completed: 'active', // completed,active,all

  search:{
    // assignee:me.id,
    // createdBy:me.id,
    // createdAt:'',
    // dueAt:'',
  }
}

//不用放在state里，因为是死数据
export const completedTabs = [
  {name:'未完成',id:'active'},
  {name:'全部',id:'all'},
  {name:'完成',id:'completed'},
]

//
// export const filterTabs = [
//   {
//     name: '分配我的任务',
//     search:{
//       assignee:me.id,
//       createdBy:me.id,
//     }
//   },
//   {
//     name: '我创建的任务',
//     search:{
//       assignee:me.id,
//       createdBy:me.id,
//       createdAt:'',
//       dueAt:'',
//     }
//   },
// ]
