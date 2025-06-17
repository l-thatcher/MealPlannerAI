import { NoObjectGeneratedError } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';
import { mealPlanSchema } from './use-object/mealPlanSchema';
import { streamObject } from 'ai';
import { getUserPrompt, getSystemPrompt } from './prompts';


const apiKey = process.env.OPENAI_API_KEY;

export const maxDuration = 30;
export const preferredRegion = 'auto';


if (!apiKey) {
  throw new Error('OPENAI_API_KEY is not defined in environment variables');
}

const openai = createOpenAI({
  apiKey,
});


export async function POST(req: Request) {
  try {
    console.log('Received request to generate meal plan');

    const body = await req.json();
    // When using useObject's submit, the data comes directly in the body
    const formData = body;


    console.log(getUserPrompt(formData));

    const result = streamObject({
      model: openai('gpt-4.1-mini'),
      temperature: 1.1,
      // frequencyPenalty: 0.1,
      // maxTokens: 512,
      messages: [
        {
          role: 'system',
          content: getSystemPrompt(formData)
        },
        {
          role: 'user',
          content: getUserPrompt(formData)
        }
      ],
      schema: mealPlanSchema(formData),
    });

    console.log('Stream object created successfully');
    return result.toTextStreamResponse();

  } catch (error: unknown) {
    // Type guard for Error objects
    if (error instanceof Error) {
      console.error('Stream generation error:', {
        error: error.message,
        cause: error.cause,
        stack: error.stack
      });
    } else {
      console.error('Unknown error:', error);
    }

    if (NoObjectGeneratedError.isInstance(error)) {
      console.log('"""""""""""""""" NoObjectGeneratedError """"""""""""""""');
      console.log('Cause:', (error as NoObjectGeneratedError).cause);
      console.log('Text:', JSON.stringify((error as NoObjectGeneratedError).text, null, 2));
      console.log('Response:', (error as NoObjectGeneratedError).response);
      console.log('Usage:', (error as NoObjectGeneratedError).usage);
      
      return NextResponse.json({
        success: false,
        error: 'Failed to generate a valid meal plan. Please try again.'
      }, { status: 422 });
    } else {
      console.error('Error generating meal plan:', 
        error instanceof Error ? error.message : 'Unknown error');
    }

    return NextResponse.json(
      { success: false, error: 'Failed to generate meal plan' },
      { status: 500 }
    );
  }
}