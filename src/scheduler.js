const http = require('http');
const { timeStamp } = require('console');

class Scheduler {
  constructor(workerOptions) {
    this.jobs = [];
    this.workerOptions = workerOptions;
    this.isWorkerFree = true;
    this.agents = [];
  }

  addAgent(agent) {
    this.agents.push(agent);
  }

  schedule(job) {
    const agent = this.agents.find(agent => agent.isFree);
    if(agent) {
      return this.delegateToAgent(job, agent);
    }
    this.jobs.push(job);
  }

  delegateToAgent(payload, agent) {
    const options = agent.getOptions();
    const req = http.request(options, (res) => {
      console.log('Got from worker', res.statusCode);
    });
    req.write(JSON.stringify(payload));
    req.end();
    agent.setBusy();
  }

  setAgentFree(agentId) {
    const agent = this.agents.find(agent => agent.agentId == agentId);
    agent.setFree();
    if(this.jobs.length) {
      const job = this.jobs.shift();
      this.delegateToAgent(job, agent);
    }
  }
}

module.exports = Scheduler;
