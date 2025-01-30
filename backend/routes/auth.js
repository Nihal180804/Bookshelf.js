const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.post('/signup', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  });
  await user.save();
  res.json({ success: true });
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user && await bcrypt.compare(req.body.password, user.password)) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
});
