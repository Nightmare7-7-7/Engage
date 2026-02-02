import exppress from 'express';
import cors from 'cors';
import helmet from 'helmet';
import "dotenv/config"
// Create an Express application
const app = exppress();
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
