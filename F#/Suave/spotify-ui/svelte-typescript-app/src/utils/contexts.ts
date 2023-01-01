import { getContext, setContext } from 'svelte';
import type { ApiService } from '../services/api';

const keys = {
  apiService: Symbol(),
};

export const setApiService = (apiService: ApiService) =>
  setContext(keys.apiService, apiService);
export const useApiService = (): ApiService => {
  const service: ApiService | undefined = getContext(keys.apiService);

  if (!service) {
    throw new Error('ApiService must be initialised before use');
  }

  return service;
};
