## Chosen Tech Stack:

This is built on top of createT3App. This stack has a high emphasis on type-safety with the addition of tRPC & drizzle.

I chose to add tRPC because it allows for rapid iteration while maintaining type-safety of api requests. It also helps enforce validation as the shape of the api is defined using Zod. I have commonly used Drizzle, tRPC & tanstack form with a single Zod validation to have end to end type-safety.

I have also added tanstack form due to a lot of the same type safety concerns stated above. This could be easily replaced by react-hook-form
