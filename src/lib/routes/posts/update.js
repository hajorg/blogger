const Joi = require('joi');
const Boom = require('@hapi/boom');

module.exports = (server) => ({
  method: 'PATCH',
  path: '/posts/{id}',
  options: {
    validate: {
      payload: Joi.object({
        title: Joi.string().required(),
        text: Joi.string()
      }),
      params: Joi.object({
        id: Joi.number().required()
      })
    },
    auth: 'jwt'
  },
  handler: async (req, h) => {
    const { title, text } = req.payload;
    const { id: user_id } = req.auth.credentials;
    const { id } = req.params;
    try {
    const foundPost = await server.methods.getPost({ id, user_id });
    if (!foundPost) {
      throw Boom.forbidden('You don\'t have the permission to perform this action');
    }
    const [post] = await server.app.db('posts').update({ title, text }).where({ id, user_id }).returning('*');

    await server.app.cache.allPostsCacheData.drop('getPosts');
    await server.app.cache.allPostsCacheData.drop(`getPost:${id}`);

    return post;
    } catch (e) {
      console.log(e);
      if (e.detail) throw Boom.badRequest(e.detail);
      if (e.isBoom) return e.output.payload;
      throw Boom.badRequest('An error occurred');
    }
  }
});
