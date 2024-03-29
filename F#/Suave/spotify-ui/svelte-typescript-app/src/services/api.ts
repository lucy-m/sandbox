import { Observable, ReplaySubject } from 'rxjs';
import { z } from 'zod';
import { trackSchema, type TrackModel } from '../models/track';
import type { TrackedTrackModel } from '../models/trackedTrack';
import { translateErrorMessage } from '../utils/error-messages';
import { webSocketMessageSchema } from './webSocketMessage';

export interface ApiService {
  searchForTracks: (search: string) => Promise<TrackModel[]>;
  addTrack: (uri: string) => Promise<void>;
  deleteTrack: (uri: string) => Promise<void>;
  getTracks: () => Observable<TrackedTrackModel[]>;
}

export const makeApiService = (
  userName: string,
  onError: (s: string) => void
): ApiService => {
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

  const checkForError = (res: Response) => {
    if (!res.ok) {
      return res.text().then((errText) => {
        onError(translateErrorMessage(errText));
      });
    }
  };

  const searchForTracks = (search: string) => {
    const url = baseUrl + 'search/' + search;

    return fetch(url)
      .then((response) => response.json())
      .then((json) => z.array(trackSchema).parse(json));
  };

  const addTrack = (uri: string) => {
    const url = baseUrl + `user/${userName}/track/${uri}`;

    return fetch(url, { method: 'POST' }).then(checkForError);
  };

  const getTracks = () => {
    return tracks;
  };

  const deleteTrack = (uri: string): Promise<void> => {
    const url = baseUrl + `user/${userName}/remove-track/${uri}`;

    return fetch(url, { method: 'POST' }).then(checkForError);
  };

  return { searchForTracks, addTrack, getTracks, deleteTrack };
};
