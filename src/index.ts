import { QueueManager } from "./modules/concurentWorkersManager";
import { ResponseHandler } from "./modules/scrapper";

const mainUrl = "https://stats.omegastrikers.gg/leaderboards?page=";

main();

function main() {
  const responseHandler = new ResponseHandler();

  runModule("test response getter", () =>
    responseHandler.connectToUrl(mainUrl, {
      fixLocalLinks: true,
      casheResponse: {
        casheresponseDirectory: "./cache",
        casheResponseFileName: "test",
      },
    })
  );
  const queueSystem = new QueueManager(10);

  let test = async () => {
    for (let index = 0; index < 400; index++) {
      queueSystem.addToQueue(() => responseHandler.connectToUrl(mainUrl + (index+1).toString(), {
        fixLocalLinks: true,
        casheResponse: {
          casheresponseDirectory: "./cache",
          casheResponseFileName: "leaderboard_" + (index+1).toString(),
        },
      }));
    }
    runModule("test que system", () => queueSystem.runQueue());
  };
  test();

  

  

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
  console.log(`${name} completed successfully`);
  console.log(
    `Run time: ${(endTime.getTime() - startTime.getTime()) / 1000} seconds`
  );
}
