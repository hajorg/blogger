const Joi = require('joi');
const Boom = require('@hapi/boom');

module.exports = (server) => ({
  method: 'GET',
  path: '/posts/{id}',
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
    const post = await server.app.db('posts').select('*').where({ id }).first();
    if (!post) throw Boom.notFound('Post was not found :(');
    return post;
  }
});
