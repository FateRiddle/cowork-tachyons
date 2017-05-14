const router = require('express').Router()
const { sql,db } = require('../../db')

router.get('/', (req, res, next) => {
  db.then(()=>{
    new sql.Request().query('select * from tb_cowork_user').then(data => {
        res.send(data)
    }).catch(err => {
      console.error(err)
    })
  }).catch(err => console.log(err))
})

module.exports = router
