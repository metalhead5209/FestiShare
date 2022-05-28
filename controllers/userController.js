const User = require('../models/user');

module.exports.registerPage = (req, res) => {
    res.render('users/register')
};


module.exports.createUserRoute = async (req, res) => {
    try {
    const { email, username, password } = req.body;
    const user = new User({email, username});
    const newUser = await User.register(user, password);
    req.login(newUser, err => {
        if (err) return next(err);
        req.flash('success','Welcome');
        res.redirect('/festivals');
    })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
};

module.exports.loginIndex = (req, res) => {
    res.render('users/login');
};

module.exports.loginRoute =  (req, res) => {
    req.flash('success', 'welcome back');
    const redirectUrl = req.session.returnTo || '/festivals';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logoutRoute = (req, res) => {
    req.logout(er => {
        if (er) {return next(err);}
    });
    req.flash('success', 'succesfully logged out');
    res.redirect('/festivals');
};