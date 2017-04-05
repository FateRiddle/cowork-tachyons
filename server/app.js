// server/app.js
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();

const sql = require('mssql');

const db = sql.connect("mssql://youcb:DJit9379@youcaibao.sqlserver.rds.aliyuncs.com:3433/youcb_dev")

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.get('/user', (req, res) => {
  db.then(()=>{
    new sql.Request().query('select * from tb_huodong order by createdAt desc').then(data => {
        res.send(data)
    }).catch(err => {
      console.error(err)
    });
  }).catch(err => console.log(err))
});


// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {

  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

module.exports = app;
