export const mapResponse = async <T = any>(response: Response): Promise<T> => {
  await handleError(response);
  return response.json();
};

export const handleError = async (response: Response) => {
  if (response.ok) {
    return;
  }
  throw new Error((await response.json())?.error ?? response.statusText);
};
