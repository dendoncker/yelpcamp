const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Review = require('./review.js');

const imageSchema = new Schema({
    url: {
        type: String
    },
    filename: {
        type: String
    }
});

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/c_fill,h_140,w_210');
});

imageSchema.virtual('standard').get(function () {
    return this.url.replace('/upload', '/upload/c_fill,h_460,w_690');
});


const options = {
    toJSON: {
        virtuals: true
    }
};


const campgroundSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    images: [
        imageSchema
    ],
    reviews: [{
        type: mongoose.Types.ObjectId,
        ref: 'Review'
    }],
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
}, options);

// ****Virtuals for the mapbox cluster map

campgroundSchema.virtual('properties.popupHtml').get(function () {
    return `<a style="text-decoration: none;" href=campgrounds/${this._id}><h6>${this.title}</h6>
            <p style="text-decoration: none; color:#000000">${this.description.slice(0, 100)}...</p></a>`;
    ;
});

campgroundSchema.post('findOneAndDelete', async function (campground) {
    await Review.deleteMany({ _id: { $in: campground.reviews } });
});

module.exports = mongoose.model('Campground', campgroundSchema);