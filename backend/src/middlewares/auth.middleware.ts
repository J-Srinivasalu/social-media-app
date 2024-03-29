import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/error.util";
import handleApiError from "../utils/apiErrorHandler";
import jwt, { NotBeforeError, TokenExpiredError } from "jsonwebtoken";
import { AuthenticatedRequest, DecodedToken } from "../utils/types.util";
import config from "../config/config";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized", "User not authorized");
    }

    const decoded = jwt.verify(
      token,
      config.accessTokenSecretKey ?? ""
    ) as DecodedToken;

    (req as AuthenticatedRequest).user = decoded;
    console.log("User is authorized");
    next();
  } catch (error) {
    handleJwtError(res, error);
  }
}

export function handleJwtError(res: Response, error: any) {
  if (error instanceof TokenExpiredError) {
    return handleApiError(
      res,
      new ApiError(401, "Unauthorized", "Token has expired")
    );
  } else if (error instanceof NotBeforeError) {
    return handleApiError(
      res,
      new ApiError(401, "Unauthorized", "Token not yet valid")
    );
  } else {
    return handleApiError(
      res,
      new ApiError(401, "Unauthorized", "Invalid token")
    );
  }
}
