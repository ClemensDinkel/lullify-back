const { Router } = require('express');
const YTApiRouter = Router();
const verifyCC = require("./verifyCC");
const fetch = require("node-fetch");

// fetch video data from Youtube api for autofill of form on frontend
YTApiRouter.get('/ytapi', verifyCC, async (req, res) => {
    try {
        const searchString = req.query.q;
        const response = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&key=${process.env.YOUTUBE_API_KEY}&q=${searchString}`);
        const json = await response.text()
        const results = JSON.parse(json).items
        return res.json(results)
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }
})

module.exports = YTApiRouter;