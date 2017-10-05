var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride= require("method-override");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");

mongoose.connect("mongodb://localhost/package");
app.use(require("express-session")({
    secret:"Rusty is the best and cutest dog in the world",
    resave:false,
    saveUninitialized:false
}));


app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


var packageSchema = new mongoose.Schema({
    placeName: String,
    image: String,
    ppcost: String,
    address: String,
    specification: String
});
var Package = mongoose.model("Package", packageSchema);

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/plan", function (req, res) {
    Package.find({}, function (err, packages) {
        if (err) {
            console.log(err);
        } else {
            res.render("plan", {packages: packages,currentUser:req.user});

        }
    });
});

app.post("/plan", function (req, res) {
    var placeName = req.body.placeName;
    var image = req.body.image;
    var ppcost = req.body.ppcost;
    var address = req.body.address;
    var specification = req.body.specification;
    var newPackage = {
        placeName: placeName,
        image: image,
        ppcost: ppcost,
        address: address,
        specification: specification
    };
    //create a new package  and save to database
    Package.create(newPackage, function (err, newpackage) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/plan");
        }
    });

});

app.get("/plan/new",isLoggedIn, function (req, res) {
    res.render("new");
});

app.get("/plan/:id", function (req, res) {
    Package.findById(req.params.id, function (err, foundPackage) {
        if (err) {
            console.log(err);
        } else {
            res.render("show", {
                package: foundPackage
            });
        }
    });
});
//edit the package
app.get("/plan/:id/edit",isLoggedIn, function (req, res) {
    Package.findById(req.params.id, function (err, foundPackage) {
        if (err) {
            res.redirect("/plan");
        } else {
            res.render("edit",{package:foundPackage});
        }
    });
});

//update package
app.put("/plan/:id",function(req,res){
    Package.findByIdAndUpdate(req.params.id, req.body.package, function(err, updatePackage){
        if(err){
            res.redirect("/plan");
        }
        else{
            res.redirect("/plan/"+req.params.id);
        }
    });
});

//destroy package
app.delete("/plan/:id",function(req,res){
    Package.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/plan");
        }
        else{
            res.redirect("/plan");
        }
    });
});
app.get("/register",function(req,res){
 res.render("register");
});
app.post("/register",function(req,res){
    var newUser = new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/plan");
        });
    });
});
/* router.get("/login", function (req, res) {
    res.render("login",{message:req.flash("error")});
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campground",
    failureRedirect: "/login"
}), function (req, res) {

});

//logout route
router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/campground");
}) */
app.get("/login",function(req,res){
    res.render("login");
});
//handling login logic

app.post("/login",passport.authenticate("local",
    {
        successRedirect:"/plan",
        failureRedirect:"/login"
    }),function(req,res){
});

app.get("/logout",function(req,res){
   req.logout();
   res.redirect("/plan");
});
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
app.listen(3000, function () {
    console.log("The YelpCamp server has started");
});