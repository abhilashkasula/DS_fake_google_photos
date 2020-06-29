const redis = require('redis');
const {processImage} = require('./processImage');
const imageSets = require('./imageSets');

const redisClient = redis.createClient({db: 1});

const getJob = () => {
  return new Promise((resolve, reject) => {
    redisClient.brpop('ipQueue', 1, (err, res) => {
      if (res) {
        return resolve(res[1]);
      }
      return reject('no job');
    });
  });
};

const loop = () => {
  getJob()
    .then((id) => {
      imageSets
        .get(redisClient, id)
        .then(processImage)
        .then((tags) => {
          imageSets.completedProcessing(redisClient, id, tags);
        })
        .then(() => console.log('Finished job', id))
        .then(loop);
    })
    .catch(loop);
};

loop();
