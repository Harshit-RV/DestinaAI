import { Router } from 'express';
import { getAirportCodesFromCityname } from '../utils/getAirportCodesFromCityname';

const app = Router();

app.get('/get-airport-codes', async (req, res) : Promise<any> => {
  // res.send('this is the home page of util routes');
  const { departureCityName, arrivalCityName } = req.query as { departureCityName: string, arrivalCityName: string };
  const airportCodes = await getAirportCodesFromCityname(departureCityName, arrivalCityName);

  // const airportCodes = {
  //   role: 'assistant',
  //   content: '{"departureCodes":["DEL","VIDP","DELHI"],"arrivalCodes":["DXB","OMDB","DXBAIRPORT"]}',
  //   refusal: null,
  //   annotations: [],
  //   parsed: {
  //     departureCodes: [ 'DEL', 'DELHI' ],
  //     arrivalCodes: [ 'DXB', 'DXBAIRPORT' ]
  //   }
  // }

  if (airportCodes?.parsed) {
    for (const code of airportCodes?.parsed.departureCodes) {
      if (code.length !== 3) {
        airportCodes.parsed.departureCodes.splice(airportCodes.parsed.departureCodes.indexOf(code), 1);
      }
    }
    for (const code of airportCodes?.parsed.arrivalCodes) {
      if (code.length !== 3) {
        airportCodes.parsed.arrivalCodes.splice(airportCodes.parsed.arrivalCodes.indexOf(code), 1);
      }
    }
  }

  console.log(airportCodes);
  return res.send(airportCodes);
});

export default app;