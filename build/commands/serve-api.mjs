
import api from '../shared/api.mjs'

const port = 3001

const command = {
  name: 'serve-api',
  dependencies: []
}

command.cli = `
Usage:
  script serve-api

Description:
  serve mood's API
`

command.task = () => {
  api.listen(port, () => {
    console.log(`listening on port ${port}`)
  })
}

export default command
