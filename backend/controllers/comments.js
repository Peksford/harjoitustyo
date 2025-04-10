const router = require('express').Router();
const { Comment, User } = require('../models');
const jwt = require('jsonwebtoken');
const { tokenExtractor } = require('../util/middleware');

router.get('/', async (req, res, next) => {
  try {
    console.log('Comment id body', req.query.group_id);
    const comments = await Comment.findAll({
      include: {
        model: User,
        attributes: ['username'],
      },
      where: { group_id: req.query.group_id },
    });

    res.json(comments);
  } catch (error) {
    next(error);
  }
});

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    console.log('comment body', req.body);
    const user = await User.findByPk(req.decodedToken.id);
    const comment = await Comment.create({
      ...req.body,
      user_id: user.id,
    });
    res.json(comment);
  } catch (error) {
    next(error);
    // return res.status(400).json({ error });
  }
});

// router.get('/:id', async (req, res, next) => {
//   try {
//     // const user = await User.findByPk(req.decodedToken.id);
//     const comment = await Comment.findByPk(req.params.id);
//     console.log('Comment id body', req.body);

//     res.json(comment);
//   } catch (error) {
//     console.log(error);
//     next(error);
//     return res.status(400).json({ error });
//   }
// });

module.exports = router;
