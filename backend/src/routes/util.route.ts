import { Router } from 'express';
import { getAirportCodesFromCityname } from '../utils/getAirportCodesFromCityname';

const app = Router();

app.get('/get-airport-codes', async (req, res) : Promise<any> => {
  // res.send('this is the home page of util routes');
  const { departureCityName, arrivalCityName } = req.query as { departureCityName: string, arrivalCityName: string };
  const airportCodes = await getAirportCodesFromCityname(departureCityName, arrivalCityName);
  console.log(airportCodes);
  return res.send(airportCodes);
});

export default app;