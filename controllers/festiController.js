const { cloudinary } = require('../cloudinary/config');
const Festival = require('../models/festival');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });


module.exports.festIndex = async (req, res) => {
    const festivals = await Festival.find({});
    res.render("festivals/index", { festivals });
};

module.exports.newFestForm =  (req, res) => {
    res.render("festivals/new");
};

module.exports.createFest = async (req, res) => {
  const geoData = await geoCoder.forwardGeocode({
    query: req.body.festival.location,
    limit: 1
  }).send()
    const festival = new Festival(req.body.festival);
    festival.geometry = geoData.body.features[0].geometry.type;
    festival.images = req.file.map(file => ({url: file.path, filename: file.filename}));
    festival.contributor = req.user._id;
    await festival.save();
    req.flash('success', 'Successfully created new Festival!');
    res.redirect(`/festivals/${festival._id}`);
};

module.exports.showPage = async (req, res) => {
    const festival = await Festival.findById(req.params.id).populate({
      path:'experiences',
      populate: {
        path: 'contributor'
      }
  }).populate('contributor');
    if (!festival) {
      req.flash('error', 'Festival does not exist');
      return res.redirect('/festivals')
    } 
    res.render("festivals/show", { festival });
};


module.exports.editPage = async (req, res) => {
    const festival = await Festival.findById(req.params.id);
    if (!festival) {
      req.flash('error', 'Festival does not exist');
      return res.redirect('/festivals')
    } 
    res.render("festivals/edit", { festival });
};

module.exports.editFest = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const festival = await Festival.findByIdAndUpdate(id, { ...req.body.festival });
    const imgs = req.files.map(file => ({url: file.path, filename: file.filename}));
    festival.images.push(...imgs);
    await festival.save();
    if (req.body.deleteImages) {
      for(let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename)
      }
      await festival.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
    req.flash('success', 'Successfully edited Festival')
    res.redirect(`/festivals/${festival._id}`);
};

module.exports.deleteFest = async (req, res) => {
    const { id } = req.params;
    await Festival.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Festival');
    res.redirect('/festivals');
};