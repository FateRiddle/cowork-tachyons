const router = require('express').Router()
const { sql, db } = require('../../db')

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
  query(
    `
      select * from tb_cowork_user
    `,
    res
  )
})

module.exports = router
