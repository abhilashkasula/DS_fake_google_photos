const http = require('http');

class Scheduler {
  constructor(workerOptions) {
    this.jobs = [];
    this.workerOptions = workerOptions;
    this.isWorkerFree = true;
  }

  schedule(job) {
    this.jobs.push(job);
  }

  delegateToWorker(payload) {
    const options = this.workerOptions;
    const req = http.request(options, (res) => {
      console.log('Got from worker', res.statusCode);
    });
    req.write(JSON.stringify(payload));
    req.end();
    this.isWorkerFree = false;
  }

  start() {
    setInterval(() => {
      if (this.isWorkerFree && this.jobs.length) {
        const job = this.jobs.shift();
        console.log('Scheduling job on worker: ', job);
        this.delegateToWorker(job);
      }
    }, 1000);
  }

  setWorkerFree() {
    this.isWorkerFree = true;
  }
}

module.exports = Scheduler;
