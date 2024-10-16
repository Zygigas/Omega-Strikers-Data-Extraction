import fs from "fs";
import { AxiosResponse } from "axios";

export type filetypes = "json" | "html" | "txt";

export function cacheDataToFiles(
  directory: string,
  fileFormat: string,
  fileIndex: number,
  data: string | object,
  fileType: filetypes
) {
  // helper recursive function to make sure whole path exists in a chain. makes a new dir path if it dosn't exists.
  function makeSureWholePathExists(path: string) {
    if (!fs.existsSync(path)) {
      makeSureWholePathExists(path.substring(0, path.lastIndexOf("/")));
      fs.mkdirSync(path);
    }
  }

  makeSureWholePathExists(directory);

  const saveFile = (dataInput: string) =>
    fs.writeFileSync(
      `${directory}/${fileFormat}${fileIndex}.${fileType}`,
      dataInput
    );

  switch (typeof data) {
    case "string":
      saveFile(data);
      break;
    case "object":
      saveFile(JSON.stringify(data, null, 2));
      break;
  }
}
