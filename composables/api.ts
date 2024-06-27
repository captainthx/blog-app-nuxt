export const myFetch: typeof useFetch = (path, option = {}) => {
  const config = useRuntimeConfig();

  option.baseURL = config.public.baseURL;

  return useFetch(path, option);
};
