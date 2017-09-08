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
      res.status(500).json({ errors: err.toString() })
    })
}

const changeUpProgress = id => `
  declare @current varchar(50)
  set @current = '${id}'
  while(exists(select upTaskId from tb_cowork_task where id=@current and upTaskId<>''))
  begin
    select @current=upTaskId from tb_cowork_task where id=@current
    declare @amount numeric(6,3)
    declare @progress numeric(6,3)
    select @amount = SUM(isnull(amount,1)) from tb_cowork_task where upTaskId = @current
    if(@amount = 0)
      set @progress = 0
    else
    begin
      select @progress = SUM(
        (CASE WHEN completed='completed' THEN 100 ELSE isnull(progress,0) END)
        *isnull(amount,1)
      ) from tb_cowork_task where upTaskId = @current
      set @progress = @progress/@amount
    end
    update tb_cowork_task set amount = @amount, progress = @progress where id=@current
  end
`

router.get('/', (req, res, next) => {
  const { userId = '', projectId = '', upTaskId = '', taskId, rootOf, projectIdAll } = req.query
  // console.log(req.query)

  const add_hasSubtask = `
    with tasktable as
    (
      SELECT distinct a.*,
      CASE WHEN b.id is null THEN 0
           ELSE 1 END as hasSubtask
      FROM tb_cowork_task a
      left join tb_cowork_task b on a.id = b.upTaskId
    )
  `
  const GET_root = `${add_hasSubtask}
    select a.* from tasktable a
    inner join tb_cowork_task b on a.id = b.rootTaskId
    where b.id = '${rootOf}'
  `
  const GET_byId = `${add_hasSubtask}
    select * from tasktable
    where id = '${taskId}'
  `
  const GET_projectAll = `
    select a.*, b.taskOrder from tb_cowork_task a
    inner join tb_cowork_task_order b on a.id = b.taskId
    left join tb_cowork_task c on a.rootTaskId = c.id
    where '${projectIdAll}' in (a.projectId,c.projectId)
    order by b.taskOrder
  `
  const GET_other = `${add_hasSubtask}
    select a.*, ${userId !== '' ? 'c.myOrder' : 'b.taskOrder'}
    from tasktable a
    ${userId === ''
      ? `inner join tb_cowork_task_order b on a.id = b.taskId`
      : `inner join tb_cowork_task_myOrder c on a.id = c.taskId and c.userId = '${userId}' `}
    where ('${userId}' = '' or a.assignee = '${userId}')
    and ('${projectId}' = '' or a.projectId = '${projectId}')
    and ('${upTaskId}' = '' or a.upTaskId = '${upTaskId}')
    ${userId === '' ? `order by b.taskOrder` : `order by c.myOrder`}
  `
  const searchQuery = () => {
    if (rootOf) {
      return GET_root
    }
    if (taskId) {
      return GET_byId
    }
    if (projectIdAll) {
      return GET_projectAll
    }
    return GET_other
  }
  // console.log(searchQuery())
  query(searchQuery(), res)
})

router.get('/:id', (req, res, next) => {
  const { id } = req.params
  query(`select * from tb_cowork_task where id='${id}'`, res)
})

//addTask/addSubtask/insertTask/insertSubtask
router.post('/', (req, res, next) => {
  let {
    id,
    createdBy = '',
    projectId = '',
    assignee = '',
    upTaskId,
    rootTaskId = '',
    upTaskTitle = '',
    insertAt,
  } = req.body
  const now = moment().format()

  //when Amount changes, progress will also change

  const changeTaskOrder = `
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

  const changeMyOrder = `
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

  const changeOrder = `
  declare @order numeric(12,6)
  set @order=1
  ${projectId || upTaskId ? changeTaskOrder : ''}
  ${assignee ? changeMyOrder : ''}`

  query(
    `
      begin tran
        ${upTaskId
          ? `insert into tb_cowork_task
          (id,createdBy,completed,createdAt,beginAt,progress,amount,upTaskId,rootTaskId,upTaskTitle)
            values
          ('${id}','${createdBy}','active','${now}','${now}',0,1,'${upTaskId}','${rootTaskId}','${upTaskTitle}')
          ${changeUpProgress(id)}`
          : `insert into tb_cowork_task
          (id,createdBy,assignee,projectId,completed,createdAt,beginAt,progress,amount)
            values
          ('${id}','${createdBy}','${assignee}','${projectId}','active','${now}','${now}',0,1)`}
        ${changeOrder}
      if @@error != 0
      rollback tran
      commit tran
    `,
    res
  )
})

