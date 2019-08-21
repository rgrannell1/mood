
export default async (_, res) => {
  const body = JSON.stringify({

  }, null, 2)
  res.end(body)
}
