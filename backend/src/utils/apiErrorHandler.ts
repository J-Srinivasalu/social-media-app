import { Response } from "express";
import ApiError from "./error.util";

export default function handleApiError(res: Response, error: unknown) {
  console.log(error);
  const apiError = error as ApiError;
  res.status(apiError.statusCode).json({
    success: apiError.success,
    error: apiError.error,
    message: apiError.message,
  });
}
