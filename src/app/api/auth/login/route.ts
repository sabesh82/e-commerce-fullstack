import { userLoginSchema } from "@/schemas/user.schema";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/schema";
import { verify } from "argon2";
import generateToken from "@/helpers/generateToken";
import handleError from "@/helpers/handleError";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = userLoginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: {
        email: validatedData.email,
      },
    });

    const invalidCredentials = NextResponse.json(
      {
        success: false,
        error: {
          code: "INVALID-CREDIENTIALS",
          message: "invalid email or password",
        },
      },
      { status: 401 }
    );

    if (!user) {
      return invalidCredentials;
    }

    const isPasswordValid = await verify(user.password, validatedData.password);

    if (!isPasswordValid) {
      return invalidCredentials;
    }

    const token = generateToken(user.id);

    return NextResponse.json({ ...user, token }, { status: 200 });
  } catch (error) {
    return handleError(error, "failed to login user");
  }
}
