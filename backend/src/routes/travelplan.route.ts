import { Router } from 'express';
import axios from 'axios';
import config from '../config';
import { getFlightsData, getReturnFlightsData } from '../utils/getDataFromSerp';
import { getTripActivities } from '../utils/getTripActivities';
import { getHotelsOffersByCityCode } from '../utils/getDataFromAmadeus';
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

app.get('/activity', async (req, res) : Promise<any> => {
  const response = await getTripActivities({
    arrivalCityName: 'New Delhi',
    interests: ['sightseeing'],
    numberOfChildren: 0,
    numberOfAdults: 2,
    arrivalTime: '2025-08-09 21:30',
    departureTime: '2025-08-19 21:30',
    hotelName: 'Hyatt Centric, Janakpuri',
    hotelLatitude: 28.6289,
    hotelLongitude: 77.0785,
    numberOfDays: 10,
  });
  res.json(response);
});

app.get('/search', async (req, res) : Promise<any> => {
  try {
    const data = await axios.get(`https://serpapi.com/locations.json?q=${req.query.keyword}&limit=5`);
    return res.send(data.data);
  } catch (error) {
    console.error('Error fetching search results:', error);
    return res.status(500).send('Error fetching search results: ');
  }
});

app.get('/flights'  , async (req, res) : Promise<any> => {
  try {
    const { departureAirportId, arrivalAirportId, departureDate, returnDate } = req.query as { departureAirportId: string, arrivalAirportId: string, departureDate: string, returnDate: string };

    const flightsData = await getFlightsData({
      departureAirportId,
      arrivalAirportId,
      departureDate,
      returnDate,
    });

    return res.send(flightsData);
  } catch (error) { 
    console.error('Error fetching flights data:', error);
    return res.status(500).send('Error fetching flights data');
  }
});

app.get('/return-flights'  , async (req, res) : Promise<any> => {
  try {
    const { departureToken, arrivalAirportId, departureAirportId, returnDate, departureDate } = req.query as { departureToken: string, arrivalAirportId: string, departureAirportId: string, returnDate: string, departureDate: string };
    const flightsData = await getReturnFlightsData({
      departureToken: departureToken,
      arrivalAirportId: departureAirportId,
      departureAirportId: arrivalAirportId,
      returnDate: returnDate,
      outboundDate: departureDate,
    });
    return res.send(flightsData);
  } catch (error) {
    console.error('Error fetching return flights data:', error);
    return res.status(500).send('Error fetching return flights data');
  }
});

app.get('/hotels'  , async (req, res) : Promise<any> => {
  try {  
    const { 
      location, 
      checkInDate, 
      checkOutDate, 
      numberOfAdults, 
      numberOfChildren,
      page,
      limit 
    } = req.query as { 
      location: string, 
      hotelPreference: string, 
      interests: string,
      checkInDate: string, 
      checkOutDate: string, 
      numberOfAdults: string, 
      numberOfChildren: string,
      page?: string,
      limit?: string
    };
    
    const cityCode = location.split(',')[0];
    
    // Use Amadeus API to get hotels by city name with pagination
    const paginatedHotelsData = await getHotelsOffersByCityCode({
      cityCode: cityCode,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      numberOfAdults: parseInt(numberOfAdults),
      numberOfChildren: parseInt(numberOfChildren),
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
    });

    return res.send({
      data: paginatedHotelsData.data,
      pagination: paginatedHotelsData.pagination,
    });
  } catch (error) {
    console.error('Error fetching hotels data:', error);
    return res.status(500).send(error);
  }
});


app.post('/generate', async (req, res) : Promise<any> => {
  try {
    const { destination, startDate, endDate, interests, hotelPref, minimumBudget, maximumBudget } = req.body;

    // generate using GPT API
    return res.send({});
  } catch (error) { 
    console.error('Error generating travel plan:', error);
    return res.status(500).send('Error generating travel plan');
  }
});

app.get('/list', async (req, res) : Promise<any> => {
  return res.json(travelplans);
});

export default app;