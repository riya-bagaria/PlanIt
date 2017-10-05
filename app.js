var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride= require("method-override");

mongoose.connect("mongodb://localhost/package");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

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
            res.render("plan", {
                packages: packages
            });

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

app.get("/plan/new", function (req, res) {
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
app.get("/plan/:id/edit", function (req, res) {
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
app.listen(3000, function () {
    console.log("The YelpCamp server has started");
});