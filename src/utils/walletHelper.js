const WalletTransaction = require("../models/WalletTransaction");

exports.getWalletBalance = async () => {
  const agg = await WalletTransaction.aggregate([
    { $group: { _id: "$type", total: { $sum: "$amount" } } },
  ]);

  let deposits = 0;
  let withdraws = 0;

  agg.forEach((a) => {
    if (a._id === "deposit") deposits = a.total;
    if (a._id === "withdraw") withdraws = a.total;
  });

  return {
    currentBalance: deposits - withdraws,
  };
};
