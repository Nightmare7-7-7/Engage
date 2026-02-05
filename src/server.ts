import exppress from 'express';
import cors from 'cors';
import helmet from 'helmet';
import "dotenv/config"
import userRoutes from './routes/user.routes';
import rateLimit from "express-rate-limit"

//init global rate limiter 
const limiter = rateLimit({
    windowMs:15 * 60 * 1000,
    max:100,
    message: "Too many requests try later"
});

// Create an Express application
const app = exppress();
app.use(limiter);
app.use(exppress.json());
app.use(cors({
    origin: 'http://localhost:5123',  
}));
app.use(helmet())


// start the server
const port = process.env.PORT || 8081;

app.listen((port),()=>{
    console.log(`Server is running on http://localhost:${port}`);
});


//api paths

app.use("/api/v1",userRoutes);