module.exports.loggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.flash('error', 'Must Be Logged In');
        return res.redirect('/login');
    }
    next();
};