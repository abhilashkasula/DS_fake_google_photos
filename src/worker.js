const express = require('express');
const http = require('http');
const {processImage} = require('./processImage');

const app = express();

const getServerOptions = () => {
  return {
    port: 8000,
    method: 'post',
    host: 'localhost',
  };
};

const informWorkerFree = ({id, tags}) => {
  const options = getServerOptions();
  options.path = `/completed-job/${id}`;
  const req = http.request(options, () => {});
  req.write(JSON.stringify(tags));
  req.end();
};

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.post('/process/:id/:count/:width/:height/:tags', (req, res) => {
  res.end();
  processImage(req.params)
    .then((tags) => {
      console.log(tags);
      return {id: req.params.id, tags};
    })
    .then(informWorkerFree);
});

app.listen(5000, () => console.log('listening at 5000'));
