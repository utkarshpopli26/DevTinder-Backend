const express = require('express');
const app = express();
const connectDb = require("./config/database");
const { validateSignUpData } = require('./utils/validateSignUpData');
const User = require('./models/user');
const validator = require('validator');
const bcrypt = require('bcrypt');
const userAuth = require('./middlewares/userAuth');

const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

// connecting to db then only start the server
connectDb().then(() => {
    console.log("Database connected successfully"); 
    app.listen(3000, ()=> {
        console.log("Server is running on port 3000");
    });
}).catch(() => {
    console.log("Database connection failed");
})


//signs up user onto application
app.post("/signup", async (req,res) => {
    
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

app.post("/login", async (req,res) => {
    const {emailId, password} = req.body;
    
    const validEmail = validator.isEmail(emailId);
    if(!validEmail) throw new Error("Invalid email address.");
    
    try{
        const user = await User.findOne({emailId: emailId});
        if(!user) throw new Error("invalid creds");
        
        const isCorrectPassword = await user.validatePassword(password);		 
        if(!isCorrectPassword ) throw new Error("invalid creds");

        const token = await user.getJwt();

        res.cookie("token", token, {expiresIn: '7d'});
        
        res.send("login successful");
    } catch(err){
            res.status(400).send("Error: " + err.message);
    }
});

app.get("/feed", userAuth, async (req,res) => {

    try{
        const users = await User.find({});
        if(!users) throw new Error("No users found");

        res.send(users);
    } catch(err) {
        return res.status(400).send("Error: " + err.message);
    }

});

app.use("/", (req,res) => {
    res.send("Hello World");
});