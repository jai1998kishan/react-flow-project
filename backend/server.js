require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const aiRoutes = require("./routes/aiRoutes");

const app = express();

//middleware
app.use(
  cors({
    origin: "https://react-flow-project-1.onrender.com",
  }),
);
app.use(express.json());

// Routes
app.use("/api", aiRoutes);

//mongoDB connection

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongodb connected"))
  .catch((err) => console.log(err));

// Start Server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
