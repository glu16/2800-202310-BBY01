// A LARGE MARJORITY OF THIS CODE WAS TAKEN FROM THE FOLLOWING YOUTUBE VIDEO
// https://www.youtube.com/watch?v=HGgyd1bYWsE

const router = require("express").Router();
const { User } = require("../models/users");
const joi = require("joi");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  let email = req.body.email;
  try {
    const validate = (user) => {
      const scheme = joi.object({
        email: joi.string().required(),
        newPassword: joi.string().required(),
      });
      return scheme.validate(user);
    };

    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      // THE ERROR MESSAGE IF EMAIL ALREADY EXISTS
      return res.status(400).send("Email does not exist");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

    await User.findOneAndUpdate({ email: email }, { $set: { password: hashedPassword } });
    res.send("Password changed");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
