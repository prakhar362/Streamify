import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { upsertStreamUser } from "../lib/stream.js";
import {z} from 'zod';
import jwt from "jsonwebtoken";

const signupSchema= z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

export async function Signup(req,res){
    const {fullName , email, password }=req.body;
    console.log("Signup request received:", { fullName, email });
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
    const newUser= await User.create({
        fullName,
        email,
        password:hashedPassword,
    })

    console.log("User created:", newUser._id, "isOnboarded:", newUser.isOnboarded);

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
      console.log(`Stream user created for ${newUser.fullName}`);
    } catch (error) {
      console.log("Error creating Stream user:", error);
    }

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    const cookieOptions = {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // prevent XSS attacks,
      sameSite: "None", // allow cross-site requests for login
      secure: true, // always use secure cookies for HTTPS
    };

    console.log("Setting cookie with options:", cookieOptions);

    res.cookie("jwt", token, cookieOptions);

    console.log("Sending signup response with user data");
    return res.status(200).json({ success: true, user: newUser });
        
    } catch (error) {
        console.error("Signup Error: ",error);
        return res.status(500).json({ error: "Server error" });
    }
    
}

export async function Login(req, res) {
  try {
    const { email, password } = req.body;
    console.log("Login request received:", { email });

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isPasswordCorrect = await bcrypt.compareSync(password,user.password);
    if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid email or password" });

    console.log("User logged in:", user._id, "isOnboarded:", user.isOnboarded);

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  httpOnly: true,                 // prevent XSS
  sameSite: "None",               // 🔥 REQUIRED for cross-origin cookies
  secure: true,                   // 🔥 REQUIRED when using HTTPS (Render)
};


    console.log("Setting cookie with options:", cookieOptions);

    res.cookie("jwt", token, cookieOptions);

    console.log("Sending login response with user data");
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export function Logout(req, res) {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None", // 🔥 must match how the cookie was set
    secure: true      // 🔥 must match how the cookie was set
  });

  res.status(200).json({ success: true, message: "Logout successful" });
}

export async function Onboard (req,res){
  try {
    const userId = req.user._id;

    const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

    if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
      console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`);
    } catch (streamError) {
      console.log("Error updating Stream user during onboarding:", streamError.message);
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Onboarding error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }

}