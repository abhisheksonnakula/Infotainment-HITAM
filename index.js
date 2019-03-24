const expressEdge = require("express-edge");
const express = require("express");
const edge = require("edge.js");
const cloudinary = require('cloudinary');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const expressSession = require("express-session");
const connectMongo = require("connect-mongo");
const connectFlash = require("connect-flash");

const createPostController = require("./controllers/createPost");
const homePageController = require("./controllers/homePage");
const storePostController = require("./controllers/storePost");
const getPostController = require("./controllers/getPost");
const createUserController = require("./controllers/createUser");
const storeUserController = require("./controllers/storeUser");
const loginController = require("./controllers/login");
const loginUserController = require("./controllers/loginUser");
const logoutController = require("./controllers/logout");
const myblogsController = require("./controllers/myblogs");
const deletepostController = require("./controllers/deletePost")

const app = new express();
mongoose.connect("mongodb://admin:admin123@ds227255.mlab.com:27255/infotainment");

app.use(connectFlash());

cloudinary.config({
  api_key: '749253625919411',
  api_secret: 'PoovS_pR72wlWar0mP_bcCUhymA',
  cloud_name: 'doctorsprofile',
});

const mongoStore = connectMongo(expressSession);

app.use(
  expressSession({
    secret: "secret",
    store: new mongoStore({
      mongooseConnection: mongoose.connection
    })
  })
);

app.use(fileUpload());
app.use(express.static("public"));
app.use(expressEdge);
app.set("views", `${__dirname}/views`);

app.use("*", (req, res, next) => {
  edge.global("auth", req.session.userId);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storePost = require("./middleware/storePost");
const auth = require("./middleware/auth");
const redirectIfAuthenticated = require("./middleware/redirectIfAuthenticated");

app.get("/", homePageController);
app.get("/post/:id", getPostController);
app.get("/auth/logout", auth, logoutController);
app.get("/posts/new", auth, createPostController);
app.post("/posts/store", auth, storePost, storePostController);
app.get("/auth/login", redirectIfAuthenticated, loginController);
app.post("/users/login", redirectIfAuthenticated, loginUserController);
app.get("/auth/register", redirectIfAuthenticated, createUserController);
app.get("/myblogs",auth,myblogsController)
app.post("/users/register", redirectIfAuthenticated, storeUserController);
app.get("/deletepost/:id",auth,deletepostController)
app.use((req, res) => res.render('not-found'));

app.listen(process.env.PORT || 4000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

