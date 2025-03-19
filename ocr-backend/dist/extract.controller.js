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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtractController = void 0;
const extract_1 = require("./extract");
const httpStatus_1 = __importDefault(require("./httpStatus"));
const ExtractController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files || !Array.isArray(req.files) || req.files.length < 2) {
        res.status(httpStatus_1.default.BAD_REQUEST).json({ error: "Two images (front and back) are required" });
        return;
    }
    try {
        const [frontImage, backImage] = req.files;
        // Validate MIME types
        const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
        if (!allowedMimeTypes.includes(frontImage.mimetype) || !allowedMimeTypes.includes(backImage.mimetype)) {
            res.status(httpStatus_1.default.BAD_REQUEST).json({ error: "Only image files (PNG, JPG, JPEG, WEBP) are allowed" });
            return;
        }
        const frontText = yield (0, extract_1.extractTextFromImage)(frontImage.buffer);
        const backText = yield (0, extract_1.extractTextFromImage)(backImage.buffer);
        console.log(frontText, backText);
        const details = yield (0, extract_1.parseAadhaarDetails)(frontText + backText);
        if (details) {
            res.status(httpStatus_1.default.OK).json(details);
        }
        else {
            res.status(httpStatus_1.default.BAD_REQUEST).json({ error: "Invalid image, please try again" });
        }
    }
    catch (error) {
        console.error("Error processing images:", error);
        res.status(httpStatus_1.default.INTERNAL_SERVER_ERROR).json({ error: "Error processing images" });
    }
});
exports.ExtractController = ExtractController;
