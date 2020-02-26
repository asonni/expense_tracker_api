const express = require('express');

const router = express.Router();

const transactionController = require('../controllers/transactions');
const Transaction = require('../models/Transaction');
const advancedResults = require('../middleware/advancedResults');

router
  .route('/')
  .get(advancedResults(Transaction), transactionController.getTransactions)
  .post(transactionController.addTransaction);

router.route('/:id').delete(transactionController.deleteTransaction);

module.exports = router;
