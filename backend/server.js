import express from 'express';
import mongosse from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from "cors";

//route imports
import AuthRoutes from './routes/auth.route.js';
import UserRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';
import GroupRoutes from './routes/group.route.js';

const app=express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());

// Handle preflight requests
app.options('*', cors({
  origin: ["https://streamify-nu-bay.vercel.app", "http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));

app.use(
  cors({
    origin: ["https://streamify-nu-bay.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true, // allow frontend to send cookies
  })
);

//routes
app.get('/',(req,res)=>{
    res.send('hello from server !');
})

app.use("/api/v1/auth",AuthRoutes);
app.use("/api/v1/user",UserRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/group",GroupRoutes);

//running:
const port=process.env.PORT;
const mongourl=process.env.MONGO_URI;
app.listen(port, async()=>{
    try {
        const connection=await mongosse.connect(mongourl);
        if(connection)
        {
            console.log(`Server running on http://localhost:${port}`);
            console.log('MongoDB connected successfully')
        }
        
    } catch (error) {
        console.error('Error msg: ',error);
    }
    
})