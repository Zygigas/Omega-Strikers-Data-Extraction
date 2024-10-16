export type connectOptions = {
  fixLocalLinks?: boolean;
  cacheResponse?: {
    cacheresponseDirectory: string;
    cacheResponseFileName: string;
  };
  retry?: number;
  timeout?: number;
};
