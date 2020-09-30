const Joi = require('joi');
const Boom = require('@hapi/boom');

module.exports = (server) => ({
  method: 'GET',
  path: '/posts',
  handler: async (req, h) => {
    const { id } = req.params;
    const posts = await server.app.db('posts').select('*');
    return posts;
  }
});
