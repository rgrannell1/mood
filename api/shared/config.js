"use strict";
exports.__esModule = true;
/**
 * Ensure required variables are present
 *
 * @param {Array<string>} names an array of variable names
 */
var expectVariables = function (names) {
    for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
        var name_1 = names_1[_i];
        var val = process.env[name_1];
        if (!val) {
            throw new Error("environmental variable " + name_1 + " was missing.");
        }
        if (val.startsWith('"') || val.startsWith("'")) {
            throw new Error("environmental variable " + name_1 + " started with a quote");
        }
    }
};
expectVariables([
    'GOOGLE_CLIENT_ID',
    'GOOGLE_PRIVATE_KEY'
]);
var parseGooglePrivateKey = function (content) {
    var decoded = Buffer.from(content, 'base64');
    return JSON.parse(decoded);
};
exports["default"] = {
    google: {
        db: 'https://mood-251413.firebaseio.com',
        clientId: process.env.GOOGLE_CLIENT_ID,
        audience: '1053339394516-8m3pa0tvsejqha2usv84rkul7ja804s6.apps.googleusercontent.com',
        privateKey: parseGooglePrivateKey(process.env.GOOGLE_PRIVATE_KEY)
    }
};
