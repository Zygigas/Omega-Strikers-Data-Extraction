/**
 * Runs a given function and logs the result and time taken
 * @param name The name of the module to be run
 * @param func The function to be run
 * @returns A promise that resolves when the function has completed
 */
async function runModule(
  name: string,
  func: () => Promise<any>
): Promise<void> {
  const startTime = new Date();
  const result = await func();
  const endTime = new Date();

  if (result === 0) {
    console.log(`${name} completed successfully`);
    console.log(
      `Run time: ${(endTime.getTime() - startTime.getTime()) / 1000} seconds`
    );
  }
}
