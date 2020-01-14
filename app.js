//Package Includes
const express           = require("express");
const bodyParser        = require("body-parser");
const mongoose          = require("mongoose");
const methodOverride    = require("method-override");
const Campground        = require("./models/campground");
const passport          = require("passport");
const LocalStrategy     = require("passport-local");
const User              = require("./models/user");
const Comment           = require("./models/comment");
const seedDB            = require("./seeds");
const flash             = require("connect-flash");

//Route Includes
var commentRoutes       = require("./routes/comments");
var campgroundRoutes    = require("./routes/campgrounds");
var indexRoutes         = require("./routes/index");

const app               = express();
const port              = 3000;


mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true, useFindAndModify: false});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seedDB();

app.locals.moment = require('moment');

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "This is the super secret secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//settings Local variables
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//Setting up basic paths
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//Setting up port
app.listen(port, () => console.log(`Yelp Camp Page Started on port ${port}!`) );