import { userRegiterSchema } from "@/schemas/user.schema";
import z from "zod";

export type UserRegisterInput = z.infer<typeof userRegiterSchema>;
