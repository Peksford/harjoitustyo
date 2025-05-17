const router = require('express').Router();
const { Album, User, Group, GroupMember } = require('../models');
const jwt = require('jsonwebtoken');
const { tokenExtractor } = require('../util/middleware');

router.get('/', async (req, res, next) => {
  try {
    const groups = await Group.findAll({});

    res.json(groups);
  } catch (error) {
    next(error);
  }
});

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);

    const group = await Group.create({
      ...req.body,
    });
    res.json(group);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id, {
      include: [
        {
          model: GroupMember,
          include: [
            {
              model: User,
              attributes: ['id', 'username', 'name'],
            },
          ],
        },
      ],
    });

    res.json(group);
  } catch (error) {
    next(error);
  }
});

router.get('/:id/members', async (req, res, next) => {
  try {
    const group = await GroupMember.findAll({
      where: { group_id: req.params.id },
    });

    res.json(group);
  } catch (error) {
    console.log(error);
    next(error);
    return res.status(400).json({ error });
  }
});

router.post('/:id/members', tokenExtractor, async (req, res, next) => {
  try {
    const groupId = req.params.id;
    const { userId } = req.body;

    const group = await Group.findByPk(groupId);
    if (!group) {
      next();
    }
    const user = await User.findByPk(userId);
    if (!user) {
      next();
    }

    const existingMember = await GroupMember.findOne({
      where: { group_id: groupId, user_id: userId },
    });

    if (existingMember) {
      return res
        .status(400)
        .json({ error: 'User has already been added to the group' });
    }

    const newMember = await GroupMember.create({
      group_id: groupId,
      user_id: userId,
      created_at: Date.now(),
      updated_at: Date.now(),
    });

    res.status(202).json(newMember);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
