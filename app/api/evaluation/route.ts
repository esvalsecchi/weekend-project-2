import OpenAI from "openai";
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { joke } = await req.json();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an AI trained to evaluate jokes. Analyze the given joke and provide an evaluation based on its humor, appropriateness, and potential offensiveness."
        },
        {
          role: "user",
          content: `Evaluate this joke: "${joke}". Respond with a JSON object containing three boolean properties: funny, appropriate, and offensive.`
        }
      ],
     // temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    const evaluation = content ? JSON.parse(content) : null;

    return NextResponse.json(evaluation || { error: 'Invalid response' });
  } catch (error) {
    console.error('Error evaluating joke:', error);
    return NextResponse.json({ error: 'Failed to evaluate joke' }, { status: 500 });
  }
}