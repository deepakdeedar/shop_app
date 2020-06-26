const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

const errorController = require("./controllers/error");
const User = require("./models/user");

const MONGO_URI = "mongodb+srv://deepakdeedar:XAByB900ui9xX8q4@cluster0-dztfu.mongodb.net/shop?retryWrites=true&w=majority";

const app = express();
const store = new MongoDbStore({
  uri: MONGO_URI,
  collection: 'sessions',
});

const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({ secret: "my secret", resave: false, saveUninitialized: false, store: store })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {

  if(!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  app.locals.isAuthenticated = req.session.isLoggedIn;
  app.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((result) => {
    console.log("connected");
    app.listen(3000);
  })
  .catch((err) => console.log(err));
