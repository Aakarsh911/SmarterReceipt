const express = require('express');
const app = express();
const cors = require('cors');
const passport = require('passport');
const rootRouter = require('./routes')
const session = require('express-session');
var cookieParser = require('cookie-parser');

require('./config/passport'); // Initialize Passport configuration

app.use(cors({
    origin: "https://smarter-receipt.vercel.app",
    credentials: true
}));

app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.set("trust proxy", 1)

app.use(session({
    proxy: true,
    secret: ['56fb7a12f566d26973accd3014ba65e66db60ddf445a5f98f0837400aa916b34'],
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
      signed: true,
    },
  }))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use(passport.initialize());
app.use(passport.session());

// Register routes
app.use('/api/v1', rootRouter);
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).send({ message: 'Something broke!' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
