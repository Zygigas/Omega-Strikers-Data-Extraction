import axios, { AxiosError, AxiosResponse } from "axios";
import { connectOptions } from ".";
import { fixLocalLinksInCashedSource } from "../fileFormating";

import logger from "../logger/mainLogger";
import { cacheDataToFiles } from "../fileHelpers/fileWriters/cacheDataToFiles";

export class ResponseHandler {
  /**
   * Connects to a given URL using axios and returns the response
   * @param url The url to connect to
   * @returns A promise that resolves with the response
   */
  async connectToUrl(
    url: string,
    fileIndex?: number,
    options?: connectOptions
  ): Promise<string | undefined> {
    let response: string;
    try {
      response = await axios.get<string>(url, { timeout: options?.timeout }).then(d => response = d.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (options?.retry) {
          logger.error(
            `Failed to connect to the website due to a ${error.response?.status} error. Retrying...\nRetries left: ${options.retry}`
          );
          options.retry -= 1;
          return this.connectToUrl(url,fileIndex,options);
        } else {
          logger.error(
            `Failed to connect to the website due to a ${error.response?.status} error. skipping...`
          );
          return;
        }
      } else {
        throw error;
      }
    }
    if (options?.fixLocalLinks) {
      response = fixLocalLinksInCashedSource(response, url);
    }
    if (options?.cacheResponse) {
      cacheDataToFiles(
        options.cacheResponse.cacheresponseDirectory,
        options.cacheResponse.cacheResponseFileName,
        fileIndex === undefined ? 0 : fileIndex,
        response,
        "html"
      )
    }
    return Promise.resolve(response);
  }
}
