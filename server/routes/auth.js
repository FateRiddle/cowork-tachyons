const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { sql, db } = require('../db')
const v4 = require('uuid').v4

const secret = 'djit9379'

router.post('/auth/login', (req, res) => {
  const { name, password } = req.body.user
  if (!name) {
    return res.status(422).json({ errors: '姓名不能为空' })
  }

  if (!password) {
    return res.status(422).json({ errors: '密码不能为空' })
  }

  db
    .then(pool =>
      pool
        .request()
        .output('id', sql.VarChar(50), '0')
        .output('message', sql.NVarChar(50), '用户名或密码错误').query(`
      if exists(select 1 from tb_cowork_user where name='${name}' and password='${password}')
      begin
        select @id = id from tb_cowork_user where name='${name}' and password='${password}'
        set @message = '登陆成功'
      end
    `)
    )
    .then(data => {
      const { id, message } = data.output
      if (id === '0') {
        res.status(422).json({ errors: message })
      } else {
        const profile = {
          data: {
            name,
            password,
            id
          },
          exp: Math.floor(Date.now() / 1000) + 10 * 60 * 60 //10小时expiration
        }
        const token = jwt.sign(profile, secret)
        res.json({ token, id, name })
      }
    })
    .catch(err => {
      res.status(500).json({ errors: err.toString() })
    })
})
//signup: (name, password, password2, slogan) => ax.post('/auth', { user: { name, password, password2 }, slogan }),

router.post('/auth', (req, res, next) => {
  const { user: { name, password, password2 }, slogan } = req.body
  if (!name) {
    return res.status(422).json({ errors: '姓名不能为空' })
  }

  if (!password || !password2) {
    return res.status(422).json({ errors: '密码不能为空' })
  }

  if (password !== password2) {
    return res.status(422).json({ errors: '两次输入密码不一致' })
  }

  if (slogan !== '永远领先一步') {
    return res.status(422).json({ errors: '口号不正确' })
  }

  console.log(
    `
      if exists(select 1 from tb_cowork_user where name='${name}')
      begin
        set flag = '1'
        set message = '此用户名已被注册'
        return
      end
      insert into tb_cowork_user (id,name,password) values ('${v4()}','${name}','${password}')
    `
  )
  db
    .then(pool =>
      pool
        .request()
        .output('flag', sql.VarChar(50), '0')
        .output('message', sql.NVarChar(50), '注册成功！请登录').query(`
      if exists(select 1 from tb_cowork_user where name='${name}')
      begin
        set @flag = '1'
        set @message = '此用户名已被注册'
        return
      end
      insert into tb_cowork_user (id,name,password) values ('${v4()}','${name}','${password}')
    `)
    )
    .then(data => {
      const { flag, message } = data.output
      console.log(flag, message)
      if (flag === '1') {
        res.status(422).json({ errors: message })
      } else {
        res.json({ message })
      }
    })
    .catch(err => {
      res.status(500).json({ errors: err.toString() })
    })
})

module.exports = router
