"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const extract_controller_1 = require("./extract.controller");
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const extractRouter = (0, express_1.Router)();
extractRouter.post("/api/ocr", upload.array("image", 2), extract_controller_1.ExtractController);
exports.default = extractRouter;
