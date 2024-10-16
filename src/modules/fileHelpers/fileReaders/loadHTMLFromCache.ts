import { readFileSync } from "fs";

export function loadHTMLFromCache(path: string): string {
    return readFileSync(path, "utf-8");
}