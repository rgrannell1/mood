
import express from 'express'
import metadata from '../../api/metadata.mjs'
import moods from '../../api/moods.mjs'
import login from '../../api/login.mjs'
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express()

app.use(cors({
  origin: true
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
