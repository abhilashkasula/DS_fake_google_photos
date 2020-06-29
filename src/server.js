const express = require('express');
const redis = require('redis');
const imageSets = require('./imageSets');

const app = express();
const redisClient = redis.createClient({db: 1});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.post('/process/:name/:count/:width/:height/:tags', (req, res) => {
  imageSets.addImageSet(redisClient, req.params).then((job) => {
    res.send(`id=${job.id}`);
    res.end();
    redisClient.lpush('ipQueue', job.id);
  });
});

app.get('/status/:id', (req, res) => {
  imageSets.get(redisClient, req.params.id).then((imageSet) => {
    res.json(imageSet);
  });
});

app.listen(8000, () => console.log('listening at 8000'));
