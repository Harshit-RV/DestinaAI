import { configDotenv } from 'dotenv';
configDotenv()

export default {
    supabaseApiKey: process.env.SUPABASE_API_KEY || '',
    supabaseUrl: process.env.SUPABASE_URL || '',
};