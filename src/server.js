const express = require('express');
const http = require('http');
const ImageSets = require('./imageSets');

const app = express();
let isWorkerFree = true;
const jobs = [];

const imageSets = new ImageSets();

setInterval(() => {
  if (isWorkerFree && jobs.length) {
    const job = jobs.shift();
    console.log('Scheduling job on worker: ', job);
    delegateToWorker(job);
  }
}, 1000);

const getWorkerOptions = () => {
  return {
    port: 5000,
    method: 'post',
    host: 'localhost',
  };
};

const delegateToWorker = ({id, count, width, height, tags}) => {
  const options = getWorkerOptions();
  options.path = `/process/${id}/${count}/${width}/${height}/${tags}`;
  const req = http.request(options, (res) => {
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
  const job = imageSets.addImageSet(req.params);
  res.send(`id=${job.id}`);
  res.end();
  jobs.push(job);
});

app.post('/completed-job/:id', (req, res) => {
  let data = '';
  req.on('data', (chunk) => (data += chunk));
  req.on('end', () => {
    const tags = JSON.parse(data);
    console.log(tags);
    imageSets.completedProcessing(req.params.id, tags);
    isWorkerFree = true;
    res.end();
  });
});

app.get('/status/:id', (req, res) => {
  const imageSet = imageSets.get(req.params.id);
  res.json(imageSet);
});

app.listen(8000, () => console.log('listening at 8000'));
