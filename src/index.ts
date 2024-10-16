import { QueueManager } from "./modules/concurentWorkersManager/";
import { ResponseHandler } from "./modules/scrapper";
import { runModule } from "./modules/runTimeHelpers/runModule";
import { queueUpLeaderboardPages } from "./modules/omegaStrikersLeaderboardInteractor";

import { MAX_CONCURRENT_WORKERS } from "../configs/config.json";

main();

async function main() {
  const responseHandler = new ResponseHandler();
  const queueSystem = new QueueManager(MAX_CONCURRENT_WORKERS);

  await runModule("queue up all leaderboard pages", async () => {
    await queueUpLeaderboardPages(queueSystem, responseHandler);
    await queueSystem.runQueue();
  });
}
