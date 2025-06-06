import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { ZodObject, ZodRawShape } from "zod";
import "dotenv/config";
import config from "../config";

export interface OpenAIResponseProps {
  schema: ZodObject<ZodRawShape>,
  instruction: string,
  prompt: string,
}

const openai = new OpenAI({
  apiKey: config.openAiApiKey,
});

const prompt = "You are a travel agent that makes itneraries that are enjoyable, budget friendly and fun at the same time. You'll be given start date, end date, location, budget, interets. The plans should fit into the dates provided including any holdiays or festivals occurring in the desired loaction at that time. Make sure to consider the kind of weather the given location will have based on the dates provided."

export async function getResponseFromOpenAI(props: OpenAIResponseProps) {
  try {
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: props.prompt,
        },
      ],
      response_format: zodResponseFormat(props.schema, "schema"),
    });

    const res = completion.choices[0].message;
    return res;
  } catch (error) {
    console.error("Error getting data from Open AI:", error);
  }
}