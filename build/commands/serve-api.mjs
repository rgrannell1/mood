
import express from 'express'
import metadata from '../../api/metadata.mjs'
import moods from '../../api/moods.mjs'
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express()
const port = 3001

app.use(cors({
  origin: 'http://localhost:3000'
}))

app.use(bodyParser.text())

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
    console.log(`listening on port ${port}`)
  })
}

export default command
