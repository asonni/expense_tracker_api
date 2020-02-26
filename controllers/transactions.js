const Transaction = require('../models/Transaction');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc      Get all transactions
// @route     GET /api/v1/transactions
// @access    Public
exports.getTransactions = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Create new transaction
// @route     POST /api/v1/transactions
// @access    Public
exports.addTransaction = asyncHandler(async (req, res, next) => {
  const transaction = await Transaction.create(req.body);

  return res.status(201).json({
    success: true,
    data: transaction
  });
});

// @desc      Delete transaction
// @route     DELETE /api/v1/transactions/:id
// @access    Public
exports.deleteTransaction = asyncHandler(async (req, res, next) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    return next(
      new ErrorResponse(
        `Transaction not found with id of ${req.params.id}`,
        404
      )
    );
  }

  await transaction.remove();

  return res.status(200).json({
    success: true,
    data: transaction.id
  });
});
