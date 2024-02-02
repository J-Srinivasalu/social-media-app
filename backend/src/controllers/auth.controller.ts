import { Request, Response } from "express";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import {
  generateAccessAndRefreshToken,
  loginUser,
  logout,
  registerUser,
} from "../services/auth.service";
import { ApiResponse } from "../models/apiResponse.model";
import ApiError from "../utils/error.util";
import handleApiError from "../utils/apiErrorHandler";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { AuthenticatedRequest, DecodedRefreshToken } from "../utils/types.util";
import { handleJwtError } from "../middlewares/auth.middleware";

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
    const { token, refreshToken } = await registerUser(
      fullName,
      email,
      username,
      password
    );

    const apiResponse: ApiResponse = new ApiResponse(
      "User registered successfully",
      {
        token,
        refreshToken,
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
    const { token, refreshToken } = await loginUser(email, password);

    const apiResponse: ApiResponse = new ApiResponse(
      "User logged in successfully",
      {
        token,
        refreshToken,
      }
    );
    res.status(200).json(apiResponse);
  } catch (error) {
    handleApiError(res, error);
  }
}

export async function logoutController(req: Request, res: Response) {
  try {
    const decoded = (req as AuthenticatedRequest).user;
    await logout(decoded.id);

    const apiResponse: ApiResponse = new ApiResponse(
      "User logged out successfully"
    );
    res.status(200).json(apiResponse);
  } catch (error) {
    handleApiError(res, error);
  }
}

const refreshAccessTokenSchema = z.object({
  refreshToken: z.string(),
});

export async function refreshAccessTokenController(
  req: Request,
  res: Response
) {
  try {
    const parsedRequest = refreshAccessTokenSchema.safeParse(req.body);
    if (!parsedRequest.success) {
      const errorMessage = fromZodError(parsedRequest.error).message.replace(
        /"/g,
        "'"
      );
      console.log(errorMessage);
      throw new ApiError(400, "Bad Request", errorMessage);
    }
    const { refreshToken } = parsedRequest.data;

    const decodedToken = jwt.verify(
      refreshToken,
      config.refreshTokenSecretKey
    ) as DecodedRefreshToken;

    const { token, newRefreshToken } = await generateAccessAndRefreshToken(
      decodedToken.id,
      refreshToken
    );

    const apiResponse: ApiResponse = new ApiResponse(
      "User logged in successfully",
      {
        token: token,
        refreshToken: newRefreshToken,
      }
    );
    res.status(200).json(apiResponse);
  } catch (error) {
    handleApiError(res, error);
  }
}
