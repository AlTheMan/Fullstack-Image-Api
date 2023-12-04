import express from 'express';
import { config } from 'dotenv';
import routes from './routes/image.js';


config();


const app = express();
app.use(express.json())
app.use('/', routes)



const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});