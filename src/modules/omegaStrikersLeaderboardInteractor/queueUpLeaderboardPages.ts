import { QueueManager } from "../concurentWorkersManager";
import { ResponseHandler } from "../webResponse";

import {
  MAINURL,
  CACHE_DIRECTORY,
  LEADERBOARD_PAGES,
  RETRY_COUNT,
  TIMEOUT,
  CACHE_SUBFOLDERS
} from "../../../configs/config.json";

export async function queueUpLeaderboardPages(
  queueSystem: QueueManager,
  responseHandler: ResponseHandler
) {
  let leaderboardTempQueue = [];
  for (let index = 0; index < LEADERBOARD_PAGES; index++) {
    leaderboardTempQueue.push(() =>
      responseHandler.connectToUrl(
        `${MAINURL}${index + 1}`,
        index,
        {
          retry: RETRY_COUNT,
          timeout: TIMEOUT,
          fixLocalLinks: true,
          cacheResponse: {
            cacheresponseDirectory: CACHE_DIRECTORY + "/" + CACHE_SUBFOLDERS.LEADERBOARDS,
            cacheResponseFileName: `leaderboard_`,
          }
        }
      )
    );
  }
  queueSystem.addToQueue(leaderboardTempQueue);
}
