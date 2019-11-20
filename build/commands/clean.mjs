
import rimraf from 'rimraf'

const command = {
  name: 'clean',
  dependencies: []
}

command.cli = `
Usage:
  script clean
Description:
  clean public folder
`

command.task = async () => {
  try {
    await new Promise((resolve, reject) => {
      rimraf('public', function () {
        resolve()
      })
    })
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err
    }
  }
}

export default command
