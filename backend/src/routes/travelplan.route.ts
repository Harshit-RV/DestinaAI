import { Router } from 'express';
import axios from 'axios';
import config from '../config';
import { getFlightsData, getReturnFlightsData } from '../utils/getDataFromSerp';
import { getTripActivities, getFinalPlan } from '../utils/getTripActivities';
import { getHotelsOffersByCityCode } from '../utils/getDataFromAmadeus';
import { calculateBatchHotelEmissions } from '../utils/getHotelEmissions';
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

app.post('/finalize-plan', async (req, res) : Promise<any> => {
  try {
    const { 
      activities, 
      cityName, 
      interests, 
      children, 
      adults, 
      arrivalTime, 
      departureTime, 
      hotelName, 
      hotelLatitude, 
      hotelLongitude,
    } = req.body as { 
      cityName: string, 
      interests: string[], 
      children: number, 
      adults: number, 
      arrivalTime: string, 
      departureTime: string, 
      hotelName: string, 
      hotelLatitude: number, 
      hotelLongitude: number,
      activities: any[]
    };

    const numberOfDays = calculateNumberOfDays(arrivalTime, departureTime);

    const response = await getFinalPlan({
      arrivalCityName: cityName,
      interests: interests,  
      numberOfChildren: children,
      numberOfAdults: adults,
      arrivalTime: arrivalTime,
      departureTime: departureTime,
      hotelName: hotelName,
      hotelLatitude: hotelLatitude,
      hotelLongitude: hotelLongitude,
      numberOfDays: numberOfDays,
      activities: activities,
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

    // Calculate number of nights
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const numberOfNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24));
    const totalGuests = parseInt(numberOfAdults) + parseInt(numberOfChildren);

    // Prepare hotel data for batch emissions calculation
    const hotelInfos = paginatedHotelsData.data.map((hotel: any) => ({
      hotelId: hotel.hotel.hotelId,
      hotelName: hotel.hotel.name,
      roomType: hotel?.offers?.[0]?.room?.type || hotel?.offers?.[0]?.roomInformation?.type,
      cityCode: hotel.hotel.cityCode
    }));

    // Calculate emissions for all hotels in one batch call
    const emissionsResults = await calculateBatchHotelEmissions({
      hotels: hotelInfos,
      numberOfNights: numberOfNights,
      numberOfGuests: totalGuests
    });

    // Add carbon emissions to each hotel
    const hotelsWithEmissions = paginatedHotelsData.data.map((hotel: any) => {
      const emissions = emissionsResults[hotel.hotel.hotelId];
      return {
        ...hotel,
        carbon_emissions: emissions || undefined
      };
    });

    return res.send({
      data: hotelsWithEmissions,
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