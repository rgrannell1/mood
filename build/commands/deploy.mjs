
import cp from 'child_process'

const command = {
  name: 'deploy',
  dependencies: ['build']
}

command.cli = `
Usage:
  script deploy
Description:
  Deploy to Zeit
`

command.task = async args => {
  const now = cp.spawn('./node_modules/.bin/now')

  now.stdout.on('data', data => {
    console.log(data.toString())
  })
  now.stderr.on('data', data => {
    console.error(data.toString())
  })

  now.on('close', code => {
    if (code !== 0) {
      throw new Error(`spawn exited with status ${code}`)
    }
  })
}

export default command