//editTitle,editDetail,editProject,editAssignee,editDue,editProgress,editAmount,toggle
router.put('/:id', (req, res, next) => {
  const { id } = req.params
  const { title, detail, projectId, assignee, dueAt, beginAt, toggle, amount, progress } = req.body
  // console.log(req.body)
  const now = moment().format()

  const change_assignee_order =
    assignee === '0'
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
  const change_project_order =
    projectId === '0'
      ? `delete from tb_cowork_task_order where taskId='${id}'`
      : `if not exists(select 1 from tb_cowork_task_order where taskId='${id}')
      insert into tb_cowork_task_order (taskId,taskOrder) values ('${id}',@order)
    `
  const editProject = projectId
    ? `update tb_cowork_task set projectId='${projectId}' where id='${id}'
    ${change_project_order}
    `
    : ''

  const toggleTask = toggle
    ? `begin
    if exists(select 1 from tb_cowork_task where id='${id}' and completed='active')
      update tb_cowork_task set completed='completed', completedAt='${now}' where id='${id}'
    else
      update tb_cowork_task set completed='active',completedAt='' where id='${id}'
    ${changeUpProgress(id)}
  end
  `
    : ''
  const changeAmount =
    amount !== undefined && progress !== null
      ? `update tb_cowork_task set amount = ${amount} where id='${id}'
      ${changeUpProgress(id)}
    `
      : ''
  const changeProgress =
    progress !== undefined && progress !== null
      ? `update tb_cowork_task set progress = ${progress} where id='${id}'
      ${changeUpProgress(id)}
    `
      : ''

  db
    .then(pool =>
      pool
        .request() //user params to prevent sql injection
        .input('title', sql.NVarChar(500), title)
        .input('detail', sql.NVarChar(5000), detail).query(`
        begin tran
          declare @order numeric(12,6)
          ${assignee
            ? `select @order=min(myOrder)-1 from tb_cowork_task_myOrder where userId='${assignee}'`
            : ''}
          ${assignTask}
          ${projectId ? `select @order=max(taskOrder)+1 from tb_cowork_task_order` : ''}
          ${editProject}
          ${title !== undefined ? `update tb_cowork_task set title=@title where id='${id}'` : ''}
          ${detail !== undefined ? `update tb_cowork_task set detail=@detail where id='${id}'` : ''}
          ${dueAt === undefined
            ? ''
            : dueAt === null
              ? `update tb_cowork_task set dueAt=null where id='${id}'`
              : `update tb_cowork_task set dueAt='${dueAt}' where id='${id}'`}
          ${beginAt === undefined
            ? ''
            : beginAt === null
              ? `update tb_cowork_task set beginAt=null where id='${id}'`
              : `update tb_cowork_task set beginAt='${beginAt}' where id='${id}'`}
          ${toggleTask}
          ${changeAmount}
          ${changeProgress}
        if @@error != 0
        rollback tran
        commit tran
      `)
    )
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).json({ errors: err.toString() })
    })
})

router.put('/order/:id', (req, res, next) => {
  const { id } = req.params
  const { before, type, targetId } = req.body
  // console.log({ before, type, targetId })

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
  const { upId } = req.query
  // console.log('upid', req.query)
  query(
    `
      begin tran
        ${upId
          ? `
          update tb_cowork_task set amount=0 where id = '${id}'
          ${changeUpProgress(id)}
          `
          : ''}
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
  const { assignee, projectId, beginAt, completedAt } = req.body
  // console.log(req.body)

  const stringify = array => {
    if (!array || array.length === 0) {
      return ''
    }
    return array.map(a => `'${a}'`).reduce((a, b) => `${a},${b}`)
  }
  // const now = moment().format()

  const date_in_range = () => {
    const from = beginAt ? `a.beginAt >= '${beginAt}' or a.completedAt >= '${beginAt}'` : '1=1'
    const to = completedAt
      ? `a.beginAt <= '${completedAt}' or a.completedAt <= '${completedAt}'`
      : '1=1'
    return `${from} and ${to}`
  }
  // `(a.projectId <> '' and a.projectId is not null) or
  //   (c.projectId <> '' and c.projectId is not null)`
  query(
    `
      select distinct a.*,b.taskOrder,
      CASE WHEN d.id is null THEN 0
           ELSE 1 END as hasSubtask
      from tb_cowork_task a
      inner join tb_cowork_task_order b on a.id = b.taskId
      left join tb_cowork_task c on a.rootTaskId = c.id
      left join tb_cowork_task d on a.id = d.upTaskId
      where ${stringify(assignee) ? `a.assignee in (${stringify(assignee)})` : '1=1'}
      and ${stringify(projectId)
        ? `(a.projectId in (${stringify(projectId)}) or c.projectId in (${stringify(projectId)}))`
        : `((a.projectId <> '' and a.projectId is not null) or
            (c.projectId <> '' and c.projectId is not null))`}
      and ${date_in_range()}
      order by b.taskOrder
    `,
    res
  )
})

module.exports = router
