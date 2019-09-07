'use strict'
exports.__esModule = true
var nanoid_1 = require('nanoid')
var crypto = require('crypto')
var constants_1 = require('./constants')
/**
 * Create a request-tracking id, to uniquely identify a function
 *
 * @returns {string} an id
 */
exports.trackingId = function () {
  return nanoid_1.default(constants_1.default.sizes.trackingId)
}
/**
 *  Hash a value
 *
 * @param {string} string an arbitrary string
 */
exports.hash = function (string) {
  return crypto.createHash('sha512').update(string).digest('base64')
}
