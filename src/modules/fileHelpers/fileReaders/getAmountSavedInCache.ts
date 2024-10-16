import { readdirSync } from "fs";

export function getAmountSavedInCache(pathToCache: string): number {
    const files = readdirSync(pathToCache);
    return files.length
    
}