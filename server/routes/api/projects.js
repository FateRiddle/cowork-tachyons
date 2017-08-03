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
          group: groups
            .filter(group => group.projectId === project.id)
            .map(group => group.userId)
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
  query(
    `
      begin tran
        insert into tb_cowork_project (id,title,deleted)
        values('${id}','${title}',0)
        insert into tb_cowork_project_group (projectId,userId)
        values ${groupValue}
      if @@error != 0
      rollback tran
      commit tran
    `,
    res
  )
})

//edit project
router.put('/', (req, res, next) => {
  const { id, title, group } = req.body
  let groupValue = group
    .map(item => {
      return `('${id}','${item}')`
    })
    .reduce((a, b) => a + ',' + b)
  query(
    `
      begin tran
        update tb_cowork_project set
        title = '${title}'
        where id = '${id}'
        delete tb_cowork_project_group
        where projectId = '${id}'
        insert into tb_cowork_project_group(projectId,userId)
        values ${groupValue}
      if @@error != 0
      rollback tran
      commit tran
    `,
    res
  )
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
