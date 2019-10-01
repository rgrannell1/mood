
import express from 'express'
import * as path from 'path'

const app = express()
const port = 3000

const command = {
  name: 'serve-public',
  dependencies: []
}

command.cli = `
Usage:
  script serve-public
Description:
  serve public
`

const fpath = path.resolve('public')

app.use(function (req, res, next) {
  console.log(`${req.method} ${req.url}`)
  next()
})

app.use(express.static(fpath))

command.task = () => {
  app.listen(port, () => {
    console.log(`listening on port ${port}`)
  })
}

export default command
