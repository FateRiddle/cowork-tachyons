const router = require('express').Router()
const { sql, db } = require('../../db')

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

router.get('/', (req, res, next) => {
  db
    .then(pool =>
      pool.request().query(
        `select distinct a.*,
        CASE WHEN b.id is null THEN 0
             ELSE 1 END as hasTask
        from tb_cowork_project a
        left join tb_cowork_task b on a.id = b.projectId
        where isNull(a.deleted,0) != 1
        select * from tb_cowork_project_group a
        inner join tb_cowork_project b on a.projectId = b.id
        where isNull(b.deleted,0) != 1
        `
      )
    )
    .then(data => {
      //将group内容并入project
      const projects = data.recordsets[0]
      const groups = data.recordsets[1]
      data.recordset = projects.map(project => {
        return Object.assign({}, project, {
          group: groups.filter(group => group.projectId === project.id).map(group => group.userId),
        })
      })
      res.send(data)
    })
    .catch(err => {
      res.status(500).json({ errors: err.toString() })
    })
})

router.post('/', (req, res, next) => {
  const { id, title, group } = req.body
  let groupValue = group
    .map(item => {
      return `('${id}','${item}')`
    })
    .reduce((a, b) => a + ',' + b)
  db
    .then(pool =>
      pool
        .request() //user params to prevent sql injection
        .input('title', sql.NVarChar(500), title)
        .output('message', sql.NVarChar(50), '').query(`
      begin tran
        if exists(select 1 from tb_cowork_project where title=@title)
        begin
          set @message = '此项目名已存在。'
        end
        else
        begin
          insert into tb_cowork_project (id,title,deleted)
          values('${id}',@title,0)
          insert into tb_cowork_project_group (projectId,userId)
          values ${groupValue}
        end
      if @@error != 0
      rollback tran
      commit tran
    `)
    )
    .then(data => {
      const result = Object.assign({}, data, {
        id,
        title,
        group,
      })
      res.send(result)
    })
    .catch(err => {
      res.status(500).json({ errors: err.toString() })
    })
})

//edit project
router.put('/', (req, res, next) => {
  const { id, title, group } = req.body
  console.log({ id, title, group })
  let groupValue = group
    .map(item => {
      return `('${id}','${item}')`
    })
    .reduce((a, b) => a + ',' + b)
  db
    .then(pool =>
      pool
        .request()
        .input('title', sql.NVarChar(500), title)
        .output('message', sql.NVarChar(50), '').query(`
        begin tran
          if exists(select 1 from tb_cowork_project where title = @title and id != '${id}')
          begin
            set @message = '此项目名已存在。'
          end
          else
          begin
            update tb_cowork_project set
            title = @title
            where id = '${id}'
            delete tb_cowork_project_group
            where projectId = '${id}'
            insert into tb_cowork_project_group(projectId,userId)
            values ${groupValue}
          end
        if @@error != 0
        rollback tran
        commit tran
    `)
    )
    .then(data => {
      const result = Object.assign({}, data, {
        id,
        title,
        group,
      })
      res.send(result)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ errors: err.toString() })
    })
})

//delete project
router.put('/:id', (req, res) => {
  const { id } = req.params
  const { toDelete } = req.body
  console.log(id, toDelete)
  const deleteProject = toDelete
    ? `update tb_cowork_project set deleted = 1 where id = '${id}'`
    : ''
  query(
    `
      begin tran
      ${deleteProject}
      if @@error != 0
      rollback tran
      commit tran
    `,
    res
  )
})

module.exports = router
