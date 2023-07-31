const router = require("express").Router();
const User = require('../db/controllers/user.controller')
const authCheck = require('../middleware/auth-check')

router.get('/', async (req, res) => {
  res.send('hello')
})

router.post('/signin', async (req, res) => {
  const response = await User.signin(req)
  res.json(response)
})

// returns user profile
router.post('/getProfile', authCheck, async(req, res) => {
  res.json(req.user)
})

// update profile
router.post('/updateProfile', authCheck, async (req, res) => {
  const response = await User.updateProfile(req)
  res.json(response)
})

module.exports = router;