
/**
 * Ensure required variables are present
 *
 * @param {Array<string>} names an array of variable names
 */
const expectVariables = (names: string[]): void => {
  for (const name of names) {
    const val = process.env[name]
    if (!val) {
      throw new Error(`environmental variable ${name} was missing.`)
    }

    if (val.startsWith('"') || val.startsWith("'")) {
      throw new Error(`environmental variable ${name} started with a quote`)
    }
  }
}

expectVariables([
  'GOOGLE_CLIENT_ID',
  'GOOGLE_PRIVATE_KEY'
])

const parseGooglePrivateKey = (content:string):object => {
  const decoded = Buffer.from(content, 'base64')
  return JSON.parse((decoded as any))
}

export default {
  google: {
    db: 'https://mood-251413.firebaseio.com',
    clientId: process.env.GOOGLE_CLIENT_ID,
    audience: '1053339394516-8m3pa0tvsejqha2usv84rkul7ja804s6.apps.googleusercontent.com',
    privateKey: parseGooglePrivateKey(process.env.GOOGLE_PRIVATE_KEY)
  }
}
