const express = require('express');
const router = express.Router();
const { requireAuth } = require('../auth/authMiddleware');
const authRouter = require('../auth/authRouter');
const itemRouter = require('./api/itemRouter');
const mealRouter = require('./api/mealRouter');

router.use('/auth', authRouter);
router.use('/item', requireAuth, itemRouter);
router.use('/meal', requireAuth, mealRouter);

router.use((req, res) => {
    res.send({ error: 'Requested api endpoint does not exist.' });
});

module.exports = router;