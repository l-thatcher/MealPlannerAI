import { NoObjectGeneratedError } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';
import { mealPlanSchema } from './use-object/mealPlanSchema';
import { streamObject } from 'ai';


const apiKey = process.env.OPENAI_API_KEY;

export const maxDuration = 30;


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

    // Construct the prompt string
    const promptText = [
      `Generate a detailed exactly ${formData.days}-day meal plan with exactly ${formData.mealsPerDay} meals per day.`,
      'Do not provide extra or fewer meals or days.',
      '',
      'Daily nutritional targets:',
      `- Total Calories: ${formData.calories ? formData.calories : 2200} kcal`,
      `- Protein: ${formData.protein ? formData.protein : 150}g`,
      `- Carbs: ${formData.carbs ? formData.carbs : 200}g`,
      `- Fats: ${formData.fats ? formData.fats : 80}g`,
      '',
      'Requirements:',
      formData.dietaryRestrictions.length ? `- Must follow: ${formData.dietaryRestrictions.join(', ')}` : '',
      formData.preferredCuisines ? `- Include these cuisines: ${formData.preferredCuisines}` : '',
      formData.excludedIngredients ? `- Exclude these ingredients: ${formData.excludedIngredients}` : '',
      `- Cooking skill level: ${formData.skillLevel}`,
      '',
      'Each meal should:',
      '1. Include a descriptive title',
      '2. Have realistic macro distributions',
      `3. Be appropriate for ${formData.skillLevel} skill level`,
      '4. Fit within daily calorie goal when combined',
      '5. Meet all dietary restrictions',
      '',
      `End response with exactly ${formData.days} items inside "days", and exactly ${formData.mealsPerDay} meals per day, no additional objects outside the array.`,
      'Do not include any commentary, filler text, or strings in place of expected objects.',
      'The final output must match the exact JSON structure described. Do not return null or strings inside arrays.'
    ].filter(Boolean).join('\n');


    const systemPrompt = [
      'You are an expert nutritionist AI specializing in creating personalized meal plans.',
      'Generate a properly formatted JSON object with no trailing commas, proper nesting, and valid syntax.',
      '',
      'STRICT FORMAT RULES:',
      '1. Each day object must look exactly like this:',
      '{',
      '  "day": 1,',
      '  "meals": [',
      '    {',
      '      "name": "string",',
      '      "title": "string",',
      '      "cals": "string",',
      '      "macros": {',
      '        "p": number,',
      '        "c": number,',
      '        "f": number',
      '      }',
      '    }',
      '  ]',
      '}',
      '',
      'CRITICAL REQUIREMENTS:',
      `- Must have exactly ${formData.days} days in sequential order`,
      `- Each day must have exactly ${formData.mealsPerDay} meals`,
      '- All numbers must be actual numbers, not strings (except cals)',
      '- No comments, trailing commas, or extra whitespace',
      '- Must be valid parseable JSON',
      '- All properties must use double quotes',
      '- Meals array must be properly nested inside each day object'
    ].filter(Boolean).join('\n');  

    console.log(promptText);

    const result = streamObject({
      model: openai('gpt-4.1-nano'),
      // output: 'array',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: promptText
        }
      ],
      schema: mealPlanSchema(formData),
    });

    return result.toTextStreamResponse();

  } catch (error) {
    // console.error('Error generating meal plan:', error);

    if (NoObjectGeneratedError.isInstance(error)) {
        console.log('"""""""""""""""" NoObjectGeneratedError """"""""""""""""');
        console.log('Cause:', error.cause);
        console.log('Text:', JSON.stringify(error.text, null, 2));
        console.log('Response:', error.response);
        console.log('Usage:', error.usage);
    } else {
        console.error('Error generating meal plan:', error);
    }

    return NextResponse.json(
      { success: false, error: 'Failed to generate meal plan' },
      { status: 500 }
    );
  }
}