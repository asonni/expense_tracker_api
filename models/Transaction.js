/* eslint-disable func-names */
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please add a text']
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
