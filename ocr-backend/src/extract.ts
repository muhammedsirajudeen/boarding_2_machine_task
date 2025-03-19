import Tesseract from "tesseract.js";
import { GoogleGenerativeAI } from "@google/generative-ai"
export async function extractTextFromImage(buffer: Buffer): Promise<string> {
  const { data: { text } } = await Tesseract.recognize(buffer, "eng");
  return text;
}
function extractJSON(str: string) {
  const match = str.match(new RegExp('{.*}', 's')); // Matches JSON-like object
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch (e) {
      console.error("Invalid JSON:", e);
    }
  }
  return null;
}



export async function parseAadhaarDetails(text: string) {

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API!)
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
  const aadhaar_number_regex = new RegExp('\d{4} \d{4} \d{4}')
  const aadhaar_number = text.match(aadhaar_number_regex)
  console.log(aadhaar_number)
  const result = await model.generateContent(prompt);
  console.log(result.response.text());
  const resultJson = extractJSON(result.response.text())
  return resultJson
}


