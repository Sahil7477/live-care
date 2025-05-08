
import { z } from "zod";

export const UserFormValidation = z.object({
  name: z.string().min(4, 
    "Username must be at least 4 characters.",
  ).max(50, "username must be at most 50 characters."),
  email: z.string().email("Invalid email address."),
    phone: z.string().refine((phone) => /^\+?[1-9]\d{1,14}$/.test(phone),'Invalid phone number' ),
})