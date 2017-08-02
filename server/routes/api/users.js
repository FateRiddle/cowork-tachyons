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
  query(
    `
      select id,name from tb_cowork_user
    `,
    res
  )
})

router.put('/:id', (req, res, next) => {
  const { id } = req.params
  const { name, oldPass, newPass } = req.body
  const updateName = name
    ? `update tb_cowork_user set name=@name where id='${id}'`
    : ''
  const updatePassword = oldPass && newPass
    ? `
    begin tran
      if exists (select 1 from tb_cowork_user where id='${id}' and password=@oldPass)
      update tb_cowork_user set password=@newPass where id='${id}'
      else
      set @message = '原密码错误。请重试。'
    if @@error != 0
    rollback tran
    commit tran
    `
    : ''

  db
    .then(pool =>
      pool
        .request()
        .input('name', sql.NVarChar(50), name)
        .input('oldPass', sql.NVarChar(50), oldPass)
        .input('newPass', sql.NVarChar(50), newPass)
        .output('message', sql.NVarChar(50), '')
        .query(
          `${updateName}
          ${updatePassword}`
        )
    )
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).json({ errors: err.toString() })
    })
})

module.exports = router
