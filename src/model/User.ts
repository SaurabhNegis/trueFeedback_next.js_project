import mongoose, {Schema, Document} from "mongoose";


export interface Message  extends Document {
    content: string;
    createdAt: Date;             // Account creation date
    updatedAt: Date;             // Last update date
  }
  
  const MessageSchema: Schema<Message> = new Schema({
      content: {
          type: String,
          required: true
        },
        createdAt: {
            type: Date,
            required: true,
            default: Date.now
        }
        
    })

// Define the Message schema for embedded documents
export interface User extends Document {
      username: string;
      email: string;             // Email address
      password?: string;        // Password (optional for excluding sensitive data)
      verifiedCode:string;
      verifiedCodeExpiry:Date;
      isVerified: boolean;
      isAcceptingMessage: boolean;
      message: Message[];
    }
    
 // Define the User schema
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


const UserSchema: Schema<User> = new Schema({
    username: { type: String, required:[true, "username is required!"] },
   
    email: { type: String, required: [true, "Email is required!"], unique: true ,      validate: {
        validator: (value: string) => emailRegex.test(value), // Email validation  message: 'Invalid email format.',                    // Custom error message
   },
     },
    password: { type: String, required:  [true, "Password is required!"] },
    verifiedCode: { type: String, required:   [true, "verifiedCode is required!"] },
    verifiedCodeExpiry: { type: Date, required:    [true, "verifiedCode Expiry is required!"] },
    isVerified: { type: Boolean },
    isAcceptingMessage: { type: Boolean, default: true },
    message: [MessageSchema]                   // Array of embedded message documents
  });

 
const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema )

export default UserModel;  