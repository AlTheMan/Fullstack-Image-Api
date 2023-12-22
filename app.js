import express from 'express';
import { config } from 'dotenv';
import imageRoutes from './routes/image.js';
import healthRoutes from './routes/health.js'
import mongoose from 'mongoose';
import cors from 'cors';

config();
mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

const app = express();
app.use(express.json());
app.use(cors());
app.use('/', imageRoutes);
app.use('/', healthRoutes);
app.use('/uploads', express.static('uploads'));

export default app;
