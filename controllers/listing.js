const Listing = require("../models/listing.js");
const axios = require("axios");
let MAP_API_KEY = process.env.MAP_API_KEY




// Index Route
module.exports.index = async (req,res) =>{
    const {search, amenities} = req.query;
    let filter = {};
    let allListing;
    if (search){
        allListing = await Listing.find({
            $or: [
                {title: {$regex: search, $options:"i"}},
                {location: {$regex: search, $options:"i"}},
                {country: {$regex: search, $options:"i"}},
                {description: {$regex: search, $options:"i"}},
            ]
        });
    } else if (amenities) {
        filter.amenities ={
            $all: [].concat(amenities)
        };
        allListing = await Listing.find(filter);
    } else {
        allListing = await Listing.find({});
    }
    res.render("listings/index.ejs", {allListing, selectedAmenities: [].concat(amenities || [])})
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
    
    // Get coordinates from MapTiler
    const geoResponse = await axios.get(
        `https://api.maptiler.com/geocoding/${newListing.location}.json?key=${MAP_API_KEY}`
    );
    // Extract coordinates
    const coordinates = geoResponse.data.features[0].geometry.coordinates;
    // Add geometry field
    newListing.geometry = {
        type: "Point",
        coordinates: coordinates
    };

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
        let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
        res.render("listings/edit.ejs",{listing, originalImageUrl});
    }
};

// Update Route
module.exports.updateListing = async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
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