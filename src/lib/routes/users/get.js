module.exports = (server) => ({
  method: 'GET',
  path: '/',
  options: {
    auth: 'jwt'
  },
  handler: async(req) => {
    const res = await server.app.db('users').select('*');
    console.log(res, req.auth, 'see ehere ============')
    return "Just a test";
  }
});
