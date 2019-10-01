
import pulp from '@rgrannell/pulp'

import commands from './build/commands/index.mjs'
import tools from './tools/index.mjs'

const tasks = pulp.tasks()

tasks.addAll(commands)
tasks.addAll(tools)
tasks.run().catch(err => {
  console.log(err)
  process.exit(1)
})
