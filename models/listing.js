const mongoose = require("mongoose");
// const review = require("./review");
// const { types } = require("joi");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default: "https://media.istockphoto.com/id/1127245421/photo/woman-hands-praying-for-blessing-from-god-on-sunset-background.jpg?s=612x612&w=0&k=20&c=dTR8aj0xt7DLhxS9vogRbwY8VIg9U4AzkpB_iTTyr10=",
        set: (v) =>
            v === ""
                ? "https://media.istockphoto.com/id/1127245421/photo/woman-hands-praying-for-blessing-from-god-on-sunset-background.jpg?s=612x612&w=0&k=20&c=dTR8aj0xt7DLhxS9vogRbwY8VIg9U4AzkpB_iTTyr10="
                : v,
},
    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});


listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;