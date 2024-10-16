import { QueueManager } from "./modules/concurentWorkersManager/";

import { ResponseHandler } from "./modules/scrapper";

import logger from "./modules/logger/mainLogger";

const mainUrl = "https://stats.omegastrikers.gg/leaderboards?page=";

main();

async function main() {
  const responseHandler = new ResponseHandler();

  await runModule("test response getter", () =>
    responseHandler.connectToUrl(mainUrl, {
      fixLocalLinks: true,
      cacheResponse: {
        cacheresponseDirectory: "./cache",
        cacheResponseFileName: "test",
      },
    })
  );

  const queueSystem = new QueueManager(10);

  let testQueueSystem = async () => {
    for (let index = 0; index < 100; index++) {
      queueSystem.addToQueue(() =>
        responseHandler.connectToUrl(mainUrl + (index + 1).toString(), {
          fixLocalLinks: true,
          retry: 100,
          timeout: 10000,
          cacheResponse: {
            cacheresponseDirectory: "./cache",
            cacheResponseFileName: "leaderboard_" + (index + 1).toString(),
          },
        })
      );
    }
    runModule("test queue system", () => queueSystem.runQueue());
  };

  await testQueueSystem();
}

/**
 * Runs a given function and logs the result and time taken
 * @param name The name of the module to be run
 * @param func The function to be run
 * @returns A promise that resolves when the function has completed
 */
async function runModule(
  name: string,
  func: () => Promise<any>
): Promise<void> {
  const startTime = new Date();
  const result = await func();
  const endTime = new Date();
  logger.info(`${name} completed successfully\nRun time: ${(endTime.getTime() - startTime.getTime()) / 1000} seconds`);
}
