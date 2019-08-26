
const crypto = require('crypto')

const command = {
  name: 'get-version',
  dependencies: []
}

command.cli = `
Usage:
  script get-version
Description:
  Run tests for each submodule
`

command.task = async args => {
  const id = crypto.randomBytes(20).toString('hex')
}

module.exports = command
