
const shared = {
  methods: new Map()
}

shared.methods.set('NOT_SUPPORTED', async (req, res) => {
  res.statusCode = 405
  res.end('method not supported')
})

shared.routeMethod = methods => (req, res) => {
  if (methods.has(req.method)) {
    methods.get(req.method)(req, res)
  } else {
    await shared.methods.NOT_SUPPORTED(req, res)
  }
}

module.exports = shared
