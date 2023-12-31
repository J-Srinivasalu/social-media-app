import { NextFunction, Request, Response } from "express";
import multer from "multer";
import ApiError from "../utils/error.util";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/temp");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
  console.log(`filetype: ${file.mimetype}`);
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // file size limit 5 MB
});

export function handleMulterError(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof multer.MulterError) {
    console.log("Mutler error occured");
    next(
      new ApiError(
        400,
        "File too large",
        "The file you are trying to upload exceeds the allowed size limit(5MB). Please choose a smaller file."
      )
    );
  } else if (err) {
    console.log("Someothere error occured");
    console.log(err);
    console.log("problem ended");
    next(new ApiError(404, "Bad Request", "Unsupported file format"));
  } else {
    console.log("File uploaded successfully");
    next();
  }
}
