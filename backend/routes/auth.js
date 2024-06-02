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
        // Make sure cookie attributes match those specified in the session middleware
        res.clearCookie('connect.sid', {
            path: '/',
            sameSite: 'none',
            secure: true // This needs to match the settings used in your session configuration
        });
        res.send({ success: true, message: 'Logged out successfully' });
    });
});


module.exports = router;
