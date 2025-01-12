import { z } from "zod";


// Define the username regex
const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;


export const usernameValidation = z
.string()
.min(2,"username must be atleast 2 characters")
.max(20, "username must not be more than  20 charachters")
.regex(usernameRegex, "Username must be 3-16 characters long and can only contain letters, numbers, underscores, or hyphens.")

export const signUpSchema = z.object({
    usernam: usernameValidation,
    email: z.string().email({message:'Invalid email address'}),
    password: z.string().min(6, {message: "password must be at least 6 charactera"})
})