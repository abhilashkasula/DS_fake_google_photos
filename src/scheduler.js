const http = require('http');

class Scheduler {
  constructor(workerOptions) {
    this.jobs = [];
    this.workerOptions = workerOptions;
    this.isWorkerFree = true;
  }

  schedule(job) {
    if(this.isWorkerFree) {
      return this.delegateToWorker(job);
    }
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

  setWorkerFree() {
    this.isWorkerFree = true;
    if(this.jobs.length) {
      const job = this.jobs.shift();
      this.delegateToWorker(job);
    }
  }
}

module.exports = Scheduler;
