import { z } from 'zod';

export const imageModelSchema = z.object({
  url: z.string(),
  height: z.number().optional(),
  width: z.number().optional(),
});

export type ImageModel = z.infer<typeof imageModelSchema>;
