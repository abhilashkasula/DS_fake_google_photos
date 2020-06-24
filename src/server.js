const express = require('express');
const http = require('http');

const app = express();
let id = 0;
let isWorkerFree = true;
const jobs = [];

setInterval(() => {
  if(isWorkerFree && jobs.length) {
    const job = jobs.shift();
    console.log('Scheduling job on worker: ', job);
    delegateToWorker(job.id, job.params);
  }
}, 1000);

const getWorkerOptions = () => {
  return {
    port: 5000,
    method: 'post',
    host: 'localhost',
  };
};

const delegateToWorker = (id, {count, width, height, tags}) => {
  const options = getWorkerOptions();
  options.path = `/process/${id}/${count}/${width}/${height}/${tags}`
  const req = http.request(options, res => {
    console.log('Got from worker', res.statusCode);
  });
  req.end();
  isWorkerFree = false;
};

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.post('/process/:name/:count/:width/:height/:tags', (req, res) => {
  res.send(`id=${id}`);
  res.end();
  jobs.push({id, params: req.params});
  id++;
});

app.post('/completed-job/:id', (req, res) => {
  isWorkerFree = true;
  res.end();
});

app.listen(8000, () => console.log('listening at 8000'));
