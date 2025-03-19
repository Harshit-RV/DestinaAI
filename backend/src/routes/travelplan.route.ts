import { Router } from 'express';

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

app.post('/create', (req, res) => {
  console.log(req.body);
  // if (!req.body.destination || !req.body.startDate || !req.body.endDate || !req.body.note) {
  //   res.status(400).json({error: 'Please provide destination, startDate, and endDate, note'});
  //   return;
  // }

  // const travelplan: TravelPlan = {
  //   id: travelplans.length + 1,
  //   destination: String(req.body.destination),
  //   startDate: String(req.body.startDate),
  //   endDate: String(req.body.endDate),
  //   note: String(req.body.note),
  // };

  // travelplans.push(travelplan);
  // res.status(200).json(travelplan);
});

app.get('/list', (req, res) => {
  res.json(travelplans);
});

export default app;