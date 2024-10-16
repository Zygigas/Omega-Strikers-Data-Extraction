import { getAllCachePaths, loadHTMLFromCache } from "../../fileReaders";
import { scrapPlayerNameAndRank } from "./scrapPlayerNameRankAndLink";

export function scrapPlayerNameRankAndLinkFromCache(path: string): { rank: number; name: string; link: string }[] {

    const allFiles = getAllCachePaths(path);
    const allHTML = allFiles.map((file) => loadHTMLFromCache(file));

    const playerNamesAndLinks: { rank: number; name: string; link: string }[] = [];

    allHTML.forEach(element => {
        playerNamesAndLinks.push(...scrapPlayerNameAndRank(element));
    });

    return playerNamesAndLinks;

}