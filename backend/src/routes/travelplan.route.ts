import { Router } from 'express';
import axios from 'axios';
import config from '../config';
import { getFlightsData, getHotelsData, getReturnFlightsData } from '../utils/getDataFromSerp';
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
  const { departureAirportId, arrivalAirportId, departureDate, returnDate } = req.query as { departureAirportId: string, arrivalAirportId: string, departureDate: string, returnDate: string };

  const flightsData = await getFlightsData({
    departureAirportId,
    arrivalAirportId,
    departureDate,
    returnDate,
  });
  // const flightsData = await getFlightsData({
  //   departureAirportId: "CDG, ORY",
  //   arrivalAirportId: "JFK, EWR",
  //   departureDate: "2025-06-13",
  //   returnDate: "2025-06-20",
  // });

  res.send(flightsData);
});

app.get('/return-flights'  , async (req, res) => {
  const { departureToken } = req.query as { departureToken: string };

  const flightsData = await getReturnFlightsData({
    departureToken: departureToken,
    arrivalAirportId: "JFK, EWR",
    departureAirportId: "CDG, ORY",
    returnDate: "2025-06-20",
    outboundDate: "2025-06-13",
  });

  res.send(flightsData);
});

app.get('/hotels'  , async (req, res) => {
  const { departureAirportId, arrivalAirportId, departureDate, returnDate } = req.query as { departureAirportId: string, arrivalAirportId: string, departureDate: string, returnDate: string };

  // const flightsData = await getFlightsData({
  //   departureAirportId,
  //   arrivalAirportId,
  //   departureDate,
  //   returnDate,
  // });
  const flightsData = await getHotelsData({
    q: "pet friendly hotels in dubai",
    departureDate: "2025-06-11",
    returnDate: "2025-06-14",
  });

  res.send(flightsData);
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