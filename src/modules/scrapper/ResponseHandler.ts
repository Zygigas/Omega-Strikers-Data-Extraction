import axios, { AxiosError, AxiosResponse } from "axios";
import { connectOptions } from ".";
import fs from "fs";
import { fixLocalLinksInCashedSource } from "../fileFormating";

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
          console.log(
            `Failed to connect to the website due to a ${error.response?.status} error. Retrying...`
          );
          console.log(`Retries left: ${options.retry}`);
          options.retry -= 1;
          return this.connectToUrl(url, options);
        } else {
          console.log(
            `Failed to connect to the website due to a ${error.response?.status} error. skipping...`
          );
          return;
        }
      } else {
        throw error;
      }
    }

    if (options?.casheResponse) {
      const directory = options?.casheResponse.casheresponseDirectory;
      const FileName = options?.casheResponse.casheResponseFileName;

      // fixes the local hrefs in the html
      response.data = fixLocalLinksInCashedSource(
        response.data,
        url
      );

      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
      }
      fs.writeFileSync(`${directory}/${FileName}.html`, response.data);
    }
    return response;
  }
}
