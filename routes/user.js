const express = require("express");
const router = express.Router();
const User = require('../models/user');
const userAuth = require('../middlewares/userAuth');
const ConnectionRequest = require('../models/connectionRequests');

router.get("/user/feed", userAuth, async (req,res) => {

    try{
        const users = await User.find({});
        if(!users) throw new Error("No users found");

        res.send(users);
    } catch(err) {
        return res.status(400).send("Error: " + err.message);
    }

});

// get all pending connection request for logged in user
router.get("/user/requests/pending", userAuth, async (req, res) => {
    const loggedInUserId = req.user._id;

    try{    
        const pendingRequest = await ConnectionRequest.find({
            toUserId: loggedInUserId,
            status: "interested"
        }).populate('fromUserId', 'firstName lastName photoUrl age gender about skills');

        if(!pendingRequest){
            return res.status(404).send("No pending requests found");
        }

        res.json({
            message: "Pending requests fetched successfully",
            pendingRequest
        });

    } catch(err){
        return res.status(400).send("Error: " + err.message);
    }
});

module.exports = router;
