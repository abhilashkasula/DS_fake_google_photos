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

app.post('/process', (req, res) => {
  let data = '';
  req.on('data', chunk => data += chunk);
  req.on('end', () => {
    const params = JSON.parse(data);
    processImage(params)
      .then((tags) => {
        console.log(tags);
        return {id: params.id, tags};
      })
      .then(informWorkerFree);
  });
  res.end();
});

app.listen(5000, () => console.log('listening at 5000'));
