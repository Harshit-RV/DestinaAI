import express from 'express';
import travelplanRoute from './routes/travelplan.route';
import userRoute from './routes/users.route';
import utilRoute from './routes/util.route';
import cors from 'cors';

import { createClient } from '@supabase/supabase-js'
import config from './config';
import { getHotelPhotoUrl } from './utils/google';
import { getTripActivities } from './utils/getTripActivities';

// Create a single supabase client for interacting with your database
const supabase = createClient(config.supabaseUrl, config.supabaseApiKey)

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World 2!');
});

app.use('/travelplan', travelplanRoute);
app.use('/users', userRoute);
app.use('/util', utilRoute);

// (async () => {
//   const response = await getTripActivities({
//     arrivalCityName: 'New Delhi',
//     interests: ['sightseeing'],
//     numberOfChildren: 0,
//     numberOfAdults: 2,
//     arrivalTime: '2025-08-09 21:30',
//     departureTime: '2025-08-19 21:30',
//     hotelName: 'Hyatt Centric, Janakpuri',
//     hotelLatitude: 28.6289,
//     hotelLongitude: 77.0785,
//   });
//   console.log(response);
// })();


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// weather app
// database connection


