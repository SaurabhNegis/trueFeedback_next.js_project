import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

export async function POST(request:Request){
    await dbConnect()

    try {
    const {username, email, password}  =   await request.json()
    const existingUserVerificatiedByUsername = await   UserModel.findOne({
            username,
            isVerified: true
        })
        if(existingUserVerificatiedByUsername){
         return Response.json({
            success: false,
            message: "Username is already taken",
         },{status: 400})
        }

        const existingUserByEmail = await UserModel.findOne({email})
        const verifiedCode = Math.floor(100000 + Math.random()* 900000).toString()
        
        
        if(existingUserByEmail){
              if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "User already exist with this email"
                },{status: 400})
              }
              else{
        const hashedPassword =  await bcrypt.hash(password,10)
                 existingUserByEmail.password = hashedPassword;
                 existingUserByEmail.verifiedCode = verifiedCode;
                 existingUserByEmail.verifiedCodeExpiry = new Date(Date.now() + 3600000);
                 await existingUserByEmail.save()
                }  
        }
        else{
        const hashedPassword =  await bcrypt.hash(password,10)
        const expiryDate = new Date()
        expiryDate.setHours(expiryDate.getHours() +1)

     const newUser =   new UserModel({
                  username,
                  email,            // Email address
                  password: hashedPassword,
                  verifiedCode,
                  verifiedCodeExpiry:expiryDate,
                  isVerified: false,
                  isAcceptingMessage: true,
                  message: []
        })
        await  newUser.save()
        }
        
        // send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifiedCode
        )

        if(!emailResponse.success){
            return Response.json({
                success: false,
                message: emailResponse.message
            },{status: 500})
        }

        return Response.json({
            success: true,
            message: "User registered successfully. please verify your email"
        },{status: 201})

    } catch (error) {
        console.error('Error registering user', error)
        return Response.json({
            success: false,
            message: "error registering User"
        },{
            status: 500
        })
    }
}
