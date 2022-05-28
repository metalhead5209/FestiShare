const Experience = require('../models/experience');
const Festival = require('../models/festival');

module.exports.newExperience = async (req, res) => {
    const festival = await Festival.findById(req.params.id);
    const experience = new Experience(req.body.experience);
    experience.contributor = req.user._id;
    festival.experiences.unshift(experience);
    await experience.save();
    await festival.save()
    req.flash('success', 'SUCCESS! Thank you for sharing your Experience!!')
    res.redirect(`/festivals/${festival._id}`);
};

module.exports.deleteExperience = async (req, res) => {
    const { id, experienceId } = req.params;
    await Festival.findByIdAndUpdate(id, { $pull: {experiences: experienceId} });
    await Experience.findByIdAndDelete(req.params.experienceId);
    req.flash('success', 'Experience successfully deleted')
    res.redirect(`/festivals/${id}`);
};