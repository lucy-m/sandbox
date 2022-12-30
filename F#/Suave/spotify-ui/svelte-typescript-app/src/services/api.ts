import { type TrackModel, trackModelSchema } from '../models/track';
import { z } from 'zod';

export interface ApiService {
  searchForTracks: (search: string) => Promise<TrackModel[]>;
}

export const apiService: ApiService = (() => {
  const baseUrl = 'http://localhost:8080/';

  const searchForTracks = (search: string) => {
    const url = baseUrl + 'search/' + search;

    return fetch(url)
      .then((response) => response.json())
      .then((json) => z.array(trackModelSchema).parse(json));
  };

  return { searchForTracks };
})();
