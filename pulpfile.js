const pulp = require('@rgrannell/pulp')
const commands = require('./build/commands')
const tools = require('./tools')

const tasks = pulp.tasks()

tasks.addAll(commands)
tasks.addAll(tools)
tasks.run().catch(err => {
  console.log(err)
  process.exit(1)
})
