const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../Schema.js");



const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if (error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    }
};


// Index Route
router.get("/", wrapAsync(async (req,res) =>{
    const allListing=await Listing.find({});
    res.render("listings/index.ejs", {allListing})
    }));

// New Route
router.get("/new", (req,res) => {
    res.render("listings/new.ejs");
});

// show Route
router.get("/:id", wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing})
}));

// Create Route
router.post("/", validateListing, wrapAsync(async(req,res) => {
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

    await newListing.save();
    res.redirect("/listings");
}));


// Edit Route 
router.get("/:id/edit", wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

// Update Route
router.put("/:id", validateListing, wrapAsync(async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

// Delete Route
router.delete("/:id", wrapAsync(async (req,res) => {
    let {id} = req.params;
    let deleteListings = await Listing.findByIdAndDelete(id);
    console.log(deleteListings);
    res.redirect("/listings");
}));


module.exports = router;