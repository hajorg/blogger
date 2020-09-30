const Joi = require('joi');
const Boom = require('@hapi/boom');

module.exports = (server) => ({
  method: 'POST',
  path: '/posts',
  options: {
    validate: {
      payload: Joi.object({
        title: Joi.string().required(),
        text: Joi.string()
      }),
    //   options:{
    //     allowUnknown: true,
    //     abortEarly: false, // validate and return all errors in payloads
    //     stripUnknown: {
    //       arrays: false, // 400 if an array element fails validation, dont just drop the object
    //       objects: true, // remove unwanted info from payloads
    //     },
    //     presence: 'required', // default payload key presence
    //   },
    //   failAction: async (request, h, err) => {
    //     console.log(err);
    //     throw err;
    //   }
    },
    auth: 'jwt'
  },
  handler: async (req, h) => {
    const { title, text } = req.payload;
    const { id: user_id } = req.auth.credentials;
    try {
      const [post] = await server.app.db('posts').insert({ title, text, user_id }).returning('*');
      return post;
    } catch (e) {
      console.log(e);
      if (e.detail) throw Boom.badRequest(e.detail);
      throw Boom.badRequest('An error occurred');
    }
  }
});
