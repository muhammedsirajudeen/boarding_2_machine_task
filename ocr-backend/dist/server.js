"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const extract_routes_1 = __importDefault(require("./extract.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
(0, dotenv_1.configDotenv)();
app.use("/", extract_routes_1.default);
app.listen(process.env.PORT || 4000, () => console.log("Server running on port 4000"));
