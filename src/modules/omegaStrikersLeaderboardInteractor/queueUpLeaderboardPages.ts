import { QueueManager } from "../concurentWorkersManager";
import { ResponseHandler } from "../webResponse";

import {
  MAINURL,
  CACHE_DIRECTORY,
  LEADERBOARD_PAGES,
  RETRY_COUNT,
  TIMEOUT,
} from "../../../configs/config.json";

export async function queueUpLeaderboardPages(
  queueSystem: QueueManager,
  responseHandler: ResponseHandler
) {
  let leaderboardTempQueue = [];
  for (let index = 0; index < LEADERBOARD_PAGES; index++) {
    leaderboardTempQueue.push(() =>
      responseHandler.connectToUrl(MAINURL + (index + 1).toString(), {
        fixLocalLinks: true,
        retry: RETRY_COUNT,
        timeout: TIMEOUT,
        cacheResponse: {
          cacheresponseDirectory: CACHE_DIRECTORY + "/leaderboardPages",
          cacheResponseFileName: "leaderboard_#" + (index + 1).toString(),
        },
      })
    );
  }
  queueSystem.addToQueue(leaderboardTempQueue);
}
