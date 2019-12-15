
import express from 'express'
import metadata from '../../api/metadata.js'
import moods from '../../api/moods.js'
import login from '../../api/login.js'
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express()

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

app.use('/api/login', (req, res) => {
  login(req, res)
})

export default app
