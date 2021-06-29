require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3001;
const userRouter = require("./routes/userRouter");
const videoRouter = require("./routes/videoRouter");
const playlistRouter = require("./routes/playlistRouter");
const authRouter = require("./routes/authRouter");
const requestRouter = require("./routes/requestRouter");
const cors = require("cors");
/* const corsOptions = {
  origin: "http://localhost:3000/",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}; */

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', ['Content-Type', 'Authorization']);
  res.append('Access-Control-Allow-Credentials', true)
  next();
});
// insert frontend path when frontend is deployed
/* app.use(cors(corsOptions)) */
/* app.use(express.urlencoded ({extended: false})); */
app.use(express.json());
mongoose.connect(process.env.MONGO_DB, {useNewUrlParser : true, useUnifiedTopology : true});

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.use(userRouter);
app.use(videoRouter);
app.use(playlistRouter);
app.use(authRouter);
app.use(requestRouter);

app.listen(PORT, console.log(`Running on ${PORT}`));
