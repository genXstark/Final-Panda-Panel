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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var vite_1 = require("vite");
var firebase_admin_1 = __importDefault(require("firebase-admin"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var path_1 = __importDefault(require("path"));
var dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
var _dirname = typeof __dirname !== 'undefined' ? __dirname : process.cwd();
// Initialize Firebase Admin safely
var db = null;
try {
    if (!firebase_admin_1.default.apps.length) {
        // If we have VITE_FIREBASE_PROJECT_ID, we can try to initialize with it
        // but usually firebase-admin needs a service account or ADC.
        // We'll try default initialization first.
        firebase_admin_1.default.initializeApp();
    }
    db = firebase_admin_1.default.firestore();
}
catch (error) {
    console.error("Firebase Admin initialization failed:", error);
}
function startServer() {
    return __awaiter(this, void 0, void 0, function () {
        // Helper to get API settings
        function getApiSettings() {
            return __awaiter(this, void 0, void 0, function () {
                var configDoc, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!db)
                                return [2 /*return*/, null];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, db.collection('config').doc('apiSettings').get()];
                        case 2:
                            configDoc = _a.sent();
                            if (!configDoc.exists) {
                                return [2 /*return*/, {
                                        panelBaseUrl: 'https://activationpanel.net/api/api.php',
                                        apiKey: '',
                                        panelUsername: '',
                                        panelPassword: ''
                                    }];
                            }
                            return [2 /*return*/, configDoc.data()];
                        case 3:
                            e_1 = _a.sent();
                            console.error("Error fetching API settings:", e_1);
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
        var app, PORT, vite;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app = (0, express_1.default)();
                    app.use(express_1.default.json());
                    PORT = process.env.PORT || 3000;
                    // API routes
                    app.post("/api/provision", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, type, identifier, sub, pack, resellerUid, settings, params, response, data, error_1;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 4, , 5]);
                                    _a = req.body, type = _a.type, identifier = _a.identifier, sub = _a.sub, pack = _a.pack, resellerUid = _a.resellerUid;
                                    return [4 /*yield*/, getApiSettings()];
                                case 1:
                                    settings = _b.sent();
                                    if (!(settings === null || settings === void 0 ? void 0 : settings.apiKey))
                                        throw new Error("API Key not configured or Firebase error");
                                    params = new URLSearchParams({
                                        action: type === 'mag' ? 'add_mag' : 'add_m3u',
                                        api_key: settings.apiKey,
                                        username: settings.panelUsername,
                                        password: settings.panelPassword,
                                        mac: type === 'mag' ? identifier : '',
                                        m3u_username: type === 'm3u' ? identifier : '',
                                        package: pack,
                                        duration: sub
                                    });
                                    return [4 /*yield*/, (0, node_fetch_1.default)("".concat(settings.panelBaseUrl, "?").concat(params.toString()), { method: 'POST' })];
                                case 2:
                                    response = _b.sent();
                                    return [4 /*yield*/, response.json()];
                                case 3:
                                    data = _b.sent();
                                    res.json(data);
                                    return [3 /*break*/, 5];
                                case 4:
                                    error_1 = _b.sent();
                                    res.status(500).json({ status: "false", message: error_1.message });
                                    return [3 /*break*/, 5];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post("/api/renew", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, type, identifier, sub, resellerUid, settings, params, response, data, error_2;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 4, , 5]);
                                    _a = req.body, type = _a.type, identifier = _a.identifier, sub = _a.sub, resellerUid = _a.resellerUid;
                                    return [4 /*yield*/, getApiSettings()];
                                case 1:
                                    settings = _b.sent();
                                    if (!(settings === null || settings === void 0 ? void 0 : settings.apiKey))
                                        throw new Error("API Key not configured or Firebase error");
                                    params = new URLSearchParams({
                                        action: 'renew',
                                        api_key: settings.apiKey,
                                        username: settings.panelUsername,
                                        password: settings.panelPassword,
                                        identifier: identifier,
                                        type: type,
                                        duration: sub
                                    });
                                    return [4 /*yield*/, (0, node_fetch_1.default)("".concat(settings.panelBaseUrl, "?").concat(params.toString()), { method: 'POST' })];
                                case 2:
                                    response = _b.sent();
                                    return [4 /*yield*/, response.json()];
                                case 3:
                                    data = _b.sent();
                                    res.json(data);
                                    return [3 /*break*/, 5];
                                case 4:
                                    error_2 = _b.sent();
                                    res.status(500).json({ status: "false", message: error_2.message });
                                    return [3 /*break*/, 5];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post("/api/packages", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var settings, params, response, data, error_3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 4, , 5]);
                                    return [4 /*yield*/, getApiSettings()];
                                case 1:
                                    settings = _a.sent();
                                    if (!(settings === null || settings === void 0 ? void 0 : settings.apiKey))
                                        throw new Error("API Key not configured or Firebase error");
                                    params = new URLSearchParams({
                                        action: 'get_packages',
                                        api_key: settings.apiKey,
                                        username: settings.panelUsername,
                                        password: settings.panelPassword
                                    });
                                    return [4 /*yield*/, (0, node_fetch_1.default)("".concat(settings.panelBaseUrl, "?").concat(params.toString()), { method: 'POST' })];
                                case 2:
                                    response = _a.sent();
                                    return [4 /*yield*/, response.json()];
                                case 3:
                                    data = _a.sent();
                                    res.json(data);
                                    return [3 /*break*/, 5];
                                case 4:
                                    error_3 = _a.sent();
                                    res.status(500).json({ status: "false", message: error_3.message });
                                    return [3 /*break*/, 5];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post("/api/reseller-info", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var settings, params, response, data, error_4;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 4, , 5]);
                                    return [4 /*yield*/, getApiSettings()];
                                case 1:
                                    settings = _a.sent();
                                    if (!(settings === null || settings === void 0 ? void 0 : settings.apiKey))
                                        throw new Error("API Key not configured or Firebase error");
                                    params = new URLSearchParams({
                                        action: 'get_reseller_info',
                                        api_key: settings.apiKey,
                                        username: settings.panelUsername,
                                        password: settings.panelPassword
                                    });
                                    return [4 /*yield*/, (0, node_fetch_1.default)("".concat(settings.panelBaseUrl, "?").concat(params.toString()), { method: 'POST' })];
                                case 2:
                                    response = _a.sent();
                                    return [4 /*yield*/, response.json()];
                                case 3:
                                    data = _a.sent();
                                    res.json(data);
                                    return [3 /*break*/, 5];
                                case 4:
                                    error_4 = _a.sent();
                                    res.status(500).json({ status: "false", message: error_4.message });
                                    return [3 /*break*/, 5];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); });
                    if (!(process.env.NODE_ENV !== "production")) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, vite_1.createServer)({
                            server: { middlewareMode: true },
                            appType: "spa",
                        })];
                case 1:
                    vite = _a.sent();
                    app.use(vite.middlewares);
                    return [3 /*break*/, 3];
                case 2:
                    app.use(express_1.default.static(path_1.default.join(_dirname, "dist")));
                    app.get("*", function (req, res) {
                        res.sendFile(path_1.default.join(_dirname, "dist", "index.html"));
                    });
                    _a.label = 3;
                case 3:
                    app.listen(PORT, function () {
                        console.log("Server running on port ".concat(PORT));
                    });
                    return [2 /*return*/];
            }
        });
    });
}
startServer().catch(function (err) {
    console.error("Failed to start server:", err);
});
