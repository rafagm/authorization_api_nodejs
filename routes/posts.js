const router = require('express').Router();
const verify = require('./verifyToken');

router.get('/', verify, (req, res) => {
    res.json({
        user: req.user,
        posts: {
            title: 'Secret post',
            description: `Random post you shouldn't access if not logged in`
        }
    });
});

module.exports = router;