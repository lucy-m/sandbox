import { z } from 'zod';
import { trackedTrackSchema } from '../models/trackedTrack';

export const webSocketMessageSchema = z.discriminatedUnion('tag', [
  z.object({
    tag: z.literal('playlistItems'),
    data: z.array(trackedTrackSchema),
  }),
]);

export type WebSocketMessage = z.infer<typeof webSocketMessageSchema>;
