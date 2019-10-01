
import express from 'express'
import metadata from '../../api/metadata.mjs'
import moods from '../../api/moods.mjs'

const app = express()
const port = 3000

app.use('/api/metadata', (req, res) => {
  metadata(req, res)
})

app.use('/api/moods', (req, res) => {
  moods(req, res)
})

const command = {
  name: 'serve-api',
  dependencies: []
}

command.cli = `
Usage:
  script serve-api
Description:
  serve api
`

command.task = () => {
  app.listen(port, () => {

  })
}

export default command
