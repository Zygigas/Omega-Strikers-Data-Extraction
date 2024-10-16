import { lstatSync, readdirSync } from "fs";
import { join } from "path";

export function getAllCachePaths(cacheDir: string): string[] {
  let cachePaths: string[] = [];
  const files = readdirSync(cacheDir);
  for (const file of files) {
    const filePath = join(cacheDir, file);
    if (lstatSync(filePath).isFile()) {
      cachePaths.push(filePath);
    }
  }
  return cachePaths;
}
