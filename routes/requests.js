const express = require('express');
const router = express.Router();

const ConnectionRequest = require('../models/connectionRequests');
const userAuth = require('../middlewares/userAuth');
const User = require('../models/user');

router.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {

    const {status, toUserId} = req.params;

    const allowed_status = [
        "interested",
        "ignored"
    ];

    if (!allowed_status.includes(status)) {
        return res.status(400).send("Invalid status type");
    }
    
    try{
        const validUserId = await User.findById(toUserId);

        if(!validUserId) return res.status(404).send("User not found");

        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId: req.user._id , toUserId },
                { fromUserId: toUserId, toUserId: req.user._id},
            ],
        });

        if(existingRequest) {
            return res.status(400).send("Connection request already exists");
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId: req.user._id,
            toUserId,
            status
        });

        await connectionRequest.save();

        res.json({
            message: "Connection request sent successfully",
            connectionRequest
        });

    } catch(err){
        return res.status(400).send("Error: " + err.message);
    }

});

module.exports = router;