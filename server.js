const Hapi = require('@hapi/hapi');
const HapiAuthJWT = require('hapi-auth-jwt2');
const Catbox = require('@hapi/catbox');

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

  const allPostsCacheData = server.cache({
    expiresIn: 10 * 60 * 1000,
    segment: 'allPostsSegment',
  });

  server.method(
    'getPosts',
    async () => {
      const id = 'getPosts';
      let posts = await allPostsCacheData.get(id);
      if (!posts) {
        posts = await server.app.db('posts').select('*');
        await allPostsCacheData.set(id, posts, 10 * 60 * 1000);
      }
      return posts
    },
  );

  server.method(
    'getPost',
    async (attr) => {
      const id = `getPost:${attr.id}`;
      let post = await allPostsCacheData.get(id);
      if (!post) {
        post = await server.app.db('posts').select('*').where(attr).first();
        if (post) await allPostsCacheData.set(id, post, 10 * 60 * 1000);
      }
      return post;
    },
  );

  server.app.cache = { allPostsCacheData };
  server.route([...usersRoute(server), ...postsRoute(server)]);

  await server.start();
  console.log(`Server started on ${server.info.uri}`);
};

process.on('unHandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
