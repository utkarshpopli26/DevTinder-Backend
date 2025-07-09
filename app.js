const express = require('express');
const app = express();
const connectDb = require("./config/database");
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config()

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const connectionRequestsRoutes = require("./routes/requests");

app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", profileRoutes);
app.use("/", connectionRequestsRoutes);

// connecting to db then only start the server
connectDb().then(() => {
    console.log("Database connected successfully"); 
    app.listen(process.env.PORT, ()=> {
        console.log("Server is running on port 3000");
    });
}).catch(() => {
    console.log("Database connection failed");
})