"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var admin = require("firebase-admin");
var config_1 = require("./config");
var log_1 = require("./log");
admin.initializeApp({
    credential: admin.credential.cert(config_1["default"].google.privateKey),
    databaseURL: config_1["default"].google.db
});
var db = admin.firestore();
var getEmptyProfile = function (userId, ctx) {
    return {
        userId: userId,
        ips: [
            ctx.ip || 'unknown'
        ],
        forwardedFor: [
            ctx.forwardedFor || 'unknown'
        ],
        trackingId: [
            ctx.trackingId
        ]
    };
};
var unique = function (arr0, arr1) {
    return Array.from(new Set(__spreadArrays(arr0, arr1)));
};
var firebase = {};
/**
 * Save information about a user to the database, including
 * anonymised tracking information for security reasons.
 *
 * @param {string} userId the user-id
 * @param {object} ctx request metadata
 *
 * @returns {Promise<*>}
 */
exports.createUser = function (userId, ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var ref, doc, existing;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ref = db.collection('users').doc(userId);
                return [4 /*yield*/, ref.get()];
            case 1:
                doc = _a.sent();
                if (!!doc.exists) return [3 /*break*/, 3];
                log_1["default"].debug(ctx, "storing information for new user " + userId);
                return [4 /*yield*/, ref.set(getEmptyProfile(userId, ctx))];
            case 2:
                _a.sent();
                return [3 /*break*/, 5];
            case 3:
                log_1["default"].debug(ctx, "user " + userId + " already exists");
                existing = doc.data();
                return [4 /*yield*/, ref.update({
                        userId: userId,
                        ips: unique(existing.ips, [ctx.ip || 'unknown']),
                        forwardedFor: unique(existing.forwardedFor, [ctx.forwardedFor || 'unknown']),
                        trackingId: unique(existing.trackingId, [ctx.trackingId])
                    })];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.saveMoods = function (userId, ctx, moods) { return __awaiter(void 0, void 0, void 0, function () {
    var ref, doc, existing, updated;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ref = db.collection('users').doc(userId);
                return [4 /*yield*/, ref.get()];
            case 1:
                doc = _a.sent();
                if (!doc.exists) {
                    log_1["default"].error(ctx, "profile missing for user " + userId);
                    process.exit(1);
                }
                existing = doc.data();
                updated = __assign({}, existing);
                updated.moods = updated.moods
                    ? updated.moods.concat(moods)
                    : moods;
                log_1["default"].debug(ctx, "adding moods for user " + userId);
                return [4 /*yield*/, db.collection('users').doc(userId).update(updated)];
            case 2:
                _a.sent();
                log_1["default"].success(ctx, "moods successfully added for user " + userId);
                return [2 /*return*/];
        }
    });
}); };
exports.getMoods = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var ref, doc, userData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ref = db.collection('users').doc(userId);
                return [4 /*yield*/, ref.get()];
            case 1:
                doc = _a.sent();
                if (!doc.exists) {
                    return [2 /*return*/, []];
                }
                userData = doc.data();
                return [2 /*return*/, userData.moods];
        }
    });
}); };
