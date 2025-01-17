import OpenAI from "openai";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "~/env";
import { INGREDIENT_ERRORS, uploadSchema } from "../validations/ingredient";

const prompt = `
You're a professional chef. You can analyze any fridge or pantry and estimate the quantity of ingredients in it.
Only provide the list ingredients that are visible in the image. No intro or conclusion is needed.
I need you to identify the ingredients in this image of a fridge or pantry. 
I would like you to organize them by categories & give me the aproximate quantity of each ingredient. 
Please provide the information in a markdown format with each of the categories formatted in bold.
Provide a sample recipe that can be made with the ingredients in the image after a line break.
If there are no ingredients in the image provided, please respond with 'There are no ingredients in the image provided, please upload a new one or take a clearer photo. Thank you.'
`;

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
export const ingredient = createTRPCRouter({
  submitAttachment: publicProcedure
    .input(uploadSchema)
    .mutation(async ({ input }) => {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: input.base64Image,
                },
              },
            ],
          },
        ],
      });

      if (response == null)
        throw new Error(INGREDIENT_ERRORS.NULL_RESPONSE_FROM_OPENAI);
      if (response.choices?.[0]?.message?.content) {
        return response.choices[0].message.content;
      }
    }),
});
