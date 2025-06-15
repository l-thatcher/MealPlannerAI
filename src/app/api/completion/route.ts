import { generateObject, NoObjectGeneratedError } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { MealPlannerFormData } from '@/types/interfaces';

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('OPENAI_API_KEY is not defined in environment variables');
}

const openai = createOpenAI({
  apiKey,
});

export async function POST(req: Request) {
  try {
    console.log('Received request to generate meal plan');

    const { formData }: { formData: MealPlannerFormData } = await req.json();

    // Construct the prompt string
    const promptText = `Generate a detailed exactly ${formData.days}-day meal plan with exactly ${formData.mealsPerDay} meals per day.
Do not provide extra or fewer meals or days.

Daily nutritional targets:
- Total Calories: ${formData.calories ? formData.calories : 2200} kcal
- Protein: ${formData.protein ? formData.protein : 150}g
- Carbs: ${formData.carbs ? formData.carbs : 200}g
- Fats: ${formData.fats ? formData.fats : 80}g

Requirements:
${formData.dietaryRestrictions.length ? `- Must follow: ${formData.dietaryRestrictions.join(', ')}\n` : ''}
${formData.preferredCuisines ? `- Include these cuisines: ${formData.preferredCuisines}\n` : ''}
${formData.excludedIngredients ? `- Exclude these ingredients: ${formData.excludedIngredients}\n` : ''}
- Cooking skill level: ${formData.skillLevel}

Each meal should:
1. Include a descriptive title
2. Have realistic macro distributions
3. Be appropriate for ${formData.skillLevel} skill level
4. Fit within daily calorie goal when combined
5. Meet all dietary restrictions

End response with exactly ${formData.days} items inside "days", and exactly ${formData.mealsPerDay} meals per day, no additional objects outside the array.
`;


    const systemPrompt = `
    STRICT RULES:
- You MUST return exactly ${formData.days} objects in the "days" array.
- Each day must include exactly ${formData.mealsPerDay} meals.
- No explanations. Respond with JSON only.
- Do not skip days or meals. Do not add commentary.

The response must be in this exact format:
{
  "days": [
    {
      "day": (day number),
      "meals": [
        {
          "name": (meal name),
          "title": (Meal Title),
          "cals": (meal calories),
          "macros": { "p": (meal protien), "c": (meal carbs), "f":  (meal fat)}
        },
        ...
      ]
    },
    ...
  ]
}

You are an expert nutritionist AI specializing in creating personalized meal plans. 
Your task is to generate EXACTLY ${formData.days} days of meals, with EXACTLY ${formData.mealsPerDay} meals per day.
The response MUST contain the exact number of days and meals specified.
Generate practical, portion-controlled meals that precisely match the given requirements and nutritional targets.`;

    console.log(promptText);

    const result = await generateObject({
      model: openai('gpt-4.1-nano'),
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
      schema: z.object({
        days: z.array(
          z.object({
            day: z.number().min(1).max(formData.days),
            meals: z.array(
              z.object({
                name: z.string().describe('Meal time (e.g., Breakfast, Lunch, Dinner)'),
                title: z.string().describe('Descriptive name of the meal'),
                cals: z.string().describe('Total calories for this meal'),
                macros: z.object({
                  p: z.number().min(0).describe('Protein in grams'),
                  c: z.number().min(0).describe('Carbohydrates in grams'),
                  f: z.number().min(0).describe('Fats in grams')
                }).describe('Macronutrients for this meal')
              })
            ).length(formData.mealsPerDay)
          })
        ).length(formData.days)
      })
    });

    console.log('Meal plan generated successfully:', result);

    return NextResponse.json({ success: true, data: result });

  } catch (error) {
    // console.error('Error generating meal plan:', error);

    if (NoObjectGeneratedError.isInstance(error)) {
        console.log('"""""""""""""""" NoObjectGeneratedError """"""""""""""""');
        console.log('Cause:', error.cause);
        console.log('Text:', error.text);
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