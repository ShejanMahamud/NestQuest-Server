const Property = require('../models/property.model');

// Get all properties (verified, not fraud agent)
exports.getAllProperties = async (req, res) => {
  try {
    let query = { property_status: 'Verified' };
    if (req.query.search) {
      query.property_location = { $regex: req.query.search, $options: 'i' };
    }
    // Note: agent fraud check would require aggregation with users collection
    const properties = await Property.find(query);
    res.send(properties);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Get all properties (no condition)
exports.getAllPropertiesNoCondition = async (req, res) => {
  try {
    let query = {};
    if (req.query.verified) query.property_status = 'Verified';
    if (req.query.advertise) query.property_advertise = true;
    const properties = await Property.find(query);
    res.send(properties);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Get property by id
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    res.send(property);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Create property
exports.createProperty = async (req, res) => {
  try {
    const property = new Property(req.body);
    const result = await property.save();
    res.send({ success: true, property: result });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Update property
exports.updateProperty = async (req, res) => {
  try {
    const result = await Property.updateOne(
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