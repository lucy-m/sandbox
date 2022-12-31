import { type TrackModel, trackSchema } from '../models/track';
import { z } from 'zod';
import {
  trackedTrackSchema,
  type TrackedTrackModel,
} from '../models/trackedTrack';

export interface ApiService {
  searchForTracks: (search: string) => Promise<TrackModel[]>;
  addTrack: (userName: string, uri: string) => Promise<void>;
  getTracks: () => Promise<TrackedTrackModel[]>;
}

export const apiService: ApiService = (() => {
  const baseUrl = 'http://localhost:8080/';

  const searchForTracks = (search: string) => {
    const url = baseUrl + 'search/' + search;

    return fetch(url)
      .then((response) => response.json())
      .then((json) => z.array(trackSchema).parse(json));
  };

  const addTrack = (userName: string, uri: string) => {
    const url = baseUrl + `user/${userName}/add-track/${uri}`;

    return fetch(url, { method: 'POST' }).then(() => {});
  };

  const getTracks = () => {
    const url = baseUrl + 'tracks';

    return fetch(url)
      .then((response) => response.json())
      .then((json) => z.array(trackedTrackSchema).parse(json));
  };

  return { searchForTracks, addTrack, getTracks };
})();
