require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
const connectDB = require("./db/connect");

const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

// Middleware
app.use(express.json());
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());

// Dummy API homepage
app.get("/", (req, res) => {
  res.send("<h1>Auto Tech Api</h1>");
});

// Routers
const messageRouter = require("./routes/Messages");

// Routes
app.use("/api/v1/messages", messageRouter);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("Connected to DB");

    app.listen(port, () => console.log(`Listening at port: ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
