import express from 'express';
import travelplanRoute from './routes/travelplan.route';
import userRoute from './routes/users.route';
import utilRoute from './routes/util.route';
import cors from 'cors';

import { createClient } from '@supabase/supabase-js'
import config from './config';
import { getHotelPhotoUrl } from './utils/google-maps';
import { getTripActivities } from './utils/getTripActivities';
import { Database } from './supabase';

// Create a single supabase client for interacting with your database
const supabase = createClient<Database>(config.supabaseUrl, config.supabaseApiKey)

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World 2!');
});

app.use('/travelplan', travelplanRoute);
app.use('/users', userRoute);
app.use('/util', utilRoute);


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


