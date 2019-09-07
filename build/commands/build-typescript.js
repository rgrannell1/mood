
const execa = require('execa')

const command = {
  name: 'build-typescript',
  dependencies: []
}

command.cli = `
Usage:
  script build-typescript [--production]
Description:
  Build
`

command.task = async args => {
  const { stdout, stderr } = await execa('npx', ['tsc'])

  console.log(stdout)
  console.log(stderr)
}

module.exports = command
