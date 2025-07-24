const Offered = require('../models/offered.model');

// Get offered by agent email
exports.getOfferedByAgentEmail = async (req, res) => {
  try {
    const offered = await Offered.find({ agent_email: req.params.email });
    res.send(offered);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Get offered by id
exports.getOfferedById = async (req, res) => {
  try {
    const offered = await Offered.findById(req.params.id);
    res.send(offered);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Create offered
exports.createOffered = async (req, res) => {
  try {
    const offered = new Offered(req.body);
    const result = await offered.save();
    res.send({ success: true, offered: result });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Update offered by id
exports.updateOffered = async (req, res) => {
  try {
    const result = await Offered.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    if (result.modifiedCount > 0) {
      res.send({ success: true });
    } else {
      res.send({ success: false });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}; 