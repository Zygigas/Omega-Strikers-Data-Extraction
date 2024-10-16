import logger from "../logger/mainLogger";
/**
 * Runs a given function and logs the result and time taken
 * @param name The name of the module to be run
 * @param func The function to be run
 * @returns A promise that resolves when the function has completed
 */
export async function runModule(
  name: string,
  func: () => Promise<any>
): Promise<void> {
  const startTime = new Date();
  const result = await func();
  const endTime = new Date();
  logger.info(
    `${name} completed successfully\nRun time: ${
      (endTime.getTime() - startTime.getTime()) / 1000
    } seconds`
  );
}
