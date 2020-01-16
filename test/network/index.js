const Mock = require('mockjs')
const express = require('express')
const app = express()
const port = 5000

app.get('/', (req, res) => {
  setTimeout(() => {
    res.send('Hello World!')
  }, 500)
})

app.get('/large', (req, res) => {
  setTimeout(() => {
    res.send(Mock.Random.cparagraph(4000, 4000));
  }, 500)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
