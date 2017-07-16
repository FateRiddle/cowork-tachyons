const router = require('express').Router()
const { sql, db } = require('../../db')
const moment = require('moment')

const query = (query, res) => {
  db
    .then(pool => pool.request().query(query))
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      console.error(err)
    })
}

router.get('/', (req, res, next) => {
  const { userId = '', projectId = '', upTaskId = '', rootOf } = req.query
  const GET_Root = `
    select a.* from tb_cowork_task a
    inner join tb_cowork_task b on a.id = b.rootTaskId
    where b.id = '${rootOf}'
  `
  const otherGET = `
    select a.*, ${userId !== ''
      ? 'c.myOrder'
      : 'b.taskOrder'} from tb_cowork_task a
    ${userId === ''
      ? `inner join tb_cowork_task_order b on a.id = b.taskId`
      : `inner join tb_cowork_task_myOrder c on a.id = c.taskId and c.userId = '${userId}' `}
    where ('${userId}' = '' or a.assignee = '${userId}')
    and ('${projectId}' = '' or a.projectId = '${projectId}')
    and ('${upTaskId}' = '' or a.upTaskId = '${upTaskId}')
    ${userId === '' ? `order by b.taskOrder` : `order by c.myOrder`}
  `
  query(rootOf ? GET_Root : otherGET, res)
})

router.get('/:id', (req, res, next) => {
  const { id } = req.params
  query(`select * from tb_cowork_task where id='${id}'`, res)
})

//addTask/addSubtask/insertTask/insertSubtask
router.post('/', (req, res, next) => {
  let {
    id,
    projectId = '',
    assignee = '',
    upTaskId,
    rootTaskId = '',
    upTaskTitle = '',
    insertAt
  } = req.body
  const now = moment().format()

  query(
    `
      begin tran
        ${upTaskId
          ? `insert into tb_cowork_task
        (id,completed,createdAt,upTaskId,rootTaskId,upTaskTitle)
          values
        ('${id}','active','${now}','${upTaskId}','${rootTaskId}','${upTaskTitle}')`
          : `insert into tb_cowork_task
        (id,assignee,projectId,completed,createdAt)
          values
        ('${id}','${assignee}','${projectId}','active','${now}')`}
        declare @order numeric(12,6)
        set @order=1
        ${projectId || upTaskId
          ? `
          ${insertAt
            ? `
            if('${insertAt}' = (select top 1 taskId from tb_cowork_task_order order by taskOrder desc))
              select @order=taskOrder+1 from tb_cowork_task_order where taskId = '${insertAt}'
            else
            begin
              declare @insertOrder numeric(12,6)
              declare @nextOrder numeric(12,6)
              select @insertOrder = taskOrder from tb_cowork_task_order where taskId='${insertAt}'
              set @nextOrder = (select top 1 taskOrder from tb_cowork_task_order where taskOrder > @insertOrder order by taskOrder)
              set @order = (@insertOrder + @nextOrder)/2
            end
            `
            : 'select @order = isnull(max(taskOrder)+1,1) from tb_cowork_task_order'}
          insert into tb_cowork_task_order
          (taskId,taskOrder)
            values
          ('${id}', @order)
          `
          : ''}
        ${assignee
          ? `
          ${insertAt
            ? `
            if('${insertAt}' = (select top 1 taskId from tb_cowork_task_myOrder
                where userId='${assignee}' order by myOrder desc))
              select @order=myOrder+1 from tb_cowork_task_myOrder
                where userId='${assignee}' and taskId = '${insertAt}'
            else
            begin
              declare @temp numeric(12,6)
              select @order = myOrder from tb_cowork_task_myOrder
                where userId='${assignee}' and taskId='${insertAt}'
              set @temp = (select top 1 myOrder from tb_cowork_task_myOrder
                where userId='${assignee}' and myOrder > @order order by myOrder)
              set @order = (@order + @temp)/2
            end
            `
            : `select @order = isnull(max(myOrder)+1,1) from tb_cowork_task_myOrder where userId='${assignee}'`}

          insert into tb_cowork_task_myOrder
          (taskId,myOrder,userId)
            values
          ('${id}', @order,'${assignee}')
          `
          : ''}
      if @@error != 0
      rollback tran
      commit tran
    `,
    res
  )
})

router.put('/:id', (req, res, next) => {
  const { id } = req.params
  const { title, detail, projectId, assignee, dueAt } = req.body
  console.log(req.body)
  const toggle = req.body.toggle ? 1 : 0
  const now = moment().format()

  const change_assignee_order = assignee === '0'
    ? `delete from tb_cowork_task_myOrder where taskId='${id}'`
    : `if exists(select 1 from tb_cowork_task_myOrder where taskId='${id}' and userId='${assignee}')
    update tb_cowork_task_myOrder set myOrder=@order where taskId='${id}' and userId='${assignee}'
    else
    insert into tb_cowork_task_myOrder (taskId,myOrder,userId) values ('${id}',@order,'${assignee}')
  `
  const assignTask = assignee
    ? `update tb_cowork_task set assignee='${assignee}' where id='${id}'
    ${change_assignee_order}
    `
    : ''
  const change_project_order = projectId === '0'
    ? `delete from tb_cowork_task_order where taskId='${id}'`
    : `if not exists(select 1 from tb_cowork_task_order where taskId='${id}')
    insert into tb_cowork_task_order (taskId,taskOrder) values ('${id}',@order)
  `
  const editProject = projectId
    ? `update tb_cowork_task set projectId='${projectId}' where id='${id}'
    ${change_project_order}
    `
    : ''

  query(
    `
      begin tran
        declare @order numeric(12,6)
        ${assignee
          ? `select @order=min(myOrder)-1 from tb_cowork_task_myOrder where userId='${assignee}'`
          : ''}
        ${assignTask}
        ${projectId
          ? `select @order=max(taskOrder)+1 from tb_cowork_task_order`
          : ''}
        ${editProject}
        ${title === undefined
          ? ''
          : `update tb_cowork_task set title='${title}' where id='${id}'`}
        ${detail === undefined
          ? ''
          : `update tb_cowork_task set detail='${detail}' where id='${id}'`}
        ${dueAt === undefined
          ? ''
          : dueAt === null
            ? `update tb_cowork_task set dueAt=null where id='${id}'`
            : `update tb_cowork_task set dueAt='${dueAt}' where id='${id}'`}
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
    `,
    res
  )
})

