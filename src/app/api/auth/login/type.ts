import { userLoginSchema } from "@/schemas/user.schema";
import z from "zod";

export type UserLoginInput = z.infer<typeof userLoginSchema>;
