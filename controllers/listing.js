const Listing = require("../models/listing.js");




// Index Route
module.exports.index = async (req,res) =>{
    const allListing=await Listing.find({});
    res.render("listings/index.ejs", {allListing})
};

// New Route
module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs");
};

// show Route
module.exports.showListing = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate:{path: "author",},}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exit!");
        res.redirect("/listings")
    }else{
        res.render("listings/show.ejs",{listing})
    }
};

// Create Route
module.exports.createListing = async(req,res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    
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
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};

// Edit Route 
module.exports.renderEditForm = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exit!");
        res.redirect("/listings")
    }else{
        res.render("listings/edit.ejs",{listing});
    }
};

// Update Route
module.exports.updateListing = async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

// Delete Route
module.exports.destroyListing = async (req,res) => {
    let {id} = req.params;
    let deleteListings = await Listing.findByIdAndDelete(id);
    console.log(deleteListings);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};