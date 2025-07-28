import { Router } from 'express';
import axios from 'axios';
import config from '../config';
import { getFlightsData, getReturnFlightsData } from '../utils/getDataFromSerp';
import { getTripActivities, getFinalPlan } from '../utils/getTripActivities';
import { getHotelsOffersByCityCode } from '../utils/getDataFromAmadeus';
const app = Router();

interface TravelPlan {
  id: number;
  destination: string;
  startDate: string;
  endDate: string;
  note: string;
}

const calculateNumberOfDays = (arrival: string, departure: string): number => {
  const arrivalDate = new Date(arrival.replace(' ', 'T'));
  const departureDate = new Date(departure.replace(' ', 'T'));
  
  const timeDifference = departureDate.getTime() - arrivalDate.getTime();
  const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
  
  return Math.max(1, daysDifference); // Ensure at least 1 day
};

const travelplans: TravelPlan[] = [];

app.get('/', (req, res) => {
  res.send('this is the home page of travelplan');
});

app.get('/activity', async (req, res) : Promise<any> => {
  try {
    const { 
      cityName, 
      interests, 
      children, 
      adults, 
      arrivalTime, 
      departureTime, 
      hotelName, 
      hotelLatitude, 
      hotelLongitude 
    } = req.query as { 
      cityName: string, 
      interests: string, 
      children: string, 
      adults: string, 
      arrivalTime: string, 
      departureTime: string, 
      hotelName: string, 
      hotelLatitude: string, 
      hotelLongitude: string 
    };

    const numberOfDays = calculateNumberOfDays(arrivalTime, departureTime);

    const response = await getTripActivities({
      arrivalCityName: cityName,
      interests: interests ? interests.split(',') : [],
      numberOfChildren: parseInt(children) || 0,
      numberOfAdults: parseInt(adults) || 1,
      arrivalTime: arrivalTime,
      departureTime: departureTime,
      hotelName: hotelName || '',
      hotelLatitude: parseFloat(hotelLatitude) || 0,
      hotelLongitude: parseFloat(hotelLongitude) || 0,
      numberOfDays: numberOfDays,
    });
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

app.get('/finalize-plan', async (req, res) : Promise<any> => {
  try {
    // const { 
    //   activities, 
    //   cityName, 
    //   interests, 
    //   children, 
    //   adults, 
    //   arrivalTime, 
    //   departureTime, 
    //   hotelName, 
    //   hotelLatitude, 
    //   hotelLongitude 
    // } = req.body as { 
    //   activities: any[], 
    //   cityName: string, 
    //   interests: string[], 
    //   children: number, 
    //   adults: number, 
    //   arrivalTime: string, 
    //   departureTime: string, 
    //   hotelName: string, 
    //   hotelLatitude: number, 
    //   hotelLongitude: number 
    // };

    // const numberOfDays = calculateNumberOfDays(arrivalTime, departureTime);

    // // Convert kanban activities to a readable format for GPT
    // const activitiesText = activities.map((day, index) => 
    //   `Day ${index + 1} (${day.title}): ${day.items.map((item: any) => item.content).join(', ')}`
    // ).join('\n');

    const response = await getFinalPlan({
      arrivalCityName: "Delhi",
      interests: [],
      numberOfChildren: 0,
      numberOfAdults: 2,
      arrivalTime: "2025-09-28 15:15",
      departureTime: "2025-10-4 15:15",
      hotelName: "Best Western Darbar",
      hotelLatitude: 28,
      hotelLongitude: 40,
      numberOfDays: 7,
      finalizedActivities: [],
    });
    
    res.json(response);
  } catch (error) {
    console.error('Error finalizing plan:', error);
    res.status(500).json({ error: 'Failed to finalize plan' });
  }
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