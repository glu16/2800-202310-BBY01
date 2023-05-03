//https://www.youtube.com/watch?v=HGgyd1bYWsE

const router = require("express").Router();
const { User } = require("../models/users");
const joi = require("joi");
const bcrypt = require("bcrypt");


router.post("/", async (req, res) => {
    try {

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

    const validate = (user) => {
        const scheme = joi.object({
            email: joi.string().required().email(),
            password: joi.string().required()
        });
        return scheme.validate(user);
    }
});

module.exports = router;