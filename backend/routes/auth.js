const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get("/auth/google/callback", passport.authenticate("google", {
    successRedirect: "https://smarter-receipt.vercel.app",
    failureRedirect: "https://smarter-receipt.vercel.app/login"
}))

router.get('/logout', (req, res) => {
    //delete cookie 
    req.logout();
    req.session = null;
    res.send({ success: true });
});

module.exports = router;
