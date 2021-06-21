const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3001;
const userRouter = require('./routes/userRouter')
const videoRouter = require('./routes/videoRouter')
const playlistRouter = require('./routes/playlistRouter')
const authRouter = require('./routes/authRouter')
const requestRouter = require('./routes/requestRouter')
const cors = require('cors')
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
}
require('dotenv').config();
app.use(express.urlencoded ({extended: false}));
app.use(cors(corsOptions))
mongoose.connect(process.env.MONGO_DB, {useNewUrlParser : true, useUnifiedTopology : true});

app.get('/', (req, res) => {
    res.send('Welcome')
})

app.use(userRouter)
app.use(videoRouter)
app.use(playlistRouter)
app.use(authRouter)
app.use(requestRouter)


app.listen(PORT, console.log(`Running on ${PORT}`))