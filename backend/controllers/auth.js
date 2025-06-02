const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../schemas/user');
const logger = require('../utils/logger');
const config = require('../utils/config');
const middlewares = require('../utils/middlewares');

router.post('/signup', async (request, response, next) => {
    try {
        const { email, password, name } = request.body;
        if (!email || !password || !name) {
            return response.status(400).json({ error: 'Email, password and name required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return response.status(400).json({ error: 'Email already in use' });
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        const user = new userModel({ email, passwordHash, name });
        await user.save();

        logger.debug(`User created: ${email}`);
        response.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        next(error);
    }
});

router.post('/login', async (request, response, next) => {
    try {
        const { email, password } = request.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return response.status(401).json({ error: 'Invalid email or password' });
        }

        const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
        if (!passwordCorrect) {
            return response.status(401).json({ error: 'Invalid email or password' });
        }

        const userForToken = {
            id: user._id,
            email: user.email
        };

        const token = jwt.sign(userForToken, config.TOKEN_SECRET, { expiresIn: '7d' });
        logger.debug(`User logged in: ${email}`);

        response.status(200).json({ token });
    } catch (error) {
        next(error);
    }
});

router.get('/verify', middlewares.authenticateToken, async (request, response, next) => {
    response.status(200).send()
});

module.exports = router;