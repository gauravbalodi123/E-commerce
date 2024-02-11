if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');

// Routes
const productRoutes = require('./routes/product');
const reviewRoutes = require('./routes/review');
const authRoutes = require('./routes/auth');
const  cartRoutes = require('./routes/cart');
// const paymentRoutes = require('./routes/payment')

//API
const productApis = require('./routes/api/productapi');


const dbUrl = process.env.dbUrl || 'mongodb://127.0.0.1:27017/shopping-app-clone';

mongoose.connect(dbUrl)
    .then(() => console.log('DB Connected'))
    .catch((err) => console.log(err));
;

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(mongoSanitize());
app.use(helmet({contentSecurityPolicy:false}));


const secret = process.env.SECRET || 'weneedsomebettersecret'

const store = MongoStore.create({
    secret: secret,
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
});


// now login ke time program memory use nhi hogi mongo mein session model store hoga
const sessionConfig = {
    store,
    name:'session',
    secret:secret ,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000* 60 * 60 * 24 * 7 * 1,
        maxAge:1000* 60 * 60 * 24 * 7 * 1
    }
}

app.use(session(sessionConfig));
app.use(flash());

// initializing middleware for passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// telling the passport to check for username and password using authenticate method provided by passport local-mongoose package
passport.use(new LocalStrategy(User.authenticate()));
// username aur password ko actually database mein check karta hai


// jo bhi chiz res.local mein hogi vo sabhi views template mein available hogi
app.use((req, res, next) => {
    // yaha se aya currentUser
    // console.log(process.env.name);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})




 
app.use(productRoutes);
app.use(reviewRoutes);
app.use(authRoutes);
app.use(productApis);
app.use(cartRoutes);
// app.use(paymentRoutes);


app.all('*' , (req,res)=>{
    res.render('error', {err:'You are requesting a wrong URL !!!!'});
})

const port = 3000;

app.listen(port, () => {
    console.log(`server running at port ${port}`);
});

