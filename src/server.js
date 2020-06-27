const express = require('express');
const ImageSets = require('./imageSets');
const Scheduler = require('./scheduler');
const Agent = require('./agent');

const getAgentOptions = (port) => {
  return {
    port,
    method: 'post',
    host: 'localhost',
    path: '/process',
  };
};

const app = express();
const imageSets = new ImageSets();
const scheduler = new Scheduler();
scheduler.addAgent(new Agent(1, getAgentOptions(5000)));
scheduler.addAgent(new Agent(2, getAgentOptions(5001)));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.post('/process/:name/:count/:width/:height/:tags', (req, res) => {
  const job = imageSets.addImageSet(req.params);
  res.send(`id=${job.id}`);
  res.end();
  scheduler.schedule(job);
});

app.post('/completed-job/:agentId/:id', (req, res) => {
  let data = '';
  req.on('data', (chunk) => (data += chunk));
  req.on('end', () => {
    const tags = JSON.parse(data);
    console.log(tags);
    imageSets.completedProcessing(req.params.id, tags);
    scheduler.setAgentFree(req.params.agentId);
    res.end();
  });
});

app.get('/status/:id', (req, res) => {
  const imageSet = imageSets.get(req.params.id);
  res.json(imageSet);
});

app.listen(8000, () => console.log('listening at 8000'));
