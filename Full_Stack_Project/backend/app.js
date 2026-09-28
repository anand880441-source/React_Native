const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./confing/db");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", taskRoutes)

app.listen(port, () => console.log(`Server running on port ${port}`));