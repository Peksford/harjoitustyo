const router = require('express').Router();
const { User, Follow } = require('../models');
const jwt = require('jsonwebtoken');
const { tokenExtractor } = require('../util/middleware');

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    console.log('anything here?');
    const user = await User.findByPk(req.decodedToken.id);
    const following = await Follow.create({
      ...req.body,
      follower_id: user.id,
    });
    res.json(following);
  } catch (error) {
    next(error);
    // return res.status(400).json({ error });
  }
});

module.exports = router;
