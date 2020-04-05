
import * as fs from 'fs'
import * as path from 'path'
import cp from 'child_process'
import chalk from 'chalk'
import getFolderSize from 'get-folder-size'
const fsp = fs.promises

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

const dirStats = async fpath => {
  const stats = []
  const files = await fsp.readdir(fpath)

  const state = {
    totalSize: 0
  }

  for (const subpath of files) {
    const fullPath = path.join(fpath, subpath)
    const stat = await fsp.stat(fullPath)

    let size = stat.size

    if (stat.isFile()) {
      size = await new Promise((resolve, reject) => {
        getFolderSize(fullPath, (err, size) => {
          if (err) {
            reject(err)
          }

          resolve(size)
        })
      })
    }

    state.totalSize += size || 0

    stats.push({
      fpath: fullPath,
      size: stat.size,
      isFile: stat.isFile(),
      contents: stat.isFile() ? null : await dirStats(fullPath)
    })
  }

  stats.sort((entry0, entry1) => {
    return entry0.size - entry1.size
  })

  return stats.map(stat => {
    return {
      ...stat,
      sizeRatio: stat.size / state.totalSize,
      folderSize: state.totalSize
    }
  })
}

const reportAnalysis = data => {
  let message = ''

  for (const entry of data) {
    let folderSummary = ''

    folderSummary = entry.fpath.padEnd(40)
    folderSummary += 100 * (Math.round(entry.sizeRatio * 100) / 100)
    folderSummary += '%'

    message += `${folderSummary}\n`
  }

  return message + '\n'
}

command.task = async args => {
  const nodeEnv = process.env.NODE_ENV
  if (nodeEnv !== 'production') {
    throw new Error(`wrong environment ${nodeEnv}`)
  }

  const start = Date.now()
  const now = cp.spawn('./node_modules/.bin/now')

  const report = reportAnalysis(await dirStats('public'))
  console.log(chalk.blue(report))

  now.stderr.on('data', data => {
    console.error(data.toString())
  })
  now.stdout.on('data', data => {
    console.log(data.toString())
  })

  now.on('close', code => {
    if (code !== 0) {
      throw new Error(`spawn exited with status ${code}`)
    }

    const end = Date.now()

    const elapsed = Math.round((end - start) / 1000)

    console.log(chalk.green(`Deployment suceeded in ${elapsed} seconds!`))

    console.log(`Run "npm run monitoring:prod" to validate the deployment.\n`)
  })
}

export default command
