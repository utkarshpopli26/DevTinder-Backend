const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const { validateSignUpData } = require('../utils/validateSignUpData');
const User = require('../models/user');
const validator = require('validator');

//signs up user onto application
router.post("/signup", async (req,res) => {
    
    //validating the data first
    validateSignUpData(req);

    try{
        const {firstName, lastName, emailId, password} = req.body;

        // check if user already exists
        const user = await User.findOne({emailId});
        if(user) throw new Error("User already exists");

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName: firstName,
            lastName: lastName,
            emailId: emailId,
            password: passwordHash,
        });

        //save the data in database
        await newUser.save();
        res.send("User signed up successfully");
    } catch (err) {
        return res.status(400).send("Error: " + err.message);
    }   
});

router.post("/login", async (req,res) => {
    const {emailId, password} = req.body;
    
    const validEmail = validator.isEmail(emailId);
    if(!validEmail) throw new Error("Invalid email address.");
    
    try{
        const user = await User.findOne({emailId: emailId});
        if(!user) throw new Error("invalid creds");
        
        const isCorrectPassword = await user.validatePassword(password);		 
        if(!isCorrectPassword ) throw new Error("invalid creds");

        const token = await user.getJwt();

        res.cookie("token", token, {expiresIn: '1d'});
        
        res.json(user);
    } catch(err){
            res.status(400).send("Error: " + err.message);
    }
});

router.post("/logout", (req, res) => {
    res.cookie("token", null, {expires: new Date(Date.now())});
    res.send("Logout successful");
});

module.exports = router;