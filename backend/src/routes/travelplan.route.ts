import { Router } from 'express';
import axios from 'axios';
import config from '../config';
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

app.get('/flights'  , async (req, res) => {
  const { destination, starting, endDate, starting_date, return_date } = req.query;
  const data = await axios.get(`https://serpapi.com/search.json?engine=google_flights&departure_id=${starting}&arrival_id=${destination}&gl=us&hl=en&currency=USD&outbound_date=${starting_date}&return_date=${return_date}&api_key=${config.serpApiKey}`);
  res.send(data.data);
});

app.get('/flights2'  , async (req, res) => {
  try {
    console.log(config.amadeusApiKey);
    const { destination, starting, endDate, starting_date, return_date } = req.query;
    const data = await axios.get(`https://test.api.amadeus.com/v1/reference-data/locations`, {
      params: { subType: 'AIRPORT', keyword: 'dxb', sort: 'analytics.travelers.score', view: 'FULL' },
      headers: {
        Authorization: `Bearer ZQ6GRVGYACrKtlA6YqRgUCioMpeG`,
      },
    }
    
    );
    res.send(data.data);
  } catch (error) {
    // console.error('Error fetching flight data:', error);
    res.status(500).json(error);
  }
});



app.post('/generate', async (req, res) => {
  const { destination, startDate, endDate, interests, hotelPref, minimumBudget, maximumBudget } = req.body;

  // generate using GPT API
  res.send({});
});

app.get('/list', (req, res) => {
  res.json(travelplans);
});

export default app;