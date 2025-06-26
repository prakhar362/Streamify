import bcrypt from "bcryptjs";
import User from "../models/user.js";
import {z} from 'zod';

const signupSchema= z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

export async function Signup(req,res){
    const {fullName , email, password }=req.body;
    try {
        if(!fullName || !email || !password)
    {
        res.status(400).json({message: "All Fields are required"})
    }
    
    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(411).json({ error: "Invalid input", details: result.error.format() });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists, please use a diffrent one" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
        fullName,
        email,
        password:hashedPassword,
    })
    return res.status(200).json({ message: "Signed up" });
        
    } catch (error) {
        console.error("Signup Error: ",error);
        return res.status(500).json({ error: "Server error" });
    }
    
}

export async function Login(req,res){
    res.send('Login Endpoint !');
}

export async function Logout(req,res){
    res.send('Logout Endpoint !');
}