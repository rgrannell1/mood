"use strict";
exports.__esModule = true;
var crypto = require("crypto");
/**
 * Create a request-tracking id, to uniquely identify a function
 *
 * @returns {string} an id
 */
exports.trackingId = function () {
    return crypto.randomBytes(16).toString('base64');
};
/**
 *  Hash a value
 *
 * @param {string} string an arbitrary string
 */
exports.hash = function (content) {
    return crypto.createHash('sha512').update(content).digest('base64');
};
