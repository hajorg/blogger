const Hapi = require('@hapi/hapi');

const init = async() => {
  const server = Hapi.Server({
    port: 3000,
    host: 'localhost'
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: () => {
      return "Just a test";
    }
  });

  await server.start();
  console.log(`Server started on ${server.info.uri}`);
};

process.on('unHandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
