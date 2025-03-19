import { Router } from "express"
import multer from 'multer'
import { extractTextFromImage, parseAadhaarDetails } from "./extract";
import { Request, Response } from 'express'
import { ExtractController } from "./extract.controller";
const upload = multer({ storage: multer.memoryStorage() });

const extractRouter = Router()

extractRouter.post("/api/ocr", upload.array("image", 2), ExtractController);
export default extractRouter