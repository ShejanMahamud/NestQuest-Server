const Advertise = require('../models/advertise.model');

// Get all advertises
exports.getAllAdvertises = async (req, res) => {
  try {
    const advertises = await Advertise.find();
    res.send(advertises);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Create advertise
exports.createAdvertise = async (req, res) => {
  try {
    const advertise = new Advertise(req.body);
    const result = await advertise.save();
    res.send({ success: true, advertise: result });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}; 