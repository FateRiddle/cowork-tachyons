const router = require('express').Router()
const { sql,db } = require('../../db')

router.get('/', (req, res, next) => {
  db.then(()=>{
    new sql.Request().query(
      'select * from tb_cowork_project; select * from tb_cowork_project_group'
    ).then(data => {
        //将group内容并入project
        const projects = data.recordsets[0]
        const groups = data.recordsets[1]
        data.recordset = projects.map(project => {
          return Object.assign({},project,
            {
              group:groups.filter(group => group.projectId === project.id)
              .map(group => group.userId)
            }
          )
        })
        res.send(data)
    }).catch(err => {
      console.error(err)
    })
  }).catch(err => console.log(err))
})

module.exports = router
