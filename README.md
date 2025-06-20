# plAIte

plAIte is an AI-powered meal planning application built with [Next.js](https://nextjs.org), leveraging OpenAI for intelligent meal plan generation and Supabase for authentication and data storage. Users can generate, save, and manage personalized meal plans tailored to their dietary needs, preferences, and nutrition goals.

---

## Features

- **AI Meal Plan Generation**: Create detailed meal plans for up to 14 days, with customizable meals per day, calorie/macro targets, dietary restrictions, and preferred cuisines.
- **User Authentication**: Secure sign-up, login, and email verification via Supabase.
- **Save & Manage Plans**: Save generated meal plans to your account, view, and delete them at any time.
- **Shopping List**: Automatically generated, categorized shopping lists for each plan.
- **Responsive UI**: Modern, mobile-friendly interface with interactive components.
- **Role-based Limits**: Daily token usage limits based on user role (guest, basic, pro).

---

## Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/l-thatcher/MealPlannerAI.git
cd plAIte
```

### 2. Install Dependencies

```sh
npm install
# or
yarn install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory and add the following:

```
OPENAI_API_KEY=your-openai-api-key
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> You may also want to set up `.env.development.local` for local overrides.

### 4. Run the Development Server

```sh
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to use plAIte.

---

## Project Structure

```
src/
  app/                # Next.js app directory (routing, API routes, pages)
    api/              # API endpoints (meal plan generation, save, delete, etc.)
    (auth-pages)/     # Authentication pages (login, sign-up, verify)
    ...
  components/         # React UI components (forms, results, shopping list, etc.)
  lib/                # Utility libraries (actions, helpers)
  types/              # TypeScript interfaces and types
  utils/              # Supabase and other utility functions
public/               # Static assets
```

---

## Key Technologies

- **Next.js** (App Router)
- **React** (Client Components)
- **OpenAI API** (Meal plan generation)
- **Supabase** (Auth, database, storage)
- **Radix UI** (Accessible UI primitives)
- **Tailwind CSS** (Styling)
- **TypeScript** (Type safety)

---

## Deployment

The easiest way to deploy plAIte is on [Vercel](https://vercel.com/):

1. Push your repository to GitHub.
2. Import your project into Vercel.
3. Set the required environment variables in the Vercel dashboard.
4. Deploy!

See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Customization

- **OpenAI Model**: You can adjust available models and limits in [`src/components/meal-planner-form.tsx`](src/components/meal-planner-form.tsx) and [`src/app/api/generateMealPlan/route.ts`](src/app/api/generateMealPlan/route.ts).
- **Token Limits**: Role-based daily token limits are enforced in [`src/app/api/generateMealPlan/route.ts`](src/app/api/generateMealPlan/route.ts).
- **UI Styling**: Modify [`src/app/globals.css`](src/app/globals.css) and component classes for custom themes.

---
