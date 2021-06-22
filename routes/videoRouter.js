const { Router } = require('express');
const { Video } = require('../models/video')
const verifyCC = require("./verifyCC");
const verifySpecificUser = require('./verifySpecificUser');
const verifyUser = require('./verifyUser')
const videoRouter = Router();

// get all videos
videoRouter.get('/videos', (req, res) => {
    Video.find()
        .populate('uploader_id', "_id user_name")
        .then(video => res.json(video))
        .catch(err => res.json(err))
})

// get all videos of a scecific uploader
videoRouter.get('/videos/byUploader/:user_id', verifyCC, verifySpecificUser, (req, res) => {
    const { user_id } = req.params
    Video.find({ uploader_id: user_id })
        .populate('uploader_id', "_id user_name")
        .then(video => res.json(video))
        .catch(err => res.json(err))
})

// get specific video
videoRouter.get('/videos/:video_id', (req, res) => {
    const { video_id } = req.params
    Video.find({ _id: video_id })
        .populate('uploader_id', "_id user_name")
        .then(video => res.json(video))
        .catch(err => res.json(err))
})

// upload a video
videoRouter.post('/videos', verifyCC, (req, res) => {
    Video.create(req.body)
        .then(video => res.json(video))
        .catch(err => res.json(err))
})

//report a video because of unfitting content
videoRouter.put('/videos/:video_id/report', verifyUser, async (req, res) => {
    const { video_id } = req.params
    const { user_id } = req.body
    let video = {}
    await Video.findOne({ _id: video_id })
        .exec()
        .then(res => video = res)
    console.log(video)
    if (video.reportedBy.includes(user_id)) return res.status(409).send("Video already reported by this user.")
    video.reports++;
    video.reportedBy.push(user_id)
    Video.findOneAndUpdate({ _id: video_id }, video)
        .then(res => res.json(video))
        .catch(err => res.json(err))
})

// get all videos of one uploader
videoRouter.get("/users/:user_id/videos", verifySpecificUser, (req, res) => {
    const { user_id } = req.params;
    Video.find({ uploader_id: user_id })
        .populate("uploader_id", "_id user_name")
        .then((video) => res.json(video))
        .catch((err) => res.json(err));
});

// update a specific video (only possible if you're the uploader)
videoRouter.put("/users/:user_id/videos/:video_id", verifyCC, verifySpecificUser, (req, res) => {
    const { video_id} = req.params;
    Video.findOneAndUpdate({ _id: video_id}, req.body)
        .then((video) => res.json(video))
        .catch((err) => res.json(err));
}
);

// delete a specific video(only possible if you are creator)
videoRouter.delete("/users/:user_id/videos/:video_id", verifyCC, verifySpecificUser, (req, res) => {
      const { video_id} = req.params;
      Video.deleteOne({ _id: video_id})
        .then(() => res.json("Video has been deleted successfully"))
        .catch((err) => res.json(err));
    }
  );

module.exports = videoRouter;