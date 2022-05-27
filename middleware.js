const { festiSchema } = require('./schemas');
const { experienceSchema } = require('./schemas');
const Festival = require('./models/festival');
const ExpressError = require('./utilities/ExpressError');


module.exports.loggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Must Be Logged In');
        return res.redirect('/login');
    }
    next();
};

module.exports.validateFest = (req, res, next) => {
    const { error } = festiSchema.validate(req.body);
    if (error) {
      const msg = error.details.map(el => el.message).join(',');
      throw new ExpressError(msg, 400)
    } else {
      next();
    }
  };

module.exports.isContributor = async (req, res, next) => {
    const { id } = req.params;
    const festival = await Festival.findById(id)
    if (!festival.contributor.equals(req.user._id)) {
      req.flash('error', 'You are not authorized to do that!');
      return res.redirect(`/festivals/${id}`);
    }
    next();
  };


module.exports.validateExperience = (req, res, next) => {
    const {error} = experienceSchema.validate(req.body);
    if (error) {
      const msg = error.details.map(el => el.message).join(',');
      throw new ExpressError(msg, 400)
    } else {
      next();
    }
  };