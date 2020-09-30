const getUser = require('./get');
const createUser = require('./create');
const login = require('./login');

module.exports = (server) => ([
  getUser(server),
  createUser(server),
  login(server),
]);
