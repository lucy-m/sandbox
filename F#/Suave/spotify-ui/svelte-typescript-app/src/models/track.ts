import { z } from 'zod';
import { albumModelSchema } from './album';
import { artistModelSchema } from './artist';

export const trackSchema = z.object({
  uri: z.string(),
  name: z.string(),
  artists: z.array(artistModelSchema),
  album: albumModelSchema,
});

export type TrackModel = z.infer<typeof trackSchema>;
