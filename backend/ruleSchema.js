// backend/ruleSchema.js
const mongoose = require('mongoose');

const RuleSchema = new mongoose.Schema({
    ruleString: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rule', RuleSchema);
