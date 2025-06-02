const router = require('express').Router();
const logger = require('../utils/logger');
const jwt = require('../utils/jwt')

router.post('/login', async (request, response, next) => {
    if(request.errorInAuth) {
        next({ name: "ValidationError" });
        return;
    }

    const { userToken } = request.cookies
    jwt.invalidate(userToken);
    response.clearCookie("userToken");
    response.status(200).send();
});

router.post('/signup', async (request, response, next) => {
    if(request.errorInAuth) {
        next({ name: "ValidationError" });
        return;
    }

    response.send();
    return;
});

module.exports = router;