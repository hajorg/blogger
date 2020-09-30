module.exports = (server) => ({
  method: 'GET',
  path: '/',
  // config: {
  //   auth: 'jwt'
  // },
  options: {
    auth: 'jwt'
  },
  // validate: {
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
  // },
  handler: async(req) => {
    const res = await server.app.db('users').select('*');
    console.log(res, req.auth, 'see ehere ============')
    return "Just a test";
  }
});
