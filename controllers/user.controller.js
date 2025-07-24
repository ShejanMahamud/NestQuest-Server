const User = require('../models/user.model');

// Example: Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Example: Get user by email
exports.getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    res.send(user);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Example: Create user
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    const result = await user.save();
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Example: Update user
exports.updateUser = async (req, res) => {
  try {
    const result = await User.updateOne(
      { email: req.params.email },
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

// Example: Delete user
exports.deleteUser = async (req, res) => {
  try {
    const result = await User.deleteOne({ email: req.params.email });
    if (result.deletedCount > 0) {
      res.send({ success: true });
    } else {
      res.send({ success: false });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Example: Get user role
exports.getUserRole = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    res.send({ role: user?.role });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}; 