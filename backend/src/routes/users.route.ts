import { Router, Request, Response } from 'express';
import { saveTripToDatabase, getUserTripsWithPopulatedFields, TripData } from '../utils/tripHelpers';

const app = Router();

app.get('/', (req, res) => {
  res.send('this is the home page of user routes');
});

// POST /users/trips - Save a new trip
app.post('/trips', async (req: Request, res: Response): Promise<void> => {
  try {
    const tripData: TripData = req.body;

    // Validate required fields
    if (!tripData.userId) {
      res.status(400).json({
        success: false,
        error: 'userId is required'
      });
      return;
    }

    if (!tripData.departureLocation || !tripData.arrivalLocation) {
      res.status(400).json({
        success: false,
        error: 'departureLocation and arrivalLocation are required'
      });
      return;
    }

    const result = await saveTripToDatabase(tripData);

    if (result.success) {
      res.status(201).json({
        success: true,
        message: 'Trip saved successfully',
        tripId: result.tripId
      });
      return;
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to save trip',
        details: result.error
      });
      return;
    }
  } catch (error) {
    console.error('Error in POST /users/trips:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /users/:userId/trips - Get all trips for a user with populated fields
app.get('/:userId/trips', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({
        success: false,
        error: 'userId is required'
      });
      return;
    }

    const result = await getUserTripsWithPopulatedFields(userId);

    if (result.success) {
      res.status(200).json({
        success: true,
        trips: result.trips
      });
      return;
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch trips',
        details: result.error
      });
      return;
    }
  } catch (error) {
    console.error('Error in GET /users/:userId/trips:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default app;