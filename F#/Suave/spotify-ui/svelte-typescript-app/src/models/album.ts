import { z } from 'zod';
import { imageModelSchema } from './image';

export const albumModelSchema = z.object({
  name: z.string(),
  images: z.array(imageModelSchema),
});
