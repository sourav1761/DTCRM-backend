const Lead = require("../models/Lead");
const Payment = require("../models/Payment");
const { autoWalletDeduct } = require("../utils/walletHelper");

// Calculate total of transaction array
const totalFromArray = (arr = []) =>
  arr.reduce((sum, t) => sum + Number(t.amount || 0), 0);

// =========================
//     CREATE LEAD
// =========================
exports.createLead = async (req, res) => {
  try {
    const body = req.body;

    const lead = await Lead.create({
      ...body,
      stampDutyTransactions: body.stampDutyTransactions || [],
      registrationFeesTransactions: body.registrationFeesTransactions || [],
      duePaymentDate: body.duePaymentDate || null
    });

    // AUTO WALLET DEDUCTIONS (ONLY 2 FIELDS)
    const stampTotal = totalFromArray(lead.stampDutyTransactions);
    const regTotal = totalFromArray(lead.registrationFeesTransactions);

    if (stampTotal > 0)
      await autoWalletDeduct(stampTotal, lead._id, "Stamp Duty Added");

    if (regTotal > 0)
      await autoWalletDeduct(regTotal, lead._id, "Registration Fee Added");

    // NO WALLET DEDUCTION FOR:
    // ❌ lead.fuelAmount
    // ❌ lead.paidAmount

    // Create payment dashboard card
    await Payment.create({
      lead: lead._id,
      clientName: lead.customerName,
      lastPaymentDate: null,
      paidAmount: lead.paidAmount || 0,
      dueAmount: lead.dueAmount || 0,
      paymentMode: lead.paymentMode || "",
      status: (lead.dueAmount || 0) <= 0 ? "fully_paid" : "partial"
    });

    res.status(201).json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
//     UPDATE LEAD
// =========================
exports.updateLead = async (req, res) => {
  try {
    const body = req.body;

    const oldLead = await Lead.findById(req.params.id);
    if (!oldLead)
      return res.status(404).json({ success: false, message: "Lead not found" });

    // DIFFERENCE CALCULATION (ONLY stamp + reg)
    const oldStamp = totalFromArray(oldLead.stampDutyTransactions);
    const newStamp = totalFromArray(body.stampDutyTransactions || []);

    const oldReg = totalFromArray(oldLead.registrationFeesTransactions);
    const newReg = totalFromArray(body.registrationFeesTransactions || []);

    // APPLY DEDUCTIONS ONLY FOR THESE TWO FIELDS
    if (newStamp > oldStamp)
      await autoWalletDeduct(newStamp - oldStamp, oldLead._id, "Stamp Duty Updated");

    if (newReg > oldReg)
      await autoWalletDeduct(newReg - oldReg, oldLead._id, "Registration Fees Updated");

    // ❌ NO DEDUCTION for fuelAmount
    // ❌ NO DEDUCTION for paidAmount

    // Update lead data
    const updated = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        ...body,
        stampDutyTransactions: body.stampDutyTransactions || [],
        registrationFeesTransactions: body.registrationFeesTransactions || [],
        duePaymentDate: body.duePaymentDate || oldLead.duePaymentDate
      },
      { new: true }
    );

    // Update summary card
    await Payment.findOneAndUpdate(
      { lead: updated._id },
      {
        paidAmount: updated.paidAmount,
        dueAmount: updated.dueAmount,
        status: updated.dueAmount <= 0 ? "fully_paid" : "partial"
      }
    );

    res.json({ success: true, lead: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
//     GET ALL LEADS
// =========================
exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json({ success: true, leads });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
//     GET LEAD BY ID
// =========================
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead)
      return res.status(404).json({ success: false, message: "Lead not found" });

    res.json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
//     MARK CASE COMPLETE
// =========================
exports.markCaseCompletion = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { caseCompleted: true },
      { new: true }
    );

    res.json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
