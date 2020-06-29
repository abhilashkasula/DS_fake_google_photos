const express = require('express');
const http = require('http');
const redis = require('redis');
const {processImage} = require('./processImage');
const imageSets = require('./imageSets');

const app = express();

const getServerOptions = () => {
  return {
    port: 8000,
    method: 'post',
    host: 'localhost',
  };
};

const redisClient = redis.createClient({db: 1});

let agentId;

const informWorkerFree = () => {
  const options = getServerOptions();
  options.path = `/completed-job/${agentId}`;
  const req = http.request(options, () => {});
  req.end();
};

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.post('/process', (req, res) => {
  let data = '';
  req.on('data', (chunk) => (data += chunk));
  req.on('end', () => {
    const params = JSON.parse(data);
    imageSets
      .get(redisClient, params.id)
      .then(processImage)
      .then((tags) => {
        imageSets.completedProcessing(redisClient, params.id, tags);
      })
      .then(informWorkerFree);
  });
  res.end();
});

const main = (port, id) => {
  port = port || 5000;
  agentId = id || 1;
  app.listen(+port, () => console.log(`listening at ${port}`));
};

main(+process.argv[2], +process.argv[3]);
