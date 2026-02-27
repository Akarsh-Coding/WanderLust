const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage,cloudinary} = require("../cloudConfig.js")
const upload = multer({ storage})


// Index & Create Route
router.route("/")
    .get(wrapAsync(listingController.index))   // Index Route
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing)); // Create Route

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show, Update & Delete Route
router.route("/:id")
    .get(wrapAsync(listingController.showListing)) // show Route
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))   // Update Route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));    // Delete Route

// Edit Route 
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;