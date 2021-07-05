const { Router } = require("express");
const { Video } = require("../models/video");
const verifyCC = require("./verifyCC");
const verifySpecificUser = require("./verifySpecificUser");
const verifyUser = require("./verifyUser");
const videoRouter = Router();

// get all videos
videoRouter.get("/videos", (req, res) => {
  const { lang, filter } = req.query
  let filterArr = null;
  if (filter) filterArr = filter.split(" ")
  const reg = new RegExp(filter)
  console.log(lang)
  console.log(filter)
  console.log(reg)
  console.log(filterArr)
  let query = {}
  /* if (lang && filter) query.$and = [{languages: lang}, {artist:{$regex: filter}}] */
  /* else */ if (lang) query.languages = lang
  // else if (filter) query.$or = [{ title: { $regex: reg, $options: 'i' } }, { tags: { $regex: reg, $options: 'i' } }, { artist: { $regex: reg, $options: 'i' } }]
  // else if (filter) query.$or = [{title: {$regex: filter}}, {tags: {$regex: filter}}, {artist: {$regex: filter}}]
  // else if (filter) query.$or = [{ title: { $in: filterArr } }, { tags: { $in: filterArr } }, { artist: { $in: filterArr } }] * /
  // else if (filter) query.$or = [{ title: filter }, { tags: filter }, { artist: filter }]
  else if (filter) query = {$text: {$search : filter}}  // need to create index which is in video schema

  /* else if (filter) {
    query.$or = []
    query.$or[0] = {title: {$in: filterArr}}
    query.$or[1] = {tags: {$in: filterArr}}
    query.$or[1] = {artist: {$in: filterArr}}
  } */

  console.log(query)
  Video.find(query)
    .populate("uploader_id", "_id user_name")
    .then((videos) => res.json(videos))
    .catch((err) => res.json(err));
});
/* {languages: { $elemMatch : {$in: lang}}}  /// {languages: "de"} */

// get all videos of a specific uploader
videoRouter.get(
  "/videos/byUploader/:user_id",
  verifyCC,
  verifySpecificUser,
  (req, res) => {
    const { user_id } = req.params;
    Video.find({ uploader_id: user_id })
      .populate("uploader_id", "_id user_name")
      .then((video) => res.json(video))
      .catch((err) => res.json(err));
  }
);

// get specific video
videoRouter.get("/videos/:video_id", (req, res) => {
  const { video_id } = req.params;
  Video.find({ _id: video_id })
    .populate("uploader_id", "_id user_name")
    .then((video) => res.json(video))
    .catch((err) => res.json(err));
});

// upload a video
videoRouter.post("/videos", verifyCC, (req, res) => {
  Video.create(req.body)
    .then((video) => res.json(video))
    .catch((err) => res.json(err));
});

//report a video because of unfitting content
videoRouter.put("/videos/:video_id/report", verifyUser, async (req, res) => {
  const { video_id } = req.params;
  const { user_id } = req.body;
  let video = {};
  await Video.findOne({ _id: video_id })
    .exec()
    .then((res) => (video = res));
  if (video.reportedBy.includes(user_id))
    return res.status(409).send("Video already reported by this user.");
  video.reports++;
  video.reportedBy.push(user_id);
  Video.findOneAndUpdate({ _id: video_id }, video, { new: true })
    .then((video) => res.json(video))
    .catch((err) => res.json(err));
});

//"unreport" a video in case you missclicked
videoRouter.put("/videos/:video_id/unreport", verifyUser, async (req, res) => {
  const { video_id } = req.params;
  const { user_id } = req.body;
  let video = {};
  await Video.findOne({ _id: video_id })
    .exec()
    .then((res) => (video = res));
  if (!video.reportedBy.includes(user_id))
    return res.status(409).send("Video has never been reported by this user.");
  video.reports--;
  video.reportedBy.splice(video.reportedBy.indexOf(user_id), 1)
  Video.findOneAndUpdate({ _id: video_id }, video, { new: true })
    .then((video) => res.json(video))
    .catch((err) => res.json(err));
});


// get all videos of one uploader
videoRouter.get("/users/:user_id/videos", verifySpecificUser, (req, res) => {
  const { user_id } = req.params;
  Video.find({ uploader_id: user_id })
    .populate("uploader_id", "_id user_name")
    .then((videos) => res.json(videos))
    .catch((err) => res.json(err));
});

// update a specific video (only possible if you're the uploader)
videoRouter.put(
  "/users/:user_id/videos/:video_id",
  verifyCC,
  verifySpecificUser,
  (req, res) => {
    const { video_id } = req.params;
    Video.findOneAndUpdate({ _id: video_id }, req.body, { new: true })
      .then((video) => res.json(video))
      .catch((err) => res.json(err));
  }
);

// delete a specific video(only possible if you are creator)
videoRouter.delete(
  "/users/:user_id/videos/:video_id",
  verifyCC,
  verifySpecificUser,
  (req, res) => {
    const { video_id } = req.params;
    Video.deleteOne({ _id: video_id })
      .then(() => res.json("Video has been deleted successfully")) // return video_id as well for immediate update on frontend?
      .catch((err) => res.json(err));
  }
);

module.exports = videoRouter;
