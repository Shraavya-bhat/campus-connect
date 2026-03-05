const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const eventRoutes = require("./routes/events");

const app = express();   // APP CREATED HERE

app.use(cors());
app.use(express.json());

app.use("/api/events", eventRoutes);   // USE ROUTES AFTER APP IS CREATED

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("CampusConnect API running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});