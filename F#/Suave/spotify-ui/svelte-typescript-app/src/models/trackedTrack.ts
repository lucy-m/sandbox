import { z } from 'zod';
import { trackSchema } from './track';

export const trackingInfoSchema = z.object({
  addedBy: z.string(),
});

export const trackedTrackSchema = z.object({
  track: trackSchema,
  info: trackingInfoSchema.nullable(),
});

export type TrackedTrackModel = z.infer<typeof trackedTrackSchema>;
