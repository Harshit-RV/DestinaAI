import { Router } from 'express';

const app = Router();

app.get('/', (req, res) => {
  res.send('this is the home page of user routes');
});

export default app;