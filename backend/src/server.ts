import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import teamsRouter from './routes/teams';
import calculatorRouter from './routes/calculator';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/teams', teamsRouter);
app.use('/api/calculate', calculatorRouter);

// Error handling
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 