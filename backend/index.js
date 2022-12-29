"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_ws_1 = __importDefault(require("express-ws"));
const app = (0, express_1.default)();
(0, express_ws_1.default)(app);
app.get('/', function (req, res, next) {
    console.log('get route', req.body);
    res.send("asfdsf");
});
// @ts-ignore
app.ws('/', function (ws, req) {
    ws.on('message', function (msg) {
        console.log(msg);
    });
    console.log('socket', req.body);
});
app.listen(3000);
