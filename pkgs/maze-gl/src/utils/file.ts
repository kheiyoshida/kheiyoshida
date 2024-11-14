export const loadFileContent = async (path: string) => {
  const response = await fetch(path);
  return response.text();
}
