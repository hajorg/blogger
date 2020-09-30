const Hapi = require('@hapi/hapi');
const HapiAuthJWT = require('hapi-auth-jwt2');

const knex = require('knex');
const connection = knex(require('./knexfile').development);
const usersRoute = require('./src/lib/routes/users/index');
const postsRoute = require('./src/lib/routes/posts/index');

const init = async() => {
  const server = Hapi.Server({
    port: 3000,
    host: '0.0.0.0'
  });

  server.app.db = connection;
  await server.register(require('./src/plugins/route-validate-options'));
  await server.register(HapiAuthJWT);
  server.auth.strategy('jwt', 'jwt', {
    key: process.env.JWT_SECRET,
    validate: async (decoded, request, h) => {
      const res = await server.app.db.select('*').from('users').where({ email: decoded.data.email }).first();
      if (res && res.id) return { isValid: true, credentials: res };
      return { isValid: false };
    },
  });

  // server.route({
  //   method: 'GET',
  //   path: '/',
  //   handler: async() => {
  //     const res = await server.app.db('users').select('*');
  //     console.log(res, 'see ehere ============')
  //     return "Just a test";
  //   }
  // });
  server.route([...usersRoute(server), ...postsRoute(server)]);

  await server.start();
  console.log(`Server started on ${server.info.uri}`);
};

process.on('unHandledRejection', (err) => {
  console.log('got ehee----------')
  console.log(err);
  process.exit(1);
});

init();
