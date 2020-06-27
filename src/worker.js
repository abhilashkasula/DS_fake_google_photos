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

let agentId;

const informWorkerFree = ({id, tags}) => {
  const options = getServerOptions();
  options.path = `/completed-job/${agentId}/${id}`;
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


const main = (port, id) => {
  port = port || 5000;
  agentId = id || 1;
  app.listen(+port, () => console.log(`listening at ${port}`));
};

main(+process.argv[2], +process.argv[3]);
