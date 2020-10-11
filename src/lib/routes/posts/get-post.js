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
  },
  handler: async (req, h) => {
    const { id } = req.params;
    const post = server.methods.getPost({ id });
    if (!post) throw Boom.notFound('Post was not found :(');
    return post;
  }
});
