const express = require('express');
const app = express();
const connectDb = require("./config/database");
const cookieParser = require('cookie-parser');

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");

app.use(express.json());
app.use(cookieParser());

app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", profileRoutes);

// connecting to db then only start the server
connectDb().then(() => {
    console.log("Database connected successfully"); 
    app.listen(3000, ()=> {
        console.log("Server is running on port 3000");
    });
}).catch(() => {
    console.log("Database connection failed");
})