import { configDotenv } from 'dotenv';
configDotenv()

export default {
    supabaseApiKey: process.env.SUPABASE_API_KEY || '',
    supabaseUrl: process.env.SUPABASE_URL || '',
    openAiApiKey: process.env.OPENAI_API_KEY || '',
    serpApiKey: process.env.SERP_API_KEY || 'b0a637e3f3e76077613fab81afef2df0bde2fbf0897f016893abed7d9011a1b4',
    amadeusApiKey: process.env.AMADEUS_API_KEY || '',
};
