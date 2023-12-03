import { Request, Response } from "express";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { loginUser, registerUser } from "../services/user.service";
import { ApiResponse } from "../models/apiResponse.model";
import ApiError from "../utils/error.util";
import handleApiError from "../utils/apiErrorHandler";

const registerSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  username: z
    .string()
    .min(3)
    .refine(
      (username) => {
        const isValidUsername = /^\w+$/.test(username);
        return isValidUsername;
      },
      {
        message:
          "Username must contain only letters, numbers, and underscores.",
      }
    ),
  password: z
    .string()
    .min(8)
    .max(20)
    .refine(
      (password) => {
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasDigit = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(password);

        return hasUppercase && hasLowercase && hasDigit && hasSpecialChar;
      },
      {
        message:
          "Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character.",
      }
    ),
});

const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export async function registerController(req: Request, res: Response) {
  try {
    const parsedRequest = registerSchema.safeParse(req.body);
    if (!parsedRequest.success) {
      const errorMessage = fromZodError(parsedRequest.error).message.replace(
        /"/g,
        "'"
      );
      throw new ApiError(400, "Bad Request", errorMessage);
    }
    const { fullName, email, username, password } = parsedRequest.data;
    const token = await registerUser(fullName, email, username, password);

    const apiResponse: ApiResponse = new ApiResponse(
      "User registered successfully",
      {
        token: token,
      }
    );
    res.status(201).json(apiResponse);
  } catch (error) {
    handleApiError(res, error);
  }
}

export async function loginController(req: Request, res: Response) {
  try {
    const parsedRequest = loginSchema.safeParse(req.body);
    if (!parsedRequest.success) {
      const errorMessage = fromZodError(parsedRequest.error).message.replace(
        /"/g,
        "'"
      );
      console.log(errorMessage);
      throw new ApiError(400, "Bad Request", errorMessage);
    }
    const { email, password } = parsedRequest.data;
    const token = await loginUser(email, password);

    const apiResponse: ApiResponse = new ApiResponse(
      "User logged in successfully",
      {
        token: token,
      }
    );
    res.status(200).json(apiResponse);
  } catch (error) {
    handleApiError(res, error);
  }
}
