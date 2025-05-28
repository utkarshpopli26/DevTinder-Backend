const mongoose = require('mongoose');

const connectionRequestsSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    status:{
        type: String,
        enum: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is not a valid status type`,
    },
  },
  {timestamps: true}
);

connectionRequestsSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestsSchema.pre("save", function (next) {
    const connectionRequest = this;
    
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
      throw new Error("Cannot send connection request to yourself!");
    }
    next();
});

const connectionRequests = mongoose.model("connectionRequests", connectionRequestsSchema);
module.exports = connectionRequests;