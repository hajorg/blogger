const Joi = require('joi');
const Boom = require('@hapi/boom');

module.exports = (server) => ({
  method: 'GET',
  path: '/users/{id}/posts',
  options: {
    validate: {
      params: Joi.object({
        id: Joi.number().required(),
      }),
    },
    // auth: 'jwt'
  },
  handler: async (req, h) => {
    const { id } = req.params;
    const posts = await server.app.db('posts').select('*').where({ user_id: id });
    return posts;
  }
});
