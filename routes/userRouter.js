const { Router } = require("express");
const { User } = require("../models/user");
const verifyAdmin = require("./verifyAdmin");
const verifySpecificUser = require("./verifySpecificUser");
const userRouter = Router();
const bcrypt = require("bcryptjs");

// get all users
userRouter.get("/users", verifyAdmin, (req, res) => {
  User.find()
    .populate("favorites", "artist title video_url")
    .populate({
      path: "playlists",
      populate: { path: "video_list", select: "artist title video_url" },
    })
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
});

//get specific user
userRouter.get("/users/:user_id", verifySpecificUser, (req, res) => {
  const { user_id } = req.params;
  User.find({ _id: user_id })
    .populate("favorites", "artist title video_url")
    .populate({
      path: "playlists",
      populate: { path: "video_list", select: "artist title video_url" },
    })
    .then((user) => res.json(user))
    .catch(() => res.json("User does not exist"));
});

//update a specific user (only doable by user himself if he has token and password)
userRouter.put("/users/:user_id", verifySpecificUser, async (req, res) => {
  console.log(req.body)
  const { user_id } = req.params;
  let dbpw = "";
  await User.findOne({ _id: user_id })
    .exec()
    .then((res) => (dbpw = res.password));
  const comparePassword = await bcrypt.compare(req.body.currentPassword, dbpw);
  if (!comparePassword) return res.status(400).send("Wrong password");
  let user = req.body;
  if (req.body.password !== "") {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(user.password, salt);
    user.password = hashPassword;
  } else user.password = dbpw;
  // maybe there is a better way without making a second call
  User.findOneAndUpdate({ _id: user_id }, user)
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
});

//to add videos to favourites for specific user

userRouter.put(
  "/users/:user_id/favorites",
  verifySpecificUser,
  async (req, res) => {
    const { user_id } = req.params;
    const { video_id } = req.body;

    let user = {};
    await User.findOne({ _id: user_id })
      .exec()
      .then((res) => (user = res));
    console.log(user);
    if (user.favorites.includes(video_id))
      return res.status(409).send("Video already exist.");
    user.favorites.push(video_id);
    User.findOneAndUpdate({ _id: user_id }, user)
      .then((res) => res.json(user))
      .catch((err) => res.json(err));
  }
);

//to remove video from favorites
userRouter.put(
  "/users/:user_id/removefavorites",
  verifySpecificUser,
  async (req, res) => {
    const { user_id } = req.params;
    const { video_id } = req.body;

    let user = {};
    await User.findOne({ _id: user_id })
      .exec()
      .then((res) => (user = res));
    console.log(user);
    if (!user.favorites.includes(video_id))
      return res.status(409).send("Video doesn't exist.");
    user.favorites.splice(user.favorites.indexOf(video_id), 1);
    User.findOneAndUpdate({ _id: user_id }, user)
      .then((res) => res.json(user))
      .catch((err) => res.json(err));
  }
);

// to promote a user to content creater
userRouter.put("/users/:user_id/promote", verifyAdmin, (req, res) => {
  const { user_id } = req.params;
  User.findOneAndUpdate(
    { _id: user_id, role: "user" },
    { role: "content_creator" }
  )
    .then((user) =>
      res.json(
        user === null
          ? "User can't be promoted"
          : "User has been promoted to content_creator"
      )
    )
    .catch((err) => res.json(err));
});

//To demote a content creator to user
userRouter.put("/users/:user_id/demote", verifyAdmin, (req, res) => {
  const { user_id } = req.params;
  User.findOneAndUpdate(
    { _id: user_id, role: "content_creator" },
    { role: "user" }
  )
    .then((user) =>
      res.json(
        user === null
          ? "User can't be demoted"
          : "Content_creator has been demoted to user"
      )
    )
    .catch((err) => res.json(err));
});

// make someone an admin (handle with care!!!)
userRouter.put("/users/:user_id/makeAdmin", verifyAdmin, (req, res) => {
  const { user_id } = req.params;
  User.findOneAndUpdate({ _id: user_id }, { role: "admin" })
    .then((user) =>
      res.json(
        user === null
          ? "User can't be promoted"
          : "User has been promoted to admin"
      )
    )
    .catch((err) => res.json(err));
});

// delete a specific user (only available to user himself and admin)
userRouter.delete("/users/:user_id", verifySpecificUser, (req, res) => {
  const { user_id } = req.params;
  User.findOneAndDelete({ _id: user_id, role: "user" || "content_creator" })
    .then((user) => {
      user === null
        ? res.json("User doesn't exist or is an admin")
        : res.json("User has been deleted successfully");
    })
    .catch((err) => res.json(err));
});

module.exports = userRouter;
