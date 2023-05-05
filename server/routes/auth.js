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
                email: joi.string().required(),
                password: joi.string().required()
            });
            return scheme.validate(user);
        }

        const{error} = validate(req.body);
        if(error){
            return res.status(400).send(error.details[0].message);
        }

        const user = await User.findOne({email: req.body.email});
        if(!user){
            return res.status(400).send('Invalid email or password');
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword){
            return res.status(400).send('Invalid email or password');
        }

        const token = user.generateAuthToken();
        res.send({data: token});


    }catch (e) {
        console.log(e);
    }

});

router.post('/users/addItem', async (req, res) => {
    const { userEmail } = req.body;
    try {
      const user = await User.findOneAndUpdate({ email: userEmail }, { $push: { workouts: "test" } });
      res.status(200).json({ message: 'Workout plan added to user' });
      res.redirect("/Fitness");
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
      res.redirect("/Fitness");
    }
});

module.exports = router;