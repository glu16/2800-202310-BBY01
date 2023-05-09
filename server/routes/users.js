// A LARGE MARJORITY OF THIS CODE WAS TAKEN FROM THE FOLLOWING YOUTUBE VIDEO
// https://www.youtube.com/watch?v=HGgyd1bYWsE

const router = require("express").Router();
const { User, validate } = require("../models/users");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const user = await User.findOne({ email: req.body.email });
    if (user) {
      // THE ERROR MESSAGE IF EMAIL ALREADY EXISTS
      return res.status(400).send("Email already registered");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    await new User({ ...req.body, password: hashedPassword }).save();
    res.send("User created");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
