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
exports.extractTextFromImage = extractTextFromImage;
exports.parseAadhaarDetails = parseAadhaarDetails;
const tesseract_js_1 = __importDefault(require("tesseract.js"));
function extractTextFromImage(buffer) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data: { text } } = yield tesseract_js_1.default.recognize(buffer, "eng");
        return text;
    });
}
function parseAadhaarDetails(text) {
    var _a, _b, _c;
    const aadhaarRegex = /\b\d{4} \d{4} \d{4}\b/;
    const dobRegex = /DOB[:\s]*([\d\/-]+)/i;
    const nameRegex = /(?<=Name[:\s])([A-Za-z\s]+)/i;
    const aadhaar = ((_a = text.match(aadhaarRegex)) === null || _a === void 0 ? void 0 : _a[0]) || "Not found";
    const dob = ((_b = text.match(dobRegex)) === null || _b === void 0 ? void 0 : _b[1]) || "Not found";
    const name = ((_c = text.match(nameRegex)) === null || _c === void 0 ? void 0 : _c[0]) || "Not found";
    return { aadhaar, dob, name };
}
