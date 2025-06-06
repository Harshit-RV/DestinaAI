"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const app = (0, express_1.Router)();
app.get('/', (req, res) => {
    res.send('this is the home page of user routes');
});
exports.default = app;
