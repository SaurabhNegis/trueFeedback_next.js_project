import  {resend} from "../lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import {ApiResponse} from "@/types/apiResponse"



export async function sendVerificationEmail(email:string, username: string, verifyCode: string
    ): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject:'Mystry Message | verifyCode',
            react:VerificationEmail({username, otp:verifyCode}),
          });
      
          return {
            success: true, message: 'verification email send successfullly'
        }
    } catch (emailError) {
        console.error("Error sending verification email", emailError)
        return { 
            success: false, message: 'Failed to send verification email'
        }
    }
}