function mongoConnexion() {
    const mongoose = require('mongoose');
    const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/yelpCamp';
    mongoose.connect(mongoUrl);
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        console.log('Database connected');
    });
};

module.exports = mongoConnexion;