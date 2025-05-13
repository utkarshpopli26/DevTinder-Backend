const express = require("express");
const router = express.Router();
const User = require('../models/user');
const userAuth = require('../middlewares/userAuth');

router.get("/user/feed", userAuth, async (req,res) => {

    try{
        const users = await User.find({});
        if(!users) throw new Error("No users found");

        res.send(users);
    } catch(err) {
        return res.status(400).send("Error: " + err.message);
    }

});

module.exports = router;
