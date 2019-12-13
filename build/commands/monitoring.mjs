
const command = {
  name: 'monitoring',
  dependencies: []
}

command.cli = `
Usage:
  script monitoring
Description:
  run mood synthetic-monitoring
`

command.task = async () => {
  await import('../../monitoring/src/index')
}

export default command
