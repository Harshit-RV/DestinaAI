import { configDotenv } from 'dotenv';
configDotenv()

export default {
    supabaseApiKey: process.env.SUPABASE_API_KEY || '',
    supabaseUrl: process.env.SUPABASE_URL || '',
    openAiApiKey: process.env.OPENAI_API_KEY || '',
    serpApiKey: process.env.SERP_API_KEY || '',
    amadeusClientId: process.env.AMADEUS_CLIENT_ID || '',
    amadeusClientSecret: process.env.AMADEUS_CLIENT_SECRET || '',
};
