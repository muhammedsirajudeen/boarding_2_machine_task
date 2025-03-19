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
const generative_ai_1 = require("@google/generative-ai");
function extractTextFromImage(buffer) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data: { text } } = yield tesseract_js_1.default.recognize(buffer, "eng");
        return text;
    });
}
function extractJSON(str) {
    const match = str.match(new RegExp('{.*}', 's')); // Matches JSON-like object
    if (match) {
        try {
            return JSON.parse(match[0]);
        }
        catch (e) {
            console.error("Invalid JSON:", e);
        }
    }
    return null;
}
function parseAadhaarDetails(text) {
    return __awaiter(this, void 0, void 0, function* () {
        const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `${text} From this extract the adhar details for me the address phone number adhar number and all relevant details give response as json and not anything else
  otherwise you would be terminated dont give anything else just the json string nothing else otherwise add error message as well if you get some kind of details give that
  dont confuse adhar number with phone number 12 digit number is adhar number 
  {
   "error": "Insufficient information. The provided text contains parts of an Aadhaar card, but crucial details like the Aadhaar number are either redacted or illegible.  The address and phone number are partially visible but incomplete.",
   "name": "name",
   "father_name": "name",
   "year_of_birth": year,
   "gender": "Gender",
   "address": "address",
   "phone_number":"phone_number (if you give 12 digit number you would be killed if its 12 give unknown as number )",
   "aadhaar_number": "0000 0000 0000 (this would be adhar number format it would be kind of this format)"  }
  `;
        const aadhaar_number_regex = new RegExp('\d{4} \d{4} \d{4}');
        const aadhaar_number = text.match(aadhaar_number_regex);
        console.log(aadhaar_number);
        const result = yield model.generateContent(prompt);
        console.log(result.response.text());
        const resultJson = extractJSON(result.response.text());
        return resultJson;
    });
}
