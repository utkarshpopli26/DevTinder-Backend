const express = require("express");
const router = express.Router();
const User = require('../models/user');
const userAuth = require('../middlewares/userAuth');
const ConnectionRequest = require('../models/connectionRequests');

const USER_SAFE_DATA = 'firstName lastName photoUrl age gender about skills';

router.get("/user/feed", userAuth, async (req,res) => {

    try{
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;
        
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        });

        const hideUserIds = new Set();

        connectionRequests.forEach(request => {
            hideUserIds.add(request.fromUserId.toString());
            hideUserIds.add(request.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                { _id: { $ne: loggedInUser._id } },
                {_id: { $nin: Array.from(hideUserIds) }}
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

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
        }).populate('fromUserId', USER_SAFE_DATA);

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

// get all connections for logged in user
router.get('/user/connections', userAuth, async (req, res) => {

    const loggedInUser = req.user;

    try{    
        const connections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", USER_SAFE_DATA)
          .populate("toUserId", USER_SAFE_DATA);

        const data = connections.map((connection) => {
            if (connection.fromUserId._id.equals(loggedInUser._id)) {
                return connection.toUserId; // Return the other user (toUserId)
            } else {
                return connection.fromUserId; // Return the other user (fromUserId)
            }
        });

        res.json({data});

    } catch(err){
        return res.status(400).send("Error: " + err.message);
    }

});

module.exports = router;
