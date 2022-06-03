const User = require('../models/user');

module.exports.registerPage = (req, res) => {
    res.render('users/register')
}


module.exports.registerRoute = async (req, res) => {
    try {
    const { email, username, password } = req.body;
    const user = new User({email, username});
    const newUser = await User.register(user, password);
    req.login(newUser, err => {
        if (err) return next(err);
        req.flash('success','Welcome');
        res.redirect('/');
    })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.loginPage = (req, res) => {
    res.render('users/login');
}

module.exports.loginRoute = (req, res) => {
    req.flash('success', 'welcome back');
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect('/');
}

module.exports.logoutRoute = (req, res) => {
    req.logout(er => {
        if (er) {return next(err);}
    });
    req.flash('success', 'succesfully logged out');
    res.redirect('/');
}