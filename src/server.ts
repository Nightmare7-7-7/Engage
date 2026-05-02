import express from 'express';  // Fixed typo
import cors from 'cors';
import helmet from 'helmet';
import "dotenv/config"
import userRoutes from './routes/user.routes';
import rateLimit from "express-rate-limit"
import postRoutes from './routes/post.routes';
import parser from "cookie-parser"
import { createServer } from 'http'
import { Server } from 'socket.io';
import chatRoutes from './routes/chat.routes';
import morgan from "morgan";
//init global rate limiter 
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 400,
    message: "Too many requests try again later"
});

// Create an Express application
const app = express();  // Also fixed here
app.use(limiter);

// Increase limit for JSON and URL-encoded bodies
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: true, limit: "200mb" }));
app.use(parser())


app.use(cors({
    origin: [
        'http://localhost:8080',
        'http://localhost:5173',
        /\.netlify\.app$/
    ],
    credentials: true // Important for sending cookies/auth headers
}));

app.use(helmet())
app.use(morgan("combined"))
const httpServer = createServer(app);


const io = new Server(httpServer, {
    cors: {
        origin: [
        'http://localhost:8080',
        'http://localhost:5173',
        /\.netlify\.app$/
    ],
        credentials: true
    }
});


io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);
    socket.on('join', (userId: number) => {
        socket.join(`user_${userId}`);
        console.log(`User ${userId} joined their room`)
    });
    socket.on('disconnect', () => {
        console.log('user disconnected:', socket.id)
    });

})

// start the server
const port = process.env.PORT || 8081;


//api paths
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/chat",chatRoutes);


httpServer.listen((port), () => {
    console.log(`Server is running on http://localhost:${port}`);
});

export { io }