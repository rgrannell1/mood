
import * as path from 'path'

export default {
  paths: {
    root: path.resolve('../..')
  },
  sizes: {
    trackingId: 16
  },
  limits: {
    moodsLength: 50
  },
  security: {
    initVectorSize: 16,
    encryptAlgorithm: 'aes-256-ctr'
  }
}
