//A LARGE MARJORITY OF THIS CODE WAS TAKEN FROM THE FOLLOWING YOUTUBE VIDEO
//https://www.youtube.com/watch?v=HGgyd1bYWsE

const router = require("express").Router();
const { User } = require("../models/users");
const joi = require("joi");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  try {
    const validate = (user) => {
      const scheme = joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
      });
      return scheme.validate(user);
    };

    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      // THE ERROR MESSAGE IF DOES NOT EXIST
      return res.status(400).send("Invalid username or password");
      console.log(user);
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      // THE ERROR MESSAGE IF PASSWORD IS WRONG
      return res.status(400).send("Invalid email or password");
    }
    req.session.username = user.username; // Store user data in session
    const userEmail = user.email;
    const token = user.generateAuthToken();
    res.send({ data: {token: token, userEmail: userEmail} });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
