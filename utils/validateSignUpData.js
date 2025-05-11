const validator = require('validator');

const validateSignUpData = (req) => {
    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName) {
        throw new Error("First Name and Last Name are required");
    }
    if(!validator.isAlpha(firstName) || !validator.isAlpha(lastName)) {
        throw new Error("First Name and Last Name should only contain alphabets");
    }
    if(!validator.isEmail(emailId)) {
        throw new Error("Invalid Email Address");
    }
    if(!validator.isStrongPassword(password)) {
        throw new Error("Password should be strong");
    }
}

module.exports = {validateSignUpData,}