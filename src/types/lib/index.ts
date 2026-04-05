export type FetchOptions = RequestInit & {
  params?: Record<string, string | number | boolean>;
};
