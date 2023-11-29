if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const helmet = require('helmet');

const path = require('path');
const methodOverride = require('method-override');

const session = require('express-session');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

const ejsMate = require('ejs-mate');
const ExpressError = require('./utilities/ExpressError.js');

const campgroundsRouter = require('./routes/campgrounds.js');
const reviewsRouter = require('./routes/reviews.js');
const usersRouter = require('./routes/users.js');

const flash = require('connect-flash');

const mongoConnexion = require('./utilities/mongoconnexion.js');
mongoConnexion();


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const { connectSrcUrls, fontSrcUrls, scriptSrcUrls, imgSrcUrls, styleSrcUrls } = require('./utilities/helmetconfig.js');

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            connectSrc: ["'self'", ...connectSrcUrls],
            defaultSrc: ["'self'"],
            fontSrc: ["'self'", ...fontSrcUrls],
            scriptSrc: ["'self'", "'unsafe-inline'", ...scriptSrcUrls],
            workerSrc: ["'self'", "blob:"],
            imgSrc: ["'self'", "data:", ...imgSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls]
        },
    },
    ));

const MongoStore = require('connect-mongo');

const secret = process.env.SECRET || 'ewq#$@^47623';

const sessionConfig = {
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/yelpCamp',
        touchAfter: 24 * 3600 // time period in seconds
    }),
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        htmlOnly: true,
        secure: true,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
};

app.use(session(sessionConfig));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// FLASH MIDDLEWARE
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.loggedUser = req.user;
    next();
});

app.get('/', (req, res) => {
    res.render('home.ejs');
});

// USERS ROUTES ************************************************************************

app.use('/', usersRouter);

// CAMPGROUNDS ROUTES ************************************************************************

app.use('/campgrounds', campgroundsRouter);

// REVIEWS ROUTES ************************************************************************

app.use('/campgrounds/:id/reviews', reviewsRouter);

// HANDLING ERRORS ************************************************************************

app.all('/*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
});

app.use((err, req, res, next) => {
    console.log(err);
    const { message = 'Something went wrong', status = 500 } = err;
    const errorMsg = `ERROR ${status}: ${message}`;
    // req.flash('error', errorMsg);
    // res.redirect('/campgrounds');
    res.status(status).render('error.ejs', { message, status });
});

// OPENING PORT ************************************************************************

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`listening on port ${port}`));