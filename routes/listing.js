const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");



// Index Route
router.get("/", wrapAsync(async (req,res) =>{
    const allListing=await Listing.find({});
    res.render("listings/index.ejs", {allListing})
    }));

// New Route
router.get("/new", isLoggedIn, (req,res) => {
    res.render("listings/new.ejs");
});

// show Route
router.get("/:id", wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate:{path: "author",},}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exit!");
        res.redirect("/listings")
    }else{
        res.render("listings/show.ejs",{listing})
    }
}));

// Create Route
router.post("/", isLoggedIn, validateListing, wrapAsync(async(req,res) => {
    // if(!req.body.listing) {
    //     throw new ExpressError(400, "Send valid data for listing");
    // }
    
    const newListing = new Listing(req.body.listing);
    
    // if (!newListing.title){
    //     throw new ExpressError(400, "Title is missing!");
    // }
    // if (!newListing.description){
    //     throw new ExpressError(400, "Description is missing!");
    // }
    // if (!newListing.price){
    //     throw new ExpressError(400, "Price is missing!");
    // }
    // if (!newListing.country){
    //     throw new ExpressError(400, "Country is missing!");
    // }
    // if (!newListing.location){
    //     throw new ExpressError(400, "Location is missing!");
    // }

    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}));


// Edit Route 
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exit!");
        res.redirect("/listings")
    }else{
        res.render("listings/edit.ejs",{listing});
    }
}));

// Update Route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

// Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req,res) => {
    let {id} = req.params;
    let deleteListings = await Listing.findByIdAndDelete(id);
    console.log(deleteListings);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}));


module.exports = router;