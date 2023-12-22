import app from './app.js';

const port = 3000;
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  console.log('Mongo database: ', process.env.MONGODB_URI)
});
