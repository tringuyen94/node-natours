const app = require('./src/app');
const {
  server: { port },
} = require('./config');
const server = app.listen(port, () => {
  console.log(`WSV is running on ${port}`);
});
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandle Rejection, Server is shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
