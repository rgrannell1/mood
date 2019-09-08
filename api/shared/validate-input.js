"use strict";
exports.__esModule = true;
var errors_1 = require("@rgrannell/errors");
var constants_1 = require("./constants");
exports.mood = function (event, ith) {
    for (var _i = 0, _a = ['type', 'mood', 'timestamp']; _i < _a.length; _i++) {
        var prop = _a[_i];
        if (!event.hasOwnProperty(prop)) {
            throw errors_1["default"].unprocessableEntity(ith + "th event was missing property \"" + prop + "\"", 422);
        }
    }
    if (event.type !== 'send-mood') {
        throw errors_1["default"].unprocessableEntity(ith + "th event type was \"" + event.type + "\"", 422);
    }
};
exports.body = function (userId, content) {
    if (!content.hasOwnProperty('events')) {
        throw errors_1["default"].unprocessableEntity('request body was missing field "events"', 422);
    }
    if (!Array.isArray(content.events)) {
        throw errors_1["default"].unprocessableEntity('request body "events" property was not an array', 422);
    }
    if (content.events.length > constants_1["default"].limits.moodsLength) {
        throw errors_1["default"].requestEntityTooLarge('too many events sent to server in one batch', 413);
    }
    content.events.forEach(function (event, ith) {
        exports.mood(event, ith);
    });
    return content;
};
