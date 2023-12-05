import express from 'express';
import { config } from 'dotenv';
import routes from './routes/image.js';
import mongoose from 'mongoose';
config();


mongoose.connect('mongodb://localhost:27017/mongodb');
mongoose.Promise = global.Promise;


const app = express();
app.use(express.json())
app.use('/', routes)
app.use('/uploads', express.static('uploads'));



const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});