export class QueueManager {
  private queue: Array<() => Promise<any>> = [];
  private maxWorkers: number = 1;
  private idIndex = 0;
  private workers: Array<{ promise: Promise<any>; id: number }> = [];
  private results: Array<any> = [];

  constructor(maxWorkers: number) {
    this.maxWorkers = maxWorkers;
  }


  setMaxWorkers(maxWorkers: number) {
    this.maxWorkers = maxWorkers;
  }

  addToQueue(func: () => Promise<any>) {
    this.queue.push(func);
  }

  async test() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("test");
    return "test";
  }

  async runQueue() {
    console.log("running queue");
    while (this.queue.length > 0) {
      if (this.workers.length < this.maxWorkers) {
        console.log(
          "adding worker, current worker count: " + this.workers.length
        );
        const newWorker = {
          promise: this.queue.shift()!(),
          id: this.idIndex++,
        };
        this.workers.push(newWorker);
        console.log(
          "added worker, current worker count: " + this.workers.length
        );
        console.log(this.workers);
         newWorker.promise.finally(() => {
          this.results.push(newWorker.promise);
          this.workers.splice(this.workers.indexOf(newWorker), 1);
        });
      } else {
        await Promise.race(this.workers.map((worker) => worker.promise));
      }
    }
    console.log("finished running queue");
    console.log(this.results);
  }
}
