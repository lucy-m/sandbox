import { z } from 'zod';

export const trackModelSchema = z.object({
  id: z.string(),
  uri: z.string(),
  name: z.string(),
});

export type TrackModel = z.infer<typeof trackModelSchema>;
