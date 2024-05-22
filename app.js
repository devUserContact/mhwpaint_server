const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('this is an action test'))
app.listen(3000, '127.0.0.1', () => console.log('Server ready'))
