
const methods = {}

methods.GET = async (req, res) => {
  // -- fetch. defer to other file
}

methods.PATCH = async (req, res) => {
  // -- save moods. defer to other file
}

methods.NOT_SUPPORTED = async (req, res) => {
  const body = JSON.stringify({
    message: 'supplied method not supported'
  }, null, 2)
  res.statusCode = 405
  res.end(body)
}

export default async (req, res) => {
  if (req.method === 'GET') {
    await methods.GET(req, res)
  } else if (req.method === 'PATCH') {
    await methods.PATCH(req, res)
  } else {
    await methods.NOT_SUPPORTED(req, res)
  }
}
