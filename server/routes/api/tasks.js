const router = require('express').Router()
const { sql,db } = require('../../db')
const moment = require('moment')

router.get('/', (req, res, next) => {
  const { userId='', projectId='' } = req.query
  db.then( pool =>
    pool.request()
    .query(`
      select a.*,b.taskOrder from tb_cowork_task a
      inner join tb_cowork_task_order b on a.id = b.taskId
      where ('${userId}' = '' or a.assignee = '${userId}')
      and ('${projectId}' = '' or a.projectId = '${projectId}')
      order by b.taskOrder
    `)
  ).then(data => {
    res.send(data)
  }).catch(err => {
    console.error(err)
  })
})

router.post('/', (req, res, next) => {
  let { id,projectId,assignee,taskOrder,taskId,upTaskId } = req.body
  if(upTaskId){
    taskId = upTaskId
  }
  if(!taskId){
    taskId = ''
  }
  if(!taskOrder){
    taskOrder = 0
  }
  const now = moment().format()
  db.then( pool => {
    return pool.request()
    .query(`
      declare @order numeric(12,6)
      set @order = ${taskOrder}
      declare @temp numeric(12,6)
      declare @temp2 numeric(12,6)
      if('${taskId}' != '')
      begin
        select @temp = taskOrder from tb_cowork_task_order where taskId = '${taskId}'
        if not exists (select 1 from tb_cowork_task_order where taskOrder>@temp)
          set @order = @temp + 1
        else
        begin
          select top 1 @temp2 = taskOrder from tb_cowork_task_order where taskOrder>@temp order by taskOrder
          set @order = (@temp + @temp2)/2
        end
      end
      begin tran
        insert into tb_cowork_task
        (id,assignee,projectId,completed,createdAt,upTaskId)
          values
        ('${id}','${assignee}','${projectId}','active','${now}',${upTaskId?`'${upTaskId}'`:'null'});
        insert into tb_cowork_task_order
        (taskId,taskOrder)
          values
        ('${id}', @order)
      if @@error != 0
      rollback tran
      commit tran
    `)
  }).then(data => {
    res.send(data)
  }).catch(err => {
    console.error(err)
  })
})

router.put('/:id', (req, res, next) => {
  const { id } = req.params
  const { title,detail,projectId,assignee,dueAt,order } = req.body
  const toggle = req.body.toggle?1:0
  const now = moment().format()

  db.then( pool =>
    pool.request()
    .query(`
      begin tran
        ${title === undefined?'':`update tb_cowork_task set title='${title}' where id='${id}'`}
        ${detail === undefined?'':`update tb_cowork_task set detail='${detail}' where id='${id}'`}
        ${!projectId?'':`update tb_cowork_task set projectId='${projectId}' where id='${id}'`}
        ${!assignee?'':`update tb_cowork_task set assignee='${assignee}' where id='${id}'`}
        ${dueAt === undefined?'':dueAt === null?`update tb_cowork_task set dueAt=null where id='${id}'`:`update tb_cowork_task set dueAt='${dueAt}' where id='${id}'`}
        ${!order?'':`update tb_cowork_task_order set taskOrder='${order}' where taskId='${id}'`}
        if(${toggle} = 1)
        begin
          if exists( select 1 from tb_cowork_task where id='${id}' and completed='active')
            update tb_cowork_task set completed='completed', completedAt='${now}' where id='${id}'
          else
            update tb_cowork_task set completed='active' where id='${id}'
        end
      if @@error != 0
      rollback tran
      commit tran
    `)
  ).then(data => {
    res.send(data)
  }).catch(err => {
    console.error(err)
  })
})

router.delete('/:id', (req,res) => {
  const { id } = req.params
  console.log('id',req.params)
  db.then( pool =>
    pool.request()
    .query(`
      begin tran
        delete from tb_cowork_task where id = '${id}'
        delete from tb_cowork_task_order where taskId = '${id}'
      if @@error != 0
      rollback tran
      commit tran
    `)
  ).then(data => {
    res.send(data)
  }).catch(err => {
    console.error(err)
  })
})

router.post('/search', (req, res, next) => { //it is actually a get request
  const { assignee,projectId,completed,createdAt,createdBy,dueAt } = req.body

  const stringify = (array) => {
    if(!array || array.length === 0){
      return ''
    }
    return array.map(a => `'${a}'`).reduce((a,b) => `${a},${b}` )
  }
  // const now = moment().format()
  console.log(`
    select a.*,b.taskOrder from tb_cowork_task a
    inner join tb_cowork_task_order b on a.id = b.taskId
    where ${stringify(assignee)?`assignee in (${stringify(assignee)})`:'1=1'}
    and ${stringify(projectId)?`projectId in (${stringify(projectId)})`:'1=1'}
    and ${stringify(createdBy)?`createdBy in (${stringify(createdBy)})`:'1=1'}
    and ${createdAt?`createdAt = '${createdAt}'`:'1=1'}
    and ${dueAt?`dueAt = '${dueAt}'`:'1=1'}
    and ('${completed}'='all' or completed = '${completed}')
    order by b.taskOrder
  `)
  db.then( pool => {
    return pool.request()
    .query(`
      select a.*,b.taskOrder from tb_cowork_task a
      inner join tb_cowork_task_order b on a.id = b.taskId
      where ${stringify(assignee)?`assignee in (${stringify(assignee)})`:'1=1'}
      and ${stringify(projectId)?`projectId in (${stringify(projectId)})`:'1=1'}
      and ${stringify(createdBy)?`createdBy in (${stringify(createdBy)})`:'1=1'}
      and ${createdAt?`createdAt = '${createdAt}'`:'1=1'}
      and ${dueAt?`dueAt = '${dueAt}'`:'1=1'}
      and ('${completed}'='all' or completed = '${completed}')
      order by b.taskOrder
    `)
  }).then(data => {
    res.send(data.recordset)
  }).catch(err => {
    console.error(err)
  })
})

module.exports = router

// where ('${userId}' = '' or a.assignee = '${userId}')
// and ('${projectId}' = '' or a.projectId = '${projectId}')
