import express from 'express';  // Fixed typo
import cors from 'cors';
import helmet from 'helmet';
import "dotenv/config"
import userRoutes from './routes/user.routes';
import rateLimit from "express-rate-limit"
import postRoutes from './routes/post.routes';
import parser from "cookie-parser"

//init global rate limiter 
const limiter = rateLimit({
    windowMs:15 * 60 * 1000,
    max:400,
    message: "Too many requests try again later"
});

// Create an Express application
const app = express();  // Also fixed here
app.use(limiter);
app.use(express.json());
app.use(parser())

app.use(cors({
    origin: [
        'http://localhost:8080',
        'http://localhost:5173',
        'https://huggable-foundation-build.lovable.app',
        'https://v0-frontend-for-backend-livid.vercel.app',
        /\.lovable\.app$/,
        /\.vercel\.app$/ // This regex will allow all vercel.app subdomains
    ],
    credentials: true // Important for sending cookies/auth headers
}));

app.use(helmet())

// start the server
const port = process.env.PORT || 8081;

app.listen((port),()=>{
    console.log(`Server is running on http://localhost:${port}`);
});

//api paths
app.use("/api/v1",userRoutes);
app.use("/api/v1/post", postRoutes);