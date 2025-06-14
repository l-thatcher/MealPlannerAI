import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import { NextResponse } from 'next/server';

const openai = createOpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { prompt, maxDays = 7 }: { prompt: string; maxDays?: number } = await req.json();

  const result = await generateObject({
    model: openai('gpt-4.1-nano'),
    system: 'You generate detailed meal plans with macronutrient information.',
    prompt,
    schema: z.object({
      days: z.array(
        z.object({
          day: z.number().min(1).max(maxDays),
          meals: z.array(
            z.object({
              name: z.string().describe('meal time (Breakfast/Lunch/Dinner)'),
              title: z.string().describe('name of the meal'),
              macros: z.object({
                p: z.number().describe('protein in grams'),
                c: z.number().describe('carbohydrates in grams'),
                f: z.number().describe('fat in grams')
              })
            })
          )
        })
      )
    }),
  });

    return NextResponse.json(result);
}