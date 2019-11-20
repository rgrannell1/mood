
import pulp from '@rgrannell/pulp'

import commands from './build/commands/index.mjs'

const tasks = pulp.tasks()

tasks.addAll(commands)
tasks.run().catch(err => {
  console.log(err)
  process.exit(1)
})
