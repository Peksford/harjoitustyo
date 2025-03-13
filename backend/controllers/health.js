const router = require('express').Router();

router.get('/', async (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Backend is running',
  });
});

module.exports = router;
