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
        `select * from tb_cowork_project
      select * from tb_cowork_project_group`
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
        insert into tb_cowork_project (id,title)
        values('${id}','${title}')
        insert into tb_cowork_project_group (projectId,userId)
        values ${groupValue}
      if @@error != 0
      rollback tran
      commit tran
    `,
    res
  )
})

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

router.delete('/:id', (req, res) => {
  const { id } = req.params
  query(
    `
      begin tran
        delete from tb_cowork_project where id = '${id}'
        delete from tb_cowork_project_group where projectId = '${id}'
      if @@error != 0
      rollback tran
      commit tran
    `,
    res
  )
})

module.exports = router
