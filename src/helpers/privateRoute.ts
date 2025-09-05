import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import handleError from "./handleError";

export default async function privateRoute(
  request: NextRequest,
  cb: (user: { id: string }, token: string) => Promise<NextResponse>
) {
  try {
    const authorization = (await headers()).get("Authorization");
    const token = authorization?.split("Bearer ")[1];

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "USER_NOT_AUTHORIZED",
            message: "Authentication required",
          },
        },
        { status: 401 }
      );
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    // Verify and decode token
    const decoded = jwt.verify(token, secret) as JwtPayload & { id: string };

    // Execute the callback with user info
    return await cb(decoded, token);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "TOKEN_EXPIRED",
            message: "Session expired, please login again",
          },
        },
        { status: 401 }
      );
    }

    return handleError(error, "Authorization failed");
  }
}
