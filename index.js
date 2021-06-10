const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3001;
const userRouter = require('./routes/userRouter')
const videoRouter = require('./routes/videoRouter')
const playlistRouter = require('./routes/playlistRouter')
const authRouter = require('./routes/authRouter')

require('dotenv').config();
app.use(express.urlencoded ({extended: false}));

mongoose.connect(process.env.MONGO_DB, {useNewUrlParser : true, useUnifiedTopology : true});

app.get('/', (req, res) => {
    res.send('Welcome')
})


app.use(userRouter)
app.use(videoRouter)
app.use(playlistRouter)
app.use(authRouter)


app.listen(PORT, console.log(`Running on ${PORT}`))