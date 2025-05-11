const express = require('express');
const app = express();
const connectDb = require("./config/database");
const { validateSignUpData } = require('./utils/validateSignUpData');
const mongoose = require('mongoose');
const {user: User} = require('./models/user');

app.use(express.json());

// connecting to db then only start the server
connectDb().then(() => {
    console.log("Database connected successfully"); 
    app.listen(3000, ()=> {
        console.log("Server is running on port 3000");
    });
}).catch(() => {
    console.log("Database connection failed");
})

app.post("/signup", async (req,res) => {
    
    //validating the data first
    validateSignUpData(req);

    try{
        const {firstName, lastName, emailId, password} = req.body;

        // check if user already exists
        const user = await User.findOne({emailId});
        if(user) throw new Error("User already exists");

        const newUser = new User({
            firstName: firstName,
            lastName: lastName,
            emailId: emailId,
            password: password,
        });

        //save the data in database
        await newUser.save();

        console.log("User signed up successfully");
        res.send("User signed up successfully");
    } catch (err) {
        return res.status(400).send("Error: " + err.message);
    }   
});

app.use("/", (req,res) => {
    res.send("Hello World");
})