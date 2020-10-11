const createPost = require('./create');
const getPost = require('./get-post');
const userPosts = require('./user-posts');
const allPosts = require('./all-posts');
const updatePost = require('./update');

module.exports = (server) => ([
  createPost(server),
  getPost(server),
  userPosts(server),
  allPosts(server),
  updatePost(server),
]);
