const Lead = require("../models/Lead");
const WalletTransaction = require("../models/WalletTransaction");
const Payment = require("../models/Payment");
const Credit = require("../models/Credit");


exports.getOverview = async (req, res) => {
  try {
    // active leads (not completed), pending docs (documentStatus not 'done' or empty)
    const activeLeads = await Lead.countDocuments({ "caseCompletion.completed": { $ne: true } });
    const pendingDocuments = await Lead.countDocuments({ documentStatus: { $nin: ["done","completed","closed"] } });

    // month revenue (sum of paidAmount for leads created this month)
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const monthLeads = await Lead.aggregate([
      { $match: { createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, revenue: { $sum: "$paidAmount" } } }
    ]);
    const thisMonthRevenue = (monthLeads[0] && monthLeads[0].revenue) || 0;

    // completed tasks (cases completed)
    const completeTasks = await Lead.countDocuments({ "caseCompletion.completed": true });

    // wallet balance
    const walletAgg = await WalletTransaction.aggregate([
      { $group: { _id: "$type", total: { $sum: "$amount" } } }
    ]);
    let deposits = 0, withdraws = 0;
    walletAgg.forEach(a => { if (a._id === "deposit") deposits = a.total; if (a._id === "withdraw") withdraws = a.total; });
    const walletBalance = (deposits || 0) - (withdraws || 0);

    // recent leads
    const recentLeads = await Lead.find().sort({ createdAt: -1 }).limit(10);

    // recent transactions
    const recentTx = await WalletTransaction.find().sort({ createdAt: -1 }).limit(10);

    // pending payments total
    const pendingPayments = await Payment.aggregate([
      { $match: { status: { $in: ["partial","overdue"] } } },
      { $group: { _id: null, totalDue: { $sum: "$dueAmount" } } }
    ]);
    const pendingPaymentsTotal = (pendingPayments[0] && pendingPayments[0].totalDue) || 0;

    // total loans issued
    const loansAgg = await Credit.aggregate([
      { $match: { type: "loan" } },
      { $group: { _id: null, totalLoans: { $sum: "$loanAmount" } } }
    ]);
    const totalLoansIssued = (loansAgg[0] && loansAgg[0].totalLoans) || 0;

    res.json({
      success:true,
      overview: {
        walletBalance,
        pendingPaymentsTotal,
        totalLoansIssued,
        activeLeads,
        pendingDocuments,
        thisMonthRevenue,
        completeTasks,
        recentLeads,
        recentTransactions: recentTx
      }
    });
  } catch(err){ res.status(500).json({ success:false, message: err.message }); }
};
