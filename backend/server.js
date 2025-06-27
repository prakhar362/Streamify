import express from 'express';
import mongosse from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

//route imports
import AuthRoutes from './routes/auth.route.js';

const app=express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());

//routes
app.get('/',(req,res)=>{
    res.send('hello from server !');
})

app.use("/api/v1/auth",AuthRoutes);

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