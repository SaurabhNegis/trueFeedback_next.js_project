import { boolean } from "zod";
import {Message} from "../model/User" 
  
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean
    messages?: Array<Message>
    data?: T; // Generic type to allow flexibility
}