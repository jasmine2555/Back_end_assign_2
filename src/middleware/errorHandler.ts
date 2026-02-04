import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpConstants";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(err);
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: "Internal Server Error"
  });
}
