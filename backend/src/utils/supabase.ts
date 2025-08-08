import { createClient } from '@supabase/supabase-js';
import config from '../config';
import { Database } from '../supabase';

const supabase = createClient<Database>(
  config.supabaseUrl,
  config.supabaseApiKey
);

export default supabase;