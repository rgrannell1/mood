'use strict'
exports.__esModule = true
var signale_1 = require('signale')
var attachContext = function (ctx, message) {
  return message
}
var logger = function (level, ctx, message) {
  signale_1.default[level](attachContext(ctx, message))
}
var log = {
  success: logger.bind(null, 'success'),
  debug: logger.bind(null, 'debug'),
  error: logger.bind(null, 'error'),
  warn: logger.bind(null, 'warn')
}
exports.default = log
