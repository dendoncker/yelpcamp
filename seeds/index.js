const mongoose = require('mongoose');
const Campground = require('../models/campground.js');
const cities = require('./cities.js');
const { descriptors, places } = require('./seedHelpers.js');

mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        // const randomNum = Math.floor(Math.random() * cities.length);

        const randomCity = sample(cities);
        const newCamp = new Campground({
            title: sample(descriptors) + ' ' + sample(places),
            price: Math.floor((Math.random() * 40) + 10),
            city: randomCity.city,
            state: randomCity.state,
            geometry: {
                type: 'Point',
                coordinates: [
                    randomCity.longitude, randomCity.latitude
                ]
            },
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quos dolore natus maxime blanditiis tenetur? Iste, impedit vero! Modi, rerum ipsam beatae sequi iste, perspiciatis perferendis, repellendus sint accusamus ex sit?',
            images: [
                {
                    url: 'https://res.cloudinary.com/df4rzp9oa/image/upload/v1699603775/yelpcamp/mj02cjtwi4ksjmkmblha.avif',
                    filename: 'yelpcamp/mj02cjtwi4ksjmkmblha',
                },
                {
                    url: 'https://res.cloudinary.com/df4rzp9oa/image/upload/v1699603776/yelpcamp/ilgt7hcdgcducxzygdgl.avif',
                    filename: 'yelpcamp/ilgt7hcdgcducxzygdgl',
                },
                {
                    url: 'https://res.cloudinary.com/df4rzp9oa/image/upload/v1699603776/yelpcamp/welbdt3hoijze6ql6imw.avif',
                    filename: 'yelpcamp/welbdt3hoijze6ql6imw',
                },
                {
                    url: 'https://res.cloudinary.com/df4rzp9oa/image/upload/v1699604832/yelpcamp/i2zfle05kqxufwmejhim.avif',
                    filename: 'yelpcamp/i2zfle05kqxufwmejhim',
                },
                {
                    url: 'https://res.cloudinary.com/df4rzp9oa/image/upload/v1699604832/yelpcamp/bs9jtentckk3t4oxnl9c.avif',
                    filename: 'yelpcamp/bs9jtentckk3t4oxnl9c',
                },
                {
                    url: 'https://res.cloudinary.com/df4rzp9oa/image/upload/v1699604833/yelpcamp/btq5k68yb35wozmusnbh.avif',
                    filename: 'yelpcamp/btq5k68yb35wozmusnbh',
                },
                {
                    url: 'https://res.cloudinary.com/df4rzp9oa/image/upload/v1699604928/yelpcamp/rkccydv3ghiecryvvgkd.avif',
                    filename: 'yelpcamp/rkccydv3ghiecryvvgkd',
                }
            ],
            author: '6547b6b2460414c6a98e89e7',
        });
        await newCamp.save();
    }
};


seedDB().then(() => {
    db.close();
    console.log('connection closed');
});

// ***********************************************
// TO DELETE SOME CAMPS IN THE DB
// ***********************************************

// const deleteMany = async () => {
//     await Campground.deleteMany({ price: 12.5 });
// };

// deleteMany().then(() => {
//     db.close();
//     console.log('connection closed');
// });
