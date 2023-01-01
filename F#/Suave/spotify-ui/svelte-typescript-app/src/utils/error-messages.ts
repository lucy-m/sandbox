const errorMessages: Record<string, string> = {
  alreadyAdded: 'That track has already been added',
};

export const translateErrorMessage = (key: string): string => {
  return errorMessages[key] ?? key;
};
