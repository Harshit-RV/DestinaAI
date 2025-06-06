import { configDotenv } from 'dotenv';
configDotenv()

export default {
    supabaseApiKey: process.env.SUPABASE_API_KEY || '',
    supabaseUrl: process.env.SUPABASE_URL || '',
    openAiApiKey: process.env.OPENAI_API_KEY || '',
    serpApiKey: process.env.SERP_API_KEY || '',
    amadeusApiKey: process.env.AMADEUS_API_KEY || '',
};
