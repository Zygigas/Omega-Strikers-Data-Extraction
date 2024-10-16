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

import fs from "fs";

import { RETRY_COUNT, TIMEOUT } from "../configs/config.json";

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

  await runModule("Scrap Player Pages", async () => {
    let playerLinks = fs.readdirSync(
      CACHE_DIRECTORY + "/" + CACHE_SUBFOLDERS.PLAYERS_DATA
    );
    playerLinks = playerLinks.map((element) => {
      return JSON.parse(fs.readFileSync(CACHE_DIRECTORY + "/" + CACHE_SUBFOLDERS.PLAYERS_DATA + "/" + element, "utf-8")).link;
    });
    for (let i = 1; i < playerLinks.length+1; i++) {
      await queueSystem.addToQueue(async () => {
        await responseHandler.connectToUrl(playerLinks[i - 1], i, {
          retry: RETRY_COUNT,
          timeout: TIMEOUT,
          fixLocalLinks: true,
          cacheResponse: {
            cacheresponseDirectory:
              CACHE_DIRECTORY + "/" + CACHE_SUBFOLDERS.PLAYERS_PAGES,
            cacheResponseFileName: `player_`,
          },
        });
      })
    }
    await queueSystem.runQueue();
    });
  };

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
