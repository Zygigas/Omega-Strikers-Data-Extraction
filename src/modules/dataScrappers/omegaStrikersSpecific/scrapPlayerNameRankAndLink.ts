import { load } from "cheerio";

export function scrapPlayerNameAndRank(
  html: string
): { rank: number; name: string; link: string }[] {
  const playerSelector = "#playerTable tbody tr td a";
  const rankSelector = "#playerTable tbody tr td:first-child";

  const $ = load(html);
  const playerNames: string[] = [];
  const rank: number[] = [];
  const playerLinks: string[] = [];
  $(playerSelector).each((i, element) => {
    playerNames.push($(element).text().replace(" ", ""));
    const playerLink = $(element).attr("href");
    if (playerLink) {
      playerLinks.push(playerLink);
    } else {
      playerLinks.push("");
    }
    
  });
  $(rankSelector).each((i, element) => {
    rank.push(parseInt($(element).text().replace(" ", "")));
  });

  const playerNameAndRank: { rank: number; name: string; link: string }[] = [];
  for (let i = 0; i < playerNames.length; i++) {
    playerNameAndRank.push({ rank: rank[i], name: playerNames[i], link: playerLinks[i] });
  }
  return playerNameAndRank;
}
