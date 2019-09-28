const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = mongoose.model('User')

const router = express.Router()

router.post('/signup', async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = new User({ email, password })
    await user.save();
    const token = jwt.sign({ userId: user._id}, 'my secret key')
    res.send({ token: token })
  } catch (error) {
    next(error)
  }
})

router.post('/signin', async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(422).send({error: 'Must provide email or password'})
  }
  const user = await User.findOne({ email: email })
  if (!user) {
    return res.status(422).send({error: 'Invalid password or email'})
  }
  try {
    await user.comparePassword(password)
    const token = jwt.sign({ userId: user._id}, 'my secret key')
    res.send({ token: token })
  } catch (error) {
    return res.status(422).send({error: 'Invalid password or email'})
  }
})

module.exports = router
