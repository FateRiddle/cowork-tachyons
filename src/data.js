export const persistedState = {
  projects:{
    allIds:['11','22'],
    byId:{
      '11':{id:'11',title:"project1"},
      '22':{id:'22',title:"project2"},
    },
  },
  tasks:{
    allIds:['111','222','333','444','555'],
    byId:{
      '111':{id:'111',assignee:'3',projectId:'',title:'task1:',completed:false,createdAt:'',deadline:''},
      '222':{id:'222',assignee:'3',projectId:'22',title:'task2',detail:'more',completed:false,createdAt:'',deadline:''},
      '333':{id:'333',assignee:'1',projectId:'22',title:'task3',completed:false,createdAt:'',deadline:''},
      '444':{id:'444',assignee:'3',projectId:'',title:'task4',completed:false,createdAt:'',deadline:''},
      '555':{id:'555',assignee:'',projectId:'11',title:'task5',completed:false,createdAt:'',deadline:''},
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

  // me:{
  //   name:'wy',
  //   userName:'Riddle',
  //   password:'1234'
  // }
  // currentProject:{
  //   id:'me',
  // },
  // currentTask:{
  //   id:'0',
  // },
}

//Login data:

export const me = {name:"Fate Riddle",qq:"3",psw:"123123"}

//sample filter:
export const filter = {
  name: '布置给我的任务',
  filter:{
    project:{title:"project1"},
    tasks:{assignee:3}, //assignee,projectId,title,completed,createdAt,deadline
    users:{name:"Riddle"},//name
  }
}