router.put('/order/:id', (req, res, next) => {
  const { id } = req.params
  const { before, type, targetId } = req.body
  console.log({ before, type, targetId })

  let calc_order = ''
  let update_order = ''
  if (type === 'task') {
    if (before) {
      calc_order = `
        if('${targetId}'=(select top 1 taskId from tb_cowork_task_order order by taskOrder))
        select @order=taskOrder-1 from tb_cowork_task_order where taskId='${targetId}'
        else
        begin
          select @order=taskOrder from tb_cowork_task_order where taskId='${targetId}'
          select top 1 @temp=taskOrder from tb_cowork_task_order where taskOrder<@order order by taskOrder desc
          set @order=(@order+@temp)/2
        end
      `
    } else {
      calc_order = `
        if('${targetId}'=(select top 1 taskId from tb_cowork_task_order order by taskOrder desc))
        select @order=taskOrder+1 from tb_cowork_task_order where taskId='${targetId}'
        else
        begin
          select @order=taskOrder from tb_cowork_task_order where taskId='${targetId}'
          select top 1 @temp=taskOrder from tb_cowork_task_order where taskOrder>@order order by taskOrder
          set @order=(@order+@temp)/2
        end
      `
    }
  } else if (type === 'my') {
    if (before) {
      calc_order = `
        if('${targetId}'=(select top 1 taskId from tb_cowork_task_myOrder order by myOrder))
        select @order=myOrder-1 from tb_cowork_task_myOrder where taskId='${targetId}'
        else
        begin
          select @order=myOrder from tb_cowork_task_myOrder where taskId='${targetId}'
          select top 1 @temp=myOrder from tb_cowork_task_myOrder where myOrder<@order order by myOrder desc
          set @order=(@order+@temp)/2
        end
      `
    } else {
      calc_order = `
        if('${targetId}'=(select top 1 taskId from tb_cowork_task_myOrder order by myOrder desc))
        select @order=myOrder+1 from tb_cowork_task_myOrder where taskId='${targetId}'
        else
        begin
          select @order=myOrder from tb_cowork_task_myOrder where taskId='${targetId}'
          select top 1 @temp=myOrder from tb_cowork_task_myOrder where myOrder>@order order by myOrder
          set @order=(@order+@temp)/2
        end
      `
    }
  }
  if (type === 'task') {
    update_order = `update tb_cowork_task_order set taskOrder=@order where taskId='${id}'`
  } else if (type === 'my') {
    update_order = `update tb_cowork_task_myOrder set myOrder=@order where taskId='${id}'`
  }
  //   console.log(`
  //   begin tran
  //   declare @order numeric(12,6)
  //   declare @temp numeric(12,6)
  //   ${calc_order}
  //   ${update_order}
  //   if @@error != 0
  //   rollback tran
  //   commit tran
  // `)
  query(
    `
      begin tran
      declare @order numeric(12,6)
      declare @temp numeric(12,6)
      ${calc_order}
      ${update_order}
      if @@error != 0
      rollback tran
      commit tran
    `,
    res
  )
})

router.delete('/:id', (req, res) => {
  const { id } = req.params
  console.log('id', req.params)
  query(
    `
      begin tran
        delete from tb_cowork_task where id = '${id}'
        delete from tb_cowork_task_order where taskId = '${id}'
      if @@error != 0
      rollback tran
      commit tran
    `,
    res
  )
})

router.post('/search', (req, res, next) => {
  //it is actually a get request
  const {
    assignee,
    projectId,
    completed,
    createdAt,
    createdBy,
    dueAt
  } = req.body

  const stringify = array => {
    if (!array || array.length === 0) {
      return ''
    }
    return array.map(a => `'${a}'`).reduce((a, b) => `${a},${b}`)
  }
  // const now = moment().format()
  query(
    `
      select a.*,b.taskOrder from tb_cowork_task a
      inner join tb_cowork_task_order b on a.id = b.taskId
      where ${stringify(assignee)
        ? `assignee in (${stringify(assignee)})`
        : '1=1'}
      and ${stringify(projectId)
        ? `projectId in (${stringify(projectId)})`
        : '1=1'}
      and ${stringify(createdBy)
        ? `createdBy in (${stringify(createdBy)})`
        : '1=1'}
      and ${createdAt ? `createdAt = '${createdAt}'` : '1=1'}
      and ${dueAt ? `dueAt = '${dueAt}'` : '1=1'}
      and ('${completed}'='all' or completed = '${completed}')
      order by b.taskOrder
    `,
    res
  )
})

module.exports = router

// where ('${userId}' = '' or a.assignee = '${userId}')
// and ('${projectId}' = '' or a.projectId = '${projectId}')
