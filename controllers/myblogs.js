const Post = require('../database/models/Post')

module.exports = async (req, res) => {
  const posts = await Post.find({author:req.session.userId}).populate('author')

  res.render("myblogs", {
    posts
  });
}