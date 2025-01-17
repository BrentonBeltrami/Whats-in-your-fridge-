import { z } from "zod";

export const INGREDIENT_ERRORS = {
  INCORRECT_IMAGE_TYPE:
    "Incorrect image type. Please upload a png, jpg, or webp image.",
  NULL_RESPONSE_FROM_OPENAI: "No response from OpenAI",
} as const;

export const uploadSchema = z.object({
  base64Image: z.string(),
});
