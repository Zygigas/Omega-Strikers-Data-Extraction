import logger from "../logger/mainLogger";

export class QueueManager {
  private _queue: Array<() => Promise<any>> = [];
  private _idIndex = 0;
  private _workers: Array<{ promise: Promise<any>; id: number }> = [];

  private _queueOptions = {
    concurrency: 1,
    saveResultsArray: true,
  };

  private _results: Array<String> = [];

  constructor(maxWorkers: number, saveResultsArray?: boolean) {
    this._queueOptions.concurrency = maxWorkers;
    this._queueOptions.saveResultsArray = saveResultsArray ?? true;
  }

  public set maxWorkers(maxWorkers: number) {
    this._queueOptions.concurrency = maxWorkers;
  }
  public get maxWorkers(): number {
    return this._queueOptions.concurrency;
  }

  public addToQueue(
    functionOrPromise: (() => Promise<any>) | Array<() => Promise<any>>
  ) {
    if (Array.isArray(functionOrPromise)) {
      this._queue.push(...functionOrPromise);
    } else {
      this._queue.push(functionOrPromise);
    }
  }

  public async runQueue() {
    logger.info("running queue");

    while (this._queue.length > 0) {
      if (this._workers.length < this._queueOptions.concurrency) {
        logger.info(
          "adding worker, current worker count: " + this._workers.length
        );
        const newWorker = {
          promise: this._queue.shift()!(),
          id: this._idIndex++,
        };
        this._workers.push(newWorker);
        logger.info(
          "added worker, current worker count: " +
            this._workers.length +
            "\n" +
            "que items left: " +
            this._queue.length
        );
        newWorker.promise.finally(() => {
          const indexToRemove = this._workers.findIndex(
            (worker) => worker.id === newWorker.id
          );
          if (indexToRemove !== -1) {
            this._workers.splice(indexToRemove, 1);
          }
          if (this._queueOptions.saveResultsArray) {
            newWorker.promise.then((result) => this._results.push(result));
          }
          return newWorker.promise;
        });
      } else {
        await Promise.race(this._workers.map((worker) => worker.promise));
      }
    }
    await Promise.all(this._workers.map((worker) => worker.promise));
    logger.info("all workers done");
    if (this._queueOptions.saveResultsArray) {
      return this._results;
    }
  }
}
