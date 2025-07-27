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

const prompt = ""

export async function getResponseFromOpenAI(props: OpenAIResponseProps) {
  try {
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4.1",
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