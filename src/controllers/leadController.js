const Lead = require("../models/Lead");
const Payment = require("../models/Payment");
const { autoWalletDeduct } = require("../utils/walletHelper");

// Calculate total of transaction array
const totalFromArray = (arr = []) =>
  arr.reduce((sum, t) => sum + Number(t.amount || 0), 0);

// CREATE LEAD
exports.createLead = async (req, res) => {
  try {
    const body = req.body;

    const lead = await Lead.create({
      ...body,
      stampDutyTransactions: body.stampDutyTransactions || [],
      registrationFeesTransactions: body.registrationFeesTransactions || []
    });

    // AUTO WALLET DEDUCTIONS
    const stampTotal = totalFromArray(lead.stampDutyTransactions);
    const regTotal = totalFromArray(lead.registrationFeesTransactions);

    if (stampTotal > 0)
      await autoWalletDeduct(stampTotal, lead._id, "Stamp Duty Added");

    if (regTotal > 0)
      await autoWalletDeduct(regTotal, lead._id, "Registration Fee Added");

    if (lead.fuelAmount > 0)
      await autoWalletDeduct(lead.fuelAmount, lead._id, "Fuel Amount Added");

    if (lead.paidAmount > 0)
      await autoWalletDeduct(lead.paidAmount, lead._id, "Client Paid Amount Added");

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


// UPDATE LEAD
exports.updateLead = async (req, res) => {
  try {
    const body = req.body;

    const oldLead = await Lead.findById(req.params.id);
    if (!oldLead) return res.status(404).json({ success: false, message: "Lead not found" });

    // ========== DIFFERENCE CALCULATION ==========
    const oldStamp = totalFromArray(oldLead.stampDutyTransactions);
    const newStamp = totalFromArray(body.stampDutyTransactions || []);

    const oldReg = totalFromArray(oldLead.registrationFeesTransactions);
    const newReg = totalFromArray(body.registrationFeesTransactions || []);

    const oldFuel = Number(oldLead.fuelAmount || 0);
    const newFuel = Number(body.fuelAmount || 0);

    const oldPaid = Number(oldLead.paidAmount || 0);
    const newPaid = Number(body.paidAmount || 0);

    // ========== DEDUCT ONLY DIFFERENCE ==========
    if (newStamp > oldStamp)
      await autoWalletDeduct(newStamp - oldStamp, oldLead._id, "Stamp Duty Updated");

    if (newReg > oldReg)
      await autoWalletDeduct(newReg - oldReg, oldLead._id, "Registration Fees Updated");

    if (newFuel > oldFuel)
      await autoWalletDeduct(newFuel - oldFuel, oldLead._id, "Fuel Amount Updated");

    if (newPaid > oldPaid)
      await autoWalletDeduct(newPaid - oldPaid, oldLead._id, "Paid Amount Updated");

    // Update lead data
    const updated = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        ...body,
        stampDutyTransactions: body.stampDutyTransactions || [],
        registrationFeesTransactions: body.registrationFeesTransactions || []
      },
      { new: true }
    );

    // update summary card
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
