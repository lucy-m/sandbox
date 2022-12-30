import { z } from 'zod';

export const artistModelSchema = z.object({
  name: z.string(),
});

export type ArtistModel = z.infer<typeof artistModelSchema>;
