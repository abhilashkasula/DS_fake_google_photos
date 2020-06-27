const getCurrId = (client) => {
  return new Promise((resolve, reject) => {
    client.incr('curr_id', (err, res) => {
      resolve(res);
    });
  });
};

const createJob = (client, id, imageSet) => {
  return new Promise((resolve, reject) => {
    const status = ['status', 'scheduled'];
    const receivedAt = ['receivedAt', new Date()];
    client.hmset(`job_${id}`, status.concat(receivedAt), (err, res) => {
      resolve(Object.assign({id}, imageSet));
    });
  });
};

const addImageSet = (client, imageSet) => {
  return getCurrId(client).then((id) => createJob(client, id, imageSet));
};

const completedProcessing = (client, id, tags) => {
  return new Promise((resolve, reject) => {
    const status = ['status', 'completed'];
    const tagsField = ['tags', JSON.stringify(tags)];
    client.hmset(`job_${id}`, status.concat(tagsField), (err, res) => {
      resolve(res);
    });
  });
};

const get = (client, id) => {
  return new Promise((resolve, reject) => {
    client.hgetall(`job_${id}`, (err, res) => {
      resolve(res);
    });
  });
}

module.exports = {addImageSet, completedProcessing, get};
