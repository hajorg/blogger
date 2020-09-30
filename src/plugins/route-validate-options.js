exports.plugin = {
  name: 'route-validate-options',
  version: '1.0.0',
  register: async (server, options) => {
    console.log('Registering route-validate-options plugin');
    server.ext('onPostAuth', (request, h) => {
      request.route.settings.validate.failAction = (request, h, err) => {
        console.log(err);
        throw err;
      };
      request.route.settings.validate.options = {
        abortEarly: false, // validate and return all errors in payloads
        stripUnknown: {
            arrays: false, // 400 if an array element fails validation, dont just drop the object
            objects: true, // remove unwanted info from payloads
        },
        presence: 'required', // default payload key presence
      };

      return h.continue;
    });
  }
};
