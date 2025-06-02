const postModel = require('../schemas/post');
const userModel = require('../schemas/user');
const router = require('express').Router();
const middlewares = require('../utils/middlewares');

router.get('/posts', async (req, res, next) => {
  try {
    const { author } = req.query;
    let query = {};

    // If author parameter is provided, filter posts by that author
    if (author) {
      query.authorId = author;
    }

    // Fetch posts from database and populate author information
    const posts = await postModel.find(query)
      .populate('authorId', 'name email')
      .sort({ createdAt: -1 }); // Sort by creation date, newest first

    res.json(posts);
  } catch (error) {
    next(error);
  }
});

router.post('/post', middlewares.authenticateToken, async (req, res, next) => {
    const { title, content } = req.body;

    // Basic validation
    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }

    // req.user is set by auth middleware, contains user ID
    const authorId = req.user.id;

    const newPost = new postModel({
        title,
        content,
        authorId,
        createdAt: new Date()
    });

    const savedPost = await newPost.save();

    // Update the user's post array with the new post
    await userModel.findByIdAndUpdate(
        authorId,
        { $push: { post: savedPost._id } },
        { new: true }
    );

    res.status(201).json(savedPost.toJSON());
});

module.exports = router;