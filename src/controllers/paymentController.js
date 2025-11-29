const Payment = require("../models/Payment");

// get payments list (table)
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ lastPaymentDate: -1 });
    res.json({ success:true, payments });
  } catch(err){ res.status(500).json({ success:false, message: err.message }); }
};

// summary block
exports.getPaymentsSummary = async (req, res) => {
  try {
    const totals = await Payment.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalPaid: { $sum: "$paidAmount" },
          totalDue: { $sum: "$dueAmount" }
        }
      }
    ]);

    const received = totals.reduce((s,t) => s + (t.totalPaid||0), 0);
    const outstanding = totals.reduce((s,t) => s + (t.totalDue||0), 0);
    const fullyPaid = (totals.find(t => t._id === "fully_paid") || {}).count || 0;
    const overdue = (totals.find(t => t._id === "overdue") || {}).count || 0;
    const totalClients = totals.reduce((s,t) => s + (t.count||0), 0);
    const netBalance = received - outstanding;
    const collectionRate = totalClients === 0 ? 0 : (received / (received + outstanding)) * 100;

    res.json({
      success:true,
      summary: {
        totalClients,
        fullyPaid,
        partial: (totals.find(t => t._id === "partial") || {}).count || 0,
        overdue,
        received,
        outstanding,
        netBalance,
        collectionRate: Number(collectionRate.toFixed(2))
      }
    });
  } catch(err){ res.status(500).json({ success:false, message: err.message }); }
};
