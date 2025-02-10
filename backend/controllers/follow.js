const router = require('express').Router();
const { User, Follow } = require('../models');
const jwt = require('jsonwebtoken');
const { tokenExtractor } = require('../util/middleware');

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const following = await Follow.create({
      follower_username: user.username,
      follower_id: user.id,
      followed_id: req.body.followed_id,
      followed_username: req.body.followed_username,
    });
    res.json(following);
  } catch (error) {
    next(error);
  }
});

router.delete('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const followedId = req.headers.followed_id;

    console.log('follower_id', user.id);
    console.log('followed_id', Number(followedId));

    const followRow = await Follow.findOne({
      wher: { followed_id: followedId, follower_id: user.id },
    });
    if (!followRow) {
      return res.status(404).json({ error: ' Follow entry not found' });
    }
    await Follow.destroy({
      where: { followed_id: Number(followedId), follower_id: user.id },
      force: true,
    });
    res.status(204).send({ message: 'Unfollowed succesfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
