import axios, { AxiosError, AxiosResponse } from "axios";
import { connectOptions } from ".";
import fs from "fs";
import { fixLocalLinksInCashedSource } from "../fileFormating";

import logger from "../logger/mainLogger";

export class ResponseHandler {
  /**
   * Connects to a given URL using axios and returns the response
   * @param url The url to connect to
   * @returns A promise that resolves with the response
   */
  async connectToUrl(
    url: string,
    options?: connectOptions
  ): Promise<AxiosResponse | undefined> {
    let response: AxiosResponse;
    try {
      response = await axios.get(url, { timeout: options?.timeout });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (options?.retry) {
          logger.error(
            `Failed to connect to the website due to a ${error.response?.status} error. Retrying...\nRetries left: ${options.retry}`
          );
          options.retry -= 1;
          return this.connectToUrl(url, options);
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
      response.data = fixLocalLinksInCashedSource(response.data, url);
    }
    if (options?.cacheResponse) {
      const directory = options?.cacheResponse.cacheresponseDirectory;
      const FileName = options?.cacheResponse.cacheResponseFileName;

      function makeSureWholePathExists(path: string) {
        if (!fs.existsSync(path)) {
          makeSureWholePathExists(path.substring(0, path.lastIndexOf("/")));
          fs.mkdirSync(path);
        }
      }

      makeSureWholePathExists(directory);
      fs.writeFileSync(`${directory}/${FileName}.html`, response.data);
    }
    return response;
  }
}
