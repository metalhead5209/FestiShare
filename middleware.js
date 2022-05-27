const loggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Must Be Logged In');
        return res.redirect('/login');
    }
    next();
};

module.exports = loggedIn;