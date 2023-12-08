import express from 'express';
import { config } from 'dotenv';
import routes from './routes/image.js';
import mongoose from 'mongoose';
import cors from 'cors'


config();


//mongoose.connect('mongodb://mongo:1234@vm.cloud.cbh.kth.se:2778/patientImages?authSource=admin');

mongoose.connect('mongodb://mongo:1234@vm.cloud.cbh.kth.se:2778/patientImages?authMechanism=DEFAULT&authSource=admin');
mongoose.Promise = global.Promise;


const app = express();
app.use(express.json())
app.use(cors())
app.use('/', routes)
app.use('/uploads', express.static('uploads'));



const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});