"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var log_1 = require("./log");
var config_1 = require("./config");
var errors_1 = require("@rgrannell/errors");
var google_auth_library_1 = require("google-auth-library");
// check aud is my client id, and iss is accounts.google.com or https version
// if id is verified, dont need to verify
// use sub as user primary key
var client = new google_auth_library_1.OAuth2Client(config_1["default"].google.clientId);
/**
 * Ensure that a user is logged in through Google.
 *
 * @param {string} an ID token supplied by the front-end.
 *
 * @returns {object} data about the user
 */
var verifyToken = function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var token, prefix, header, ticket, _a, sub, aud;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!req.headers.hasOwnProperty('authorization')) {
                    throw errors_1["default"].unauthorized('"authorization" absent from request requiring authentication', 401);
                }
                prefix = 'Bearer';
                header = req.headers.authorization;
                if (header.startsWith(prefix)) {
                    token = header.slice(prefix.length).trim();
                }
                if (!token) {
                    throw errors_1["default"].unauthorized('id_token was not supplied alongside request to server', 401);
                }
                return [4 /*yield*/, client.verifyIdToken({
                        idToken: token,
                        audience: config_1["default"].google.clientId
                    })];
            case 1:
                ticket = _b.sent();
                _a = ticket.getPayload(), sub = _a.sub, aud = _a.aud;
                if (aud !== config_1["default"].google.audience) {
                    throw errors_1["default"].unauthorized('invalid token audience', 401);
                }
                req.state.userId = sub;
                log_1["default"].debug(req.state, 'verified user id_token');
                return [2 /*return*/, {
                        userId: sub
                    }];
        }
    });
}); };
/**
 * throw an error if a user is not successfully logged in
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<*>}
 */
var ensureLoggedIn = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            return [2 /*return*/, verifyToken(req)];
        }
        catch (err) {
            // -- send http errors if couldn't verify login.
            console.error(err);
            throw err;
        }
        return [2 /*return*/];
    });
}); };
exports["default"] = ensureLoggedIn;
