import { load } from "cheerio";
export function scrapAllTextInSelector(
  html: string,
  selector: string
): string[] {
  const $ = load(html);

  const playerNames: string[] = [];
  $(selector).each((i, element) => {
    playerNames.push($(element).text());
  });
  return playerNames;
}
