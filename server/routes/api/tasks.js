const router = require('express').Router()
const { sql, db } = require('../../db')
const moment = require('moment')

router.get('/', (req, res, next) => {
  const { userId = '', projectId = '', upTaskId = '' } = req.query

  db
    .then(pool =>
      pool.request().query(`
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
      `)
    )
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      console.error(err)
    })
})

//addTask/addSubtask/insertTask/insertSubtask
router.post('/', (req, res, next) => {
  let { id, projectId = '', assignee = '', upTaskId = '', insertAt } = req.body
  const now = moment().format()

  db
    .then(pool => {
      return pool.request().query(`
        begin tran
          insert into tb_cowork_task
          (id,assignee,projectId,completed,createdAt,upTaskId)
            values
          ('${id}','${assignee}','${projectId}','active','${now}','${upTaskId}')

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
      `)
    })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      console.error(err)
    })
})

router.put('/:id', (req, res, next) => {
  const { id } = req.params
  const {
    title,
    detail,
    projectId,
    idsForEditProject,
    assignee,
    dueAt
  } = req.body
  console.log(req.body)
  const toggle = req.body.toggle ? 1 : 0
  const now = moment().format()

  let projectEdit = ''
  if (projectId) {
    projectEdit = idsForEditProject
      .map(
        id =>
          `update tb_cowork_task set projectId='${projectId}' where id='${id}';`
      )
      .reduce((a, b) => a + b)
  }
  const insert_update_assignee = assignee === '0'
    ? `delete from tb_cowork_task_myOrder where taskId='${id}'`
    : `if exists(select 1 from tb_cowork_task_myOrder where taskId='${id}' and userId='${assignee}')
    update tb_cowork_task_myOrder set myOrder=@order where taskId='${id}' and userId='${assignee}'
    else
    insert into tb_cowork_task_myOrder (taskId,myOrder,userId) values ('${id}',@order,'${assignee}')
  `
  const assignTask = assignee
    ? `update tb_cowork_task set assignee='${assignee}' where id='${id}'
    ${insert_update_assignee}
    `
    : ''

  console.log(`declare @order numeric(12,6)
  select @order=min(myOrder)-1 from tb_cowork_task_myOrder where userId='${assignee}'
  ${title === undefined
    ? ''
    : `update tb_cowork_task set title='${title}' where id='${id}'`}
  ${detail === undefined
    ? ''
    : `update tb_cowork_task set detail='${detail}' where id='${id}'`}
  ${projectEdit}
  ${assignTask}
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
  end`)
  db
    .then(pool =>
      pool.request().query(`
      begin tran
        declare @order numeric(12,6)
        select @order=min(myOrder)-1 from tb_cowork_task_myOrder where userId='${assignee}'
        ${title === undefined
          ? ''
          : `update tb_cowork_task set title='${title}' where id='${id}'`}
        ${detail === undefined
          ? ''
          : `update tb_cowork_task set detail='${detail}' where id='${id}'`}
        ${projectEdit}
        ${assignTask}
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
    `)
    )
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      console.error(err)
    })
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
  db
    .then(pool =>
      pool.request().query(`
      begin tran
      declare @order numeric(12,6)
      declare @temp numeric(12,6)
      ${calc_order}
      ${update_order}
      if @@error != 0
      rollback tran
      commit tran
    `)
    )
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      console.error(err)
    })
})

router.delete('/:id', (req, res) => {
  const { id } = req.params
  console.log('id', req.params)
  db
    .then(pool =>
      pool.request().query(`
      begin tran
        delete from tb_cowork_task where id = '${id}'
        delete from tb_cowork_task_order where taskId = '${id}'
      if @@error != 0
      rollback tran
      commit tran
    `)
    )
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      console.error(err)
    })
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
  console.log(`
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
  `)
  db
    .then(pool => {
      return pool.request().query(`
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
    `)
    })
    .then(data => {
      res.send(data.recordset)
    })
    .catch(err => {
      console.error(err)
    })
})

module.exports = router

// where ('${userId}' = '' or a.assignee = '${userId}')
// and ('${projectId}' = '' or a.projectId = '${projectId}')
