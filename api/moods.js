'use strict'
exports.__esModule = true
var routes_js_1 = require('./routes/shared/routes.js')
var get_moods_1 = require('./routes/get-moods')
var patch_moods_1 = require('./routes/patch-moods')
var methods = new Map()
methods.set('GET', get_moods_1.default)
methods.set('PATCH', patch_moods_1.default)
var moods = routes_js_1.routeMethod(methods)
exports.default = moods
