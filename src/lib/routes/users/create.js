const Joi = require('joi');
const Boom = require('@hapi/boom');
const Bcrypt = require('bcrypt');

module.exports = (server) => ({
  method: 'POST',
  path: '/users/create',
  options: {
    validate: {
      payload: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
      }),
      // options:{
      //   allowUnknown: true,
      //   abortEarly: false, // validate and return all errors in payloads
      //   stripUnknown: {
      //     arrays: false, // 400 if an array element fails validation, dont just drop the object
      //     objects: true, // remove unwanted info from payloads
      //   },
      //   presence: 'required', // default payload key presence
      // },
      // failAction: async (request, h, err) => {
      //   console.log(err);
      //   throw err;
      // }
    }
  },
  handler: async(request, h) => {
    try {
      const hash = await Bcrypt.hash(request.payload.password, 10);
      const attr = { password: hash, email: request.payload.email }
      const [res] = await server.app.db('users').insert(attr).returning('*');
      delete res.password;
      return res;
    } catch (e) {
      console.log(e)
      if (e.detail && e.detail.includes('exists')) throw Boom.conflict(e.detail);
      if (e.detail) throw Boom.badRequest(e.detail);
      throw Boom.badRequest('An error occurred');
    }
  }
});
