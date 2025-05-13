const jwt = require('jsonwebtoken');
const User = require('../models/user');


const authUser = async (req,res,next) => {

		try{
		// read the token
		const {token} = req.cookies;
			
		// if token does not exits, throw error
		if(!token) throw new Error("Invalid Token");
		// verify if token is valid
		const decodedObj = await jwt.verify(token, "DevTinder");
		const {_id} = decodedObj;
		//get the user from database
		const user = await User.findById(_id);

		//if user does not exist, throw error
		if(!user) throw new Error("User does not exist");
		
		//attach the user on request, so that next request handler can extract it without calling the database
		req.user = user;
		// call next request handler
		next();
		} catch(err){
			res.status(400).send("Error: " + err.message);
		}
}

module.exports = authUser;