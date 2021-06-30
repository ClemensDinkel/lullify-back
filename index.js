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
const corsOptions = {
  origin: "*", //["http://localhost:3000","https://thirsty-jang-8e90b8.netlify.app/"],
  // credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
};

/* app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['http://localhost:3000']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', ['Content-Type', 'Authorization', 'Accept']);
  res.append('Access-Control-Allow-Credentials', true)
  next();
}); */

/* app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://thirsty-jang-8e90b8.netlify.app/"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Credentials', true)
  next();
});  */

// insert frontend path when frontend is deployed
/* app.use(cors(corsOptions)) */
app.use(express.urlencoded ({extended: false}));
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
