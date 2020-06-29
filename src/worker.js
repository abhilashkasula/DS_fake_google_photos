const http = require('http');
const redis = require('redis');
const {processImage} = require('./processImage');
const imageSets = require('./imageSets');

const getServerOptions = () => {
  return {
    port: 8000,
    host: 'localhost',
    path: '/request-job',
  };
};

const redisClient = redis.createClient({db: 1});

const getJob = () => {
  return new Promise((resolve, reject) => {
    http.get(getServerOptions(), (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (JSON.parse(data).id) {
          return resolve(data);
        }
        return reject('No job found');
      });
    });
  });
};

const loop = () => {
  getJob()
    .then((data) => {
      const params = JSON.parse(data);
      imageSets
        .get(redisClient, params.id)
        .then(processImage)
        .then((tags) => {
          imageSets.completedProcessing(redisClient, params.id, tags);
        })
        .then(() => console.log('Finished job', params.id))
        .then(() => loop());
    })
    .catch(() => {
      setTimeout(loop, 2000);
    });
};

loop();
