function isAuthenticated(req, res, next) {
    if (req.user) {
        return next();
    }
    res.sendStatus(401);
}

module.exports = { isAuthenticated };
