// A LARGE MARJORITY OF THIS CODE WAS TAKEN FROM THE FOLLOWING YOUTUBE VIDEO
// https://www.youtube.com/watch?v=HGgyd1bYWsE

const router = require("express").Router();
const { User, validate } = require("../models/users");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      if (error.details[0].message.includes("username")) {
        return res.status(400).send("Username must contain at least 4 characters.");
      } else if (error.details[0].message.includes("firstName")) {
        return res.status(400).send("First name must contain at least 4 characters.");
      } else if (error.details[0].message.includes("lastName")) {
        return res.status(400).send("Last name must contain at least 2 characters.");
      } else if (error.details[0].message.includes("password")) {
        return res.status(400).send("Password must contain at least 6 characters.");
      } else {
      return res.status(400).send(error.details[0].message);
      }
    }

    const user = await User.findOne({$or:[{email: req.body.email}, {username: req.body.username}]});
    if (user) {
      if (user.username === req.body.username) {
        return res.status(400).send("Username already taken");
      } else if ( user.email === req.body.email){
        return res.status(400).send("Email already registered");
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await new User({ ...req.body, password: hashedPassword }).save();

    req.session.user = newUser.username;
    const token = newUser.generateAuthToken();
    res.send({ data: token });
    
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
