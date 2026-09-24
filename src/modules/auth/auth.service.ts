import bcrypt from "bcryptjs";
import { prisma } from "../../config/prisma.js";
import AppError from "../../errors/AppError.js";

interface SignupInput{
    name : string;
    email : string;
    password : string;
    role? : "CUSTOMER" | "PROVIDER";
}

const signup = async (payload: SignupInput) => {
    const {name,email,password,role = "CUSTOMER"} = payload;

    // 1. Check existing account
    const existingAccount = await prisma.account.findUnique({
        where: {
            email : email,
        }
    })

    if(existingAccount){
        throw new AppError("An account alrady exists with this email", 409);
    }

    // 2.Hash password 
    const hashedPassword = await bcrypt.hash(password, 12)

    // 3. Create Account 
    const account = await prisma.account.create({
        data : {
            name,
            email,
            password : hashedPassword,
            role,
        },
        select : {
            id : true,
            name : true,
            email: true,
            role : true,
            createdAt : true,
            updateAt : true,
        }
    })

    return account;
}


export const authService = {
    signup
}