class Agent {
  constructor(agentId, options) {
    this.agentId = agentId;
    this.options = options;
    this.isFree = true;
  }

  getOptions() {
    return Object.assign({}, this.options);
  }

  setBusy() {
    this.isFree = false;
  }

  setFree() {
    this.isFree = true;
  }
}

module.exports = Agent;
