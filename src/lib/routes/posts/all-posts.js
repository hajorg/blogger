const Joi = require('joi');
const Boom = require('@hapi/boom');

module.exports = (server) => {
  return ({
    method: 'GET',
    path: '/posts',
    handler: async (req, h) => {
      const posts = await server.methods.getPosts();
      return posts;
    }
  })
};
