const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get("/google/callback", passport.authenticate("google", {
    successRedirect: "https://smarter-receipt.vercel.app",
    failureRedirect: "https://smarter-receipt.vercel.app/login"
}))

router.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy(err => {
        if (err) {
            return res.send({ success: false, message: 'Failed to destroy the session' });
        }
        res.clearCookie('connect.sid', { path: '/' }); // Adjust the cookie name if different
        res.send({ success: true, message: 'Logged out successfully' });
    });
});


module.exports = router;
