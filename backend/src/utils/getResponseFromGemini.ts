import { GoogleGenerativeAI } from "@google/generative-ai";
import { ZodObject, ZodRawShape } from "zod";
import "dotenv/config";
import config from "../config";

export interface GeminiResponseProps {
  schema: ZodObject<ZodRawShape>,
  instruction: string,
  prompt: string,
}

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

// Helper function to create example structure from Zod schema
function createExampleFromSchema(schema: ZodObject<ZodRawShape>): any {
  const shape = schema.shape;
  const example: any = {};
  
  for (const [key, value] of Object.entries(shape)) {
    example[key] = createExampleValue(value as any, key);
  }
  
  return example;
}

function createExampleValue(zodType: any, fieldName?: string): any {
  if (zodType._def?.typeName === 'ZodString') {
    // Provide contextual examples based on field names
    if (fieldName === 'id') return "day-1";
    if (fieldName === 'title') return "Day 1: Arrival & Local Exploration";
    if (fieldName === 'color') return "#FF5733";
    if (fieldName === 'content') return "Hotel Check-in";
    if (fieldName === 'description') return "Check into hotel and get settled";
    return "example_string";
  } else if (zodType._def?.typeName === 'ZodNumber') {
    if (fieldName === 'maxActivities') return 10;
    return 42;
  } else if (zodType._def?.typeName === 'ZodArray') {
    const innerType = zodType._def.type;
    // For activitiesByDays, create exactly one example day
    if (fieldName === 'activitiesByDays') {
      return [createExampleValue(innerType)];
    }
    // For items array, create 2-3 example activities
    if (fieldName === 'items') {
      return [
        createExampleValue(innerType),
        createExampleValue(innerType)
      ];
    }
    // Default array with 2 items
    return [createExampleValue(innerType), createExampleValue(innerType)];
  } else if (zodType._def?.typeName === 'ZodObject') {
    const shape = zodType.shape;
    const example: any = {};
    for (const [key, value] of Object.entries(shape)) {
      example[key] = createExampleValue(value as any, key);
    }
    return example;
  } else {
    return "example_value";
  }
}

export async function getResponseFromGemini(props: GeminiResponseProps) {
  const maxRetries = 2;
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash",
        generationConfig: {
          temperature: attempt > 0 ? 0.3 : 0.7, // Lower temperature on retries
          responseMimeType: "application/json",
        }
      });

      // Create example structure to show Gemini exactly what we expect
      const exampleStructure = createExampleFromSchema(props.schema);
      
      // Create a comprehensive prompt that includes the instruction and schema information
      const fullPrompt = `
${props.instruction}

You must respond with a JSON object that follows this EXACT structure (with actual data, not the example values):

${JSON.stringify(exampleStructure, null, 2)}

User request: ${props.prompt}

CRITICAL INSTRUCTIONS:
1. Respond ONLY with valid JSON - no markdown, no explanations, no additional text
2. Every field in the schema MUST be present with appropriate values
3. Arrays must contain the exact number of items specified (${props.instruction.includes('numberOfDays') ? 'based on numberOfDays parameter' : ''})
4. All string fields must contain actual content, not empty strings
5. All required nested objects and arrays must be fully populated
${attempt > 0 ? `\n6. RETRY ATTEMPT ${attempt + 1}: Ensure all fields are properly filled with valid data` : ''}
`;

      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      let text = response.text();

      // Clean up any markdown formatting that might have slipped through
      text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

      // Parse and validate the JSON response
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(text);
      } catch (error) {
        throw new Error(`Invalid JSON response from Gemini: ${text.substring(0, 200)}...`);
      }

      // Validate against the schema
      const validatedResponse = props.schema.parse(parsedResponse);
      
      // Return in the same format as OpenAI function - directly return the message-like object
      return {
        parsed: validatedResponse,
        content: JSON.stringify(validatedResponse)
      };

    } catch (error) {
      lastError = error;
      console.error(`Gemini attempt ${attempt + 1} failed:`, error instanceof Error ? error.message : String(error));
      
      if (attempt === maxRetries) {
        break;
      }
      
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.error("All Gemini attempts failed. Last error:", lastError);
  throw lastError;
} 