import { Observable, ReplaySubject } from 'rxjs';
import { z } from 'zod';
import { trackSchema, type TrackModel } from '../models/track';
import type { TrackedTrackModel } from '../models/trackedTrack';
import { webSocketMessageSchema } from './webSocketMessage';

export interface ApiService {
  searchForTracks: (search: string) => Promise<TrackModel[]>;
  addTrack: (uri: string) => Promise<void>;
  getTracks: () => Observable<TrackedTrackModel[]>;
}

export const makeApiService = (userName: string): ApiService => {
  const baseUrl = 'http://localhost:8080/';
  const socket = new WebSocket('ws://localhost:8080/websocket');

  const tracks = new ReplaySubject<TrackedTrackModel[]>();

  // Listen for messages
  socket.addEventListener('message', (event) => {
    const rawEventData = JSON.parse(event.data);
    const message = webSocketMessageSchema.safeParse(rawEventData);

    if (message.success) {
      const data: TrackedTrackModel[] = message.data.data;
      tracks.next(data);
    } else {
      console.error('Unknown websocket message', event.data);
    }
  });

  const searchForTracks = (search: string) => {
    const url = baseUrl + 'search/' + search;

    return fetch(url)
      .then((response) => response.json())
      .then((json) => z.array(trackSchema).parse(json));
  };

  const addTrack = (uri: string) => {
    const url = baseUrl + `user/${userName}/add-track/${uri}`;

    return fetch(url, { method: 'POST' }).then(() => {});
  };

  const getTracks = () => {
    return tracks;
  };

  return { searchForTracks, addTrack, getTracks };
};
