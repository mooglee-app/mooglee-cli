const server = require('mooglee/server');

server.start()
  .catch(err => {
    console.error('Error while trying to launch the server', err.stack);
    process.exit(1);
  });