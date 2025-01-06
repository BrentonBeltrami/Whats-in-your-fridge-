## Chosen Tech Stack:

I built this using createT3Stack. Primarily to added the tRPC boilerplate. I also added react-hook-form & a few shadcn-ui components.

I chose to add tRPC because it allows for rapid iteration while maintaining type-safety of api requests. It also helps enforce validation as the shape of the api is defined using Zod. I have commonly used Drizzle, tRPC & tanstack form/react-hook-form with a single Zod validation to have end to end type-safety.

The model I am using is OpenAI's gpt-4o. Primarily due to ease of use. I deployed to vercel, also due to ease of use & I already had an account.
