const Report = require('../models/report.model');

// Get all reports
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find();
    res.send(reports);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Create report
exports.createReport = async (req, res) => {
  try {
    const report = new Report(req.body);
    const result = await report.save();
    res.send({ success: true, report: result });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Delete report by id
exports.deleteReport = async (req, res) => {
  try {
    const result = await Report.deleteOne({ _id: req.params.id });
    if (result.deletedCount > 0) {
      res.send({ success: true });
    } else {
      res.send({ success: false });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}; 