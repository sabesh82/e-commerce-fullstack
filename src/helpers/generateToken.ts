import jwt from "jsonwebtoken";

export default function generateToken(id: string) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw {
      Code: "JWT_SECRET is missing",
      message: "JWT_SECRET is not defined in environment variables",
    };
  }

  try {
    const token = jwt.sign({ id }, secret, { expiresIn: "1w" });
    return token;
  } catch (error) {
    console.log("token_generation_error:", error);
    throw {
      Code: "TOKEN_GENERATION_FAILED",
      message: "failed to generate token",
    };
  }
}
