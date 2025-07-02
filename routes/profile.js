const express = require("express");
const router = express.Router();
const userAuth = require('../middlewares/userAuth');

router.get("/profile", userAuth, async (req,res) => {
    try{
        const user = req.user;
        if(!user) throw new Error("User does not exist");
        res.json({'user': user});
    } catch(err){
        res.status(400).send("Error: " + err.message);
    }
});

router.patch("/profile/edit", userAuth, async (req,res) => {
    try{
        const Allowed_Updates = ['firstName', 'lastName', 'age', 'gender', 'photoUrl', 'about', 'skills'];

        const isUpdateAllowed = Object.keys(req.body).every((key) => {
            return Allowed_Updates.includes(key);
        });

        if(!isUpdateAllowed) throw new Error("Invalid update");

        if(req.body.skills.length > 10) throw new Error("You can only add up to 10 skills");

        const user = req.user;

        Object.keys(req.body).forEach((key) => {
            user[key] = req.body[key];
        });

        await user.save();
        res.json({'message': `${user.firstName}` + ` your profile has been updated successfully`, 'user': user});
    }
    catch(err){
        res.status(400).send("Error: " + err.message);
    }

});

module.exports = router;