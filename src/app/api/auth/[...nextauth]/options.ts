import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from  "bcryptjs"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export const authOptions: NextAuthOptions = {
  providers:[
    CredentialsProvider({
        id: "credentials",
        name: "Credentials",
        credentials: {
            email: { label: "Email", type: "text", placeholder: "Your username" },
            password: { label: "Password", type: "password" },
          },
            async authorize(credentials:any): Promise<any> {
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier},
                        ]
                    })
                    if(!user){
                        throw new Error("No user found with this email")
                    }
                    if(!user.isVerified){
                        throw new Error("please veify your acount first before log-in")
                    }
                    // Check if user.password exists and is a string
                    if (!user.password || typeof user.password !== "string") {
                      throw new Error("Invalid credentials.");
                    }
                    
                  const isPasswordCorrect =   await bcrypt.compare(credentials.password, user.password);

                  if(isPasswordCorrect){
                    return user
                  }
                  else{
                    throw new Error("incorrect password!.");

                  }
                } catch (err: any) {
                    throw new Error(err)
                }
            }
        
            
      
    })
  ],
  callbacks: {
    async jwt({ token, user }) {

      if(user){
        token._id = user._id?.toString()
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.usernmae;
      }
      return token
    },
    async session({ session, token }) {                  
      if(token){
         session.user._id = token._id;
         session.user.isVerified = token.isVerified;
         session.user.isAcceptingMessage = token.isAcceptingMessage;
         session.user.username = token.username;
      }
      return session
    },
  },
  pages:{
    signIn: '/sign-in'
  },
  session:{
    strategy: "jwt"
  },
  secret:process.env.NEXTAUTH_SECRET

}