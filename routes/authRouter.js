const { Router } = require("express");
const { User } = require("../models/user");
const { Request } = require("../models/request");
const authRouter = Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
authRouter.use(cookieParser());

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.SECRET, { expiresIn: "20mins" });
};
const generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_SECRET, { expiresIn: "72hours" });
};

// refresh accesstoken using refreshtoken
authRouter.post("/refresh", (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  if (refreshToken === null) return res.status(401).send("Access denied");
  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).send("Token no longer valid");
    const tokenData = {
      id: user.id,
      user_name: user.user_name,
      role: user.role,
    };
    const accessToken = generateAccessToken(tokenData);
    res.send({ accessToken: accessToken });
  });
});

// logout deleting access (on frontend) and refresh token (here)
authRouter.get("/logout", (req, res) => {
  /* cookies.set('refresh_token', { expires: Date.now() }); */
  res
    .clearCookie("refresh_token")
    .status(204)
    .send("Logout successful");
});

// register a new user
authRouter.post("/register", async (req, res) => {
  if (!req.body.password) return res.send("No password provided");
  const checkEmail = await User.findOne({ email: req.body.email });
  if (checkEmail) return res.status(400).send("Email already exist");

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  const {
    first_name,
    last_name,
    user_name,
    email,
    phone,
    city_code,
    city_name,
    country,
    company,
    requested_to_be_cc,
  } = req.body;
  const user = new User({
    first_name: first_name,
    last_name: last_name,
    user_name: user_name,
    email: email,
    password: hashPassword,
    phone: phone,
    city_code: city_code,
    city_name: city_name,
    country: country,
    company: company,
  });

  const request = new Request({
    user_id: user._id,
  });

  console.log(user);
  console.log(request);
  console.log(requested_to_be_cc);

  user
    .save()
    .then((user) => {
      console.log("user created");
      res.json(user);
    })
    .catch((err) => res.json(err));

  if (requested_to_be_cc && request.user_id != null) {
    request
      .save()
      .then((request) => {
        console.log("request created");
        res.json(request);
      })
      .catch((err) => res.json(err));
  }
});

// login to get access and refresh token
authRouter.post("/login", async (req, res) => {
  const user = await User.findOne(
    { email: req.body.email } /* || {user_name : req.body.user_login} */
  );
  if (!user) return res.status(400).send("User not found");

  const comparePassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!comparePassword) return res.status(400).send("Wrong password");

  const userData = {
    id: user._id,
    user_name: user.user_name,
    role: user.role,
  };
  const accessToken = generateAccessToken(userData);
  const refreshToken = generateRefreshToken(userData);
  /* res.header('auth-token', {accessToken: accessToken, refreshToken: refreshToken}) */
  res
    .status(201)
    .cookie("refresh_token", refreshToken, {
      maxAge: 48 * 60 * 60 * 1000, // 48 hours
      httpOnly: true,
      /* secure: true,
      sameSite: none, */
    })
    /* .cookie('access_token', accessToken, {
            maxAge: 20 * 60 * 1000, // 20 mins
            httpOnly: true, 
            // secure: true,
            // sameSite: none
        }) */
    .send({ accessToken: accessToken });
});

module.exports = authRouter;
