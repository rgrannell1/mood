'use strict'
exports.__esModule = true
var routes_1 = require('./routes/shared/routes')
var get_metadata_1 = require('./routes/get-metadata')
var methods = new Map()
methods.set('GET', get_metadata_1.default)
var metadata = routes_1.routeMethod(methods)
exports.default = metadata
