var express = require("express");
var app = express();
var bodyParser =require("body-parser");
var mongoose=require("mongoose");

mongoose.connect("mongodb://localhost/package");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");

var packageSchema= new mongoose.Schema({
    placeName:String,
    image:String,
    ppcost:String,
    address:String,
    specification:String
});
var Package=mongoose.model("Package",packageSchema);

/* Package.create(
    {name:"Area 51", image:"http://apnaajaipur.com/public/site/images/products/deal_images/deal_image_0_35c2c88c8bd5ade149b5f56d8d91aa3620160918060518Area%20511.jpg",
     ppcost:"500", 
     venue:"near mango hotel,RajaPark",
     specification:"RoofTop, lounge"},
    function(err, package){
        if(err){
            console.log(err);
        }
        else{
            console.log("NEWLY CREATED PACKAGE");
            console.log(package);
        }
    }); */
/* var packages=[
    {name:"Area 51", image:"http://apnaajaipur.com/public/site/images/products/deal_images/deal_image_0_35c2c88c8bd5ade149b5f56d8d91aa3620160918060518Area%20511.jpg", ppcost:"500", venue:"near mango hotel,RajaPark",specification:"RoofTop, lounge"},
    {name:"Area 51", image:"http://apnaajaipur.com/public/site/images/products/deal_images/deal_image_0_35c2c88c8bd5ade149b5f56d8d91aa3620160918060518Area%20511.jpg", ppcost:"500", venue:"near mango hotel,RajaPark",specification:"RoofTop, lounge"}
]; */
app.get("/",function(req,res){
   res.render("home");
});

app.get("/plan",function(req,res){
    Package.find({},function(err,packages){
        if(err){
            console.log(err);
        }
        else{
            res.render("plan",{packages:packages});
            
        }
    });
});

app.post("/plan",function(req,res){
    var placeName=req.body.placeName;
    var image=req.body.image;
    var ppcost=req.body.ppcost;
    var address=req.body.address;
    var specification=req.body.specification;
    var newPackage={name:placeName,image:image,ppcost:ppcost,venue:address,specification:specification};
    //create a new package  and save to database
    Package.create(newPackage,function(err,newpackage){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/plan");
        }
    });
   
});

app.get("/plan/new",function(req,res){
    res.render("new");
});

app.listen(3000, function () {
    console.log("The YelpCamp server has started");
});