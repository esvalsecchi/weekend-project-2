import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {
  const { topic, type, tone, temperature } = await req.json();

  const systemPrompt = `You are a talented comedian tasked with creating a joke. Create a ${type} joke about ${topic} with a ${tone} tone. Use a temperature of ${temperature} for creativity.`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: `Create a ${type} joke about ${topic} with a ${tone} tone. Use a temperature of ${temperature} for creativity.`,
      },
    ],
    temperature: parseFloat(temperature),
  });
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  const reader = stream.getReader();
  let joke = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    joke += new TextDecoder().decode(value);
  }

  // Process the joke to remove any unwanted formatting and quotation marks
  const processedJoke = joke
    .split(/\d+:/)
    .map(part => part.trim().replace(/^"|"$/g, ''))
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .replace(/\\"/g, '"')  // Replace \" with "
    .replace(/\\n/g, '\n')  // Replace \n with actual newlines
    .replace(/\s+/g, ' ')  // Replace multiple spaces with a single space
    .trim();

  return new Response(processedJoke, {
    headers: { 'Content-Type': 'text/plain' }
  });
}