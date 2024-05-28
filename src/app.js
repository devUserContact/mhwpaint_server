var express = require('express')
var cors = require('cors')
var db = require('./db.js')

const app = express()

var corsOptions = {
  origin: 'https://mhwpaint.com',
  optionsSuccessStatus: 200,
}

app.get('/', cors(corsOptions), (req, res) => res.send('test'))

app.get('/mhwpaint/gallery', cors(corsOptions), async function (req, res) {
  let gallery = await db.queryGallery()
  res.send(gallery)
})

app.get('/mhwpaint/gallery/:id', cors(corsOptions), async function (req, res) {
  let work = await db.queryWork(req.params.id)
  res.send(work)
})

app.listen(3000, () => console.log('Server ready'))
