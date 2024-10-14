export type connectOptions = {
  fixLocalLinks?: boolean;
  casheResponse?: {
    casheresponseDirectory: string;
    casheResponseFileName: string;
  };
  retry?: number;
  timeout?: number;
};
