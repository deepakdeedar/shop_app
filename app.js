const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const errorController = require("./controllers/error");
const Users = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  Users.findById("5ef1ac70a871cf8ef92a1bd9")
    .then((user) => {
      req.user = new Users(user.name, user.email, user._id, user.cart);
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://deepakdeedar:XAByB900ui9xX8q4@cluster0-dztfu.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
