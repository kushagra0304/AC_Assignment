const postModel = require('../schemas/user');
const router = require('express').Router();

router.get('/posts', async (req, res, next) => {
  const dummyPosts = [
    {
      author: 'Alice Johnson',
      date: '2025-05-01T10:00:00Z',
      heading: 'Understanding Next.js 14',
      content: 'Next.js 14 brings many improvements including the app router and better server rendering...'
    },
    {
      author: 'Bob Smith',
      date: '2025-05-02T15:30:00Z',
      heading: 'Getting Started with Express',
      content: 'Express is a fast, unopinionated, minimalist web framework for Node.js...'
    },
    {
      author: 'Carol Lee',
      date: '2025-05-03T08:45:00Z',
      heading: 'Why CSS Modules?',
      content: 'CSS Modules provide scoped CSS, avoiding style conflicts in large applications...'
    }
  ];

  res.json(dummyPosts);
});

router.post('/post', async (req, res, next) => {
  try {
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

    res.status(201).json(savedPost.toJSON());
  } catch (error) {
    next(error);
  }
});

module.exports = router;