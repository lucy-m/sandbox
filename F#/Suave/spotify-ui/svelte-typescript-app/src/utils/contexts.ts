import { getContext, setContext } from 'svelte';
import { z } from 'zod';
import type { ApiService } from '../services/api';

const keys = {
  apiService: Symbol(),
  userName: Symbol(),
};

const useInitialisableContext = <T>(name: string, key: symbol): T => {
  const value: T | undefined = getContext(key);

  if (!value) {
    throw new Error(`Context ${name} must be initialised before use`);
  }

  return value;
};

export const setUserName = (userName: string) =>
  setContext(keys.userName, userName);

export const useUserName = (): string =>
  useInitialisableContext('UserName', keys.userName);

export const setApiService = (apiService: ApiService) =>
  setContext(keys.apiService, apiService);

export const useApiService = (): ApiService =>
  useInitialisableContext('ApiService', keys.apiService);
