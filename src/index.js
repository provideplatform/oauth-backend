const express = require('express')
const app = express()
const port = 3000

app.get('/oauth/authorize', (req, res) => {
  res.redirect(302, 'http://localhost:8090/oauth/authorize?:')
})

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})

