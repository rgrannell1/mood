
import express from 'express'

const app = express()
const port = 3000

const command = {
  name: 'serve-api',
  dependencies: []
}

command.cli = `
Usage:
  script serve-public
Description:
  serve public
`

app.use(express.static('public'))

command.task = () => {
  app.listen(port, () => {
    console.log(`listening on port ${port}`)
  })
}

export default command
