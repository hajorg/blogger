const Joi = require('joi');
const Boom = require('@hapi/boom');
const Bcrypt = require('bcrypt');
const JSONWebToken = require('jsonwebtoken');

module.exports = (server) => ({
  method: 'POST',
  path: '/login',
  options: {
    validate: {
      payload: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8),
      }),
      options:{
        allowUnknown: true,
        abortEarly: false, // validate and return all errors in payloads
        stripUnknown: {
          arrays: false, // 400 if an array element fails validation, dont just drop the object
          objects: true, // remove unwanted info from payloads
        },
        presence: 'required', // default payload key presence
      },
      failAction: async (request, h, err) => {
        console.log(err);
        throw err;
      }
    }
  },
  handler: async(request) => {
    const { email, password } = request.payload;
    const res = await server.app.db('users').select('*').where({ email }).first();
    if (!res || !res.email) {
      throw Boom.badRequest('Incorrect email/password combination');
    }
    const validUser = await Bcrypt.compare(password, res.password);
    if (!validUser) {
      throw Boom.badRequest('Incorrect email/password combination');
    }
    const token = JSONWebToken.sign({
      data: { id: res.id, email: res.email },
    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    delete res.password;
    return { data: res, token };
  }
});
