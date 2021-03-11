const express = require("express");
const User = require("../../models/Users");
const auth = require("../../middleware/auth");
const jwt = require('jsonwebtoken')

const router = new express.Router();

// creating a user route post to database

router.post("/user", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    //    res.status(201).send({user, token})
    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: 'none'
      })
      .status(201)
      .send({ user });
  } catch (error) {
    res.status(400).send(error);
  }
});

// creating a login route

router.post("/user/login", async (req, res) => {
  const {email, password} = req.body


  try {
    const user = await User.findByCredentials(
      email,
      password
    );
    const token = await user.generateAuthToken();
    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: 'none'
      })
      .status(201)
      .send({ user });
  } catch (error) {
    res.status(400).send({errMsg: 'Invalid email or password'});
  }
});

// creating a get user route

router.get("/user/me", auth, async (req, res) => {
  res.send(req.user);
});


//creating check loggin route

router.get('/user/loggedIn', (req, res) => {
  try {
    const token = req.cookies.token
    if(!token){
      return res.send(false)
    }
    jwt.verify(token, process.env.JWT_SECRET)
    res.send(true)
  } catch (error) {
    res.send(false)
  }
})


//creating a logout route

router.get('/user/logout', auth, async(req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
    await req.user.save()
    res.cookie('token', '', {
      httpOnly: true,
      sameSite: 'none',
      expires: new Date(0)
    }).send()
  } catch (error) {
    res.send()
  }
})

module.exports = router;
