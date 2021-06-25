const { Router } = require("express");
const { Playlist } = require("../models/playlist");
const playlistRouter = Router();
const verifyAdmin = require("./verifyAdmin");
const verifyUser = require("./verifyUser");
const verifySpecificUser = require("./verifySpecificUser");

// to get all playlist (only admin can have access)
playlistRouter.get("/playlists", verifyAdmin, (req, res) => {
  Playlist.find()
    .populate("video_list", "artist title video_url")
    .populate("user_id", "user_name")
    .then((playlist) => res.json(playlist))
    .catch((err) => res.json(err));
});

// post a new playlist
playlistRouter.post("/playlists", verifyUser, (req, res) => {
  Playlist.create(req.body)
    .then((playlist) => res.json(playlist))
    .catch((err) => res.json(err));
});

//Get playlists for specific user
playlistRouter.get(
  "/users/:user_id/playlists",
  verifySpecificUser,
  (req, res) => {
    const { user_id } = req.params;

    Playlist.find({ user_id: user_id }) //get with findOne only gave one result from data base
      .populate("video_list", "title")
      .then((playlist) => res.json(playlist))
      .catch((err) => res.json(err));
  }
);

// get a specific playlist of a specific user
playlistRouter.get(
  "/users/:user_id/playlists/playlist_id",
  verifySpecificUser,
  (req, res) => {
    const { playlist_id } = req.params;
    Playlist.find({ _id: playlist_id })
      .populate("video_list", "artist title video_url")
      .populate("user_id", "user_name")
      .then((playlist) => res.json(playlist))
      .catch((err) => res.json(err));
  }
);

// to update playlist of a specific user
playlistRouter.put(
  "/users/:user_id/playlists/:playlist_id",
  verifySpecificUser,
  (req, res) => {
    const { playlist_id } = req.params;
    Playlist.findOneAndUpdate({ _id: playlist_id }, req.body)
      .then((playlist) => res.json(playlist))
      .catch((err) => res.json(err));
  }
);

//To add videos to playlist
playlistRouter.put(
  "/users/:user_id/playlists/:playlist_id/video",
  verifySpecificUser,
  async (req, res) => {
    const { playlist_id } = req.params;
    const { video_id } = req.body;
    let playlist = {};
    await Playlist.findOne({ _id: playlist_id })
      .exec()
      .then((res) => (playlist = res));
    console.log(playlist);
    if (playlist.video_list.includes(video_id))
      return res.status(409).send("Video already exist.");
    playlist.video_list.push(video_id);
    Playlist.findOneAndUpdate({ _id: playlist_id }, playlist)
      .then((res) => res.json(playlist))
      .catch((err) => res.json(err));
  }
);

// delete playlists  of specific user
playlistRouter.delete(
  "/users/:user_id/playlists/:playlist_id",
  verifySpecificUser,
  (req, res) => {
    const { playlist_id } = req.params;
    Playlist.findOneAndDelete({ _id: playlist_id })
      .then(res.json("Playlist has been deleted successfully"))
      .catch((err) => res.json(err));
  }
);

module.exports = playlistRouter;
