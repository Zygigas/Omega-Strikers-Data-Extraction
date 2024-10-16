import { QueueManager } from "./modules/concurentWorkersManager/";
import { ResponseHandler } from "./modules/webResponse";
import { runModule } from "./modules/runTimeHelpers/runModule";

import { MAX_CONCURRENT_WORKERS } from "../configs/config.json";

import { readFileSync } from "fs";
import {
  scrapPlayerNameAndRank,
  scrapPlayerNameRankAndLinkFromCache,
} from "./modules/dataScrappers";

import { CACHE_DIRECTORY, CACHE_SUBFOLDERS } from "../configs/config.json";

import { queueUpLeaderboardPages } from "./modules/omegaStrikersLeaderboardInteractor";
import { cacheDataToFiles } from "./modules/fileHelpers/fileWriters";

main();
//testMain();

async function main() {
  const responseHandler = new ResponseHandler();
  const queueSystem = new QueueManager(MAX_CONCURRENT_WORKERS, false);

  await runModule("queue up all leaderboard pages", async () => {
    await queueUpLeaderboardPages(queueSystem, responseHandler);
    await queueSystem.runQueue();
  });

  await runModule("scrap player names and ranks", async () => {
    const players = await scrapPlayerNameRankAndLinkFromCache(
      CACHE_DIRECTORY + "/" + CACHE_SUBFOLDERS.LEADERBOARDS
    );
    players.forEach((element) => {
      cacheDataToFiles(
        CACHE_DIRECTORY + "/" + CACHE_SUBFOLDERS.PLAYERS_DATA,
        "player_",
        element.rank,
        element,
        "json"
      );
    });
  });
}

async function testMain() {
  await runModule("testScrapping player names and ranks", async () => {
    const html = readFileSync(
      "./cache/leaderboardPages/leaderboard_#1.html",
      "utf-8"
    );
    const result = await scrapPlayerNameAndRank(html);
    console.log(result);
  });

  await runModule("test scrapper from cache", async () => {
    console.log(
      await scrapPlayerNameRankAndLinkFromCache("./cache/leaderboardPages")
    );
  });
}
