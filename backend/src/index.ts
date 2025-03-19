import express from 'express';
import travelplanRoute from './routes/travelplan.route';
import userRoute from './routes/users.route';
import cors from 'cors';
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World 2!');
});

app.use('/travelplan', travelplanRoute);
app.use('/users', userRoute);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// weather app
// database connection


