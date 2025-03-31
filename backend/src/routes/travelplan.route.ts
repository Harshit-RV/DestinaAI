import { Router } from 'express';
import axios from 'axios';
const app = Router();

interface TravelPlan {
  id: number;
  destination: string;
  startDate: string;
  endDate: string;
  note: string;
}

const travelplans: TravelPlan[] = [];

app.get('/', (req, res) => {
  res.send('this is the home page of travelplan');
});

app.get('/search', async (req, res) => {
  const data = await axios.get(`https://serpapi.com/locations.json?q=${req.query.keyword}&limit=5`);
  res.send(data.data);
});

app.get('/list', (req, res) => {
  res.json(travelplans);
});

export default app;