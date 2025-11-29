const Payment = require("../models/Payment");
const Lead = require("../models/Lead");

// ============================
//     GET PAYMENT TABLE DATA
// ============================
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("lead", "duePaymentDate") // fetch date from Lead
      .sort({ createdAt: -1 });

    // modify response to include reminderDate
    const formatted = payments.map(p => {
      const dueDate = p.lead?.duePaymentDate;
      let reminderDate = null;

      if (dueDate) {
        const date = new Date(dueDate);
        date.setDate(date.getDate() - 3);
        reminderDate = date;
      }

      return {
        _id: p._id,
        clientName: p.clientName,
        paidAmount: p.paidAmount,
        dueAmount: p.dueAmount,
        paymentMode: p.paymentMode,
        status: p.status,
        duePaymentDate: dueDate || null,
        reminderDate: reminderDate,
        createdAt: p.createdAt
      };
    });

    res.json({ success: true, payments: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================
//     SUMMARY BLOCK
// ============================
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

    const received = totals.reduce((s, t) => s + (t.totalPaid || 0), 0);
    const outstanding = totals.reduce((s, t) => s + (t.totalDue || 0), 0);

    const fullyPaid = (totals.find(t => t._id === "fully_paid") || {}).count || 0;
    const partial = (totals.find(t => t._id === "partial") || {}).count || 0;
    const overdue = (totals.find(t => t._id === "overdue") || {}).count || 0;

    const totalClients = totals.reduce((s, t) => s + (t.count || 0), 0);

    const netBalance = received - outstanding;
    const collectionRate =
      totalClients === 0 ? 0 : (received / (received + outstanding)) * 100;

    res.json({
      success: true,
      summary: {
        totalClients,
        fullyPaid,
        partial,
        overdue,
        received,
        outstanding,
        netBalance,
        collectionRate: Number(collectionRate.toFixed(2))
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
