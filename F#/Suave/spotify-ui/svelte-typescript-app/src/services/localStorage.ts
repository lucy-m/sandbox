export interface LocalStorageService {
  setName: (s: string) => void;
  getName: () => string | undefined;
}

export const localStorageService: LocalStorageService = (() => {
  const keys = {
    name: 'NAME',
  };

  const setName = (s: string) => {
    localStorage.setItem(keys.name, s);
  };
  const getName = () => localStorage.getItem(keys.name) ?? undefined;

  return { setName, getName };
})();
