import { Router, Request, Response } from 'express';
import { saveTripToDatabase, getUserTripsWithPopulatedFields, TripData } from '../utils/tripHelpers';
import supabase from '../utils/supabase';

const app = Router();

app.get('/', (req, res) => {
  res.send('this is the home page of user routes');
});

// POST /users - Create a new user
app.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, email, first_name, last_name } = req.body;

    // Validate required fields
    if (!id) {
      res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
      return;
    }

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking existing user:', checkError);
      res.status(500).json({
        success: false,
        error: 'Failed to check existing user'
      });
      return;
    }

    if (existingUser) {
      res.status(200).json({
        success: true,
        message: 'User already exists',
        user: existingUser
      });
      return;
    }

    // Create new user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        id,
        email,
        first_name,
        last_name
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating user:', insertError);
      res.status(500).json({
        success: false,
        error: 'Failed to create user',
        details: insertError.message
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: newUser
    });
  } catch (error) {
    console.error('Error in POST /users:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /users/:userId - Get user by ID
app.get('/:userId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
      return;
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }
      
      console.error('Error fetching user:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user'
      });
      return;
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error in GET /users/:userId:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// POST /users/clerk-webhook - Handle Clerk webhooks
app.post('/clerk-webhook', async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, data } = req.body;

    if (type === 'user.created') {
      const { id, email_addresses, first_name, last_name } = data;
      const primaryEmail = email_addresses?.find((email: any) => email.id === data.primary_email_address_id);

      // Create user in Supabase
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id,
          email: primaryEmail?.email_address || null,
          first_name: first_name || null,
          last_name: last_name || null
        });

      if (insertError && insertError.code !== '23505') { // 23505 is unique constraint violation (user already exists)
        console.error('Error creating user from webhook:', insertError);
        res.status(500).json({
          success: false,
          error: 'Failed to create user'
        });
        return;
      }

      console.log(`User created from webhook: ${id}`);
    } else if (type === 'user.updated') {
      const { id, email_addresses, first_name, last_name } = data;
      const primaryEmail = email_addresses?.find((email: any) => email.id === data.primary_email_address_id);

      // Update user in Supabase
      const { error: updateError } = await supabase
        .from('users')
        .update({
          email: primaryEmail?.email_address || null,
          first_name: first_name || null,
          last_name: last_name || null
        })
        .eq('id', id);

      if (updateError) {
        console.error('Error updating user from webhook:', updateError);
        res.status(500).json({
          success: false,
          error: 'Failed to update user'
        });
        return;
      }

      console.log(`User updated from webhook: ${id}`);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in clerk webhook:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
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