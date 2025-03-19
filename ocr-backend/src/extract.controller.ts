import { extractTextFromImage, parseAadhaarDetails } from "./extract";
import HttpStatus from "./httpStatus";
import { Request, Response } from "express";

export const ExtractController = async (req: Request, res: Response) => {
    if (!req.files || !Array.isArray(req.files) || req.files.length < 2) {
        return res.status(HttpStatus.BAD_REQUEST).json({ error: "Two images (front and back) are required" });
    }

    try {
        const [frontImage, backImage] = req.files as Express.Multer.File[];

        // Validate MIME types
        const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
        if (!allowedMimeTypes.includes(frontImage.mimetype) || !allowedMimeTypes.includes(backImage.mimetype)) {
            return res.status(HttpStatus.BAD_REQUEST).json({ error: "Only image files (PNG, JPG, JPEG, WEBP) are allowed" });
        }

        const frontText = await extractTextFromImage(frontImage.buffer);
        const backText = await extractTextFromImage(backImage.buffer);
        console.log(frontText, backText);

        const details = await parseAadhaarDetails(frontText + backText);
        if (details) {
            res.status(HttpStatus.OK).json(details);
        } else {
            res.status(HttpStatus.BAD_REQUEST).json({ error: "Invalid image, please try again" });
        }
    } catch (error) {
        console.error("Error processing images:", error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Error processing images" });
    }
};
