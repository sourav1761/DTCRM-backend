# LEADS API - Complete Documentation
## Base URL: `/api/leads`

---

## 🚀 **STEP-BY-STEP IMPLEMENTATION**

### **STEP 1** - Basic Lead Information

#### **POST** `/api/leads` - Create Lead Step 1
```json
{
  "customerName": "John Doe",
  "mobileNumber": "9876543210",
  "email": "john@example.com",
  "address": "123 Main Street, City",
  "sourceOfEntry": "reference",
  "referenceName": "Agent Smith",
  "declarationAmount": 500000,
  "documentType": "Sale Deed",
  "leadStatus": "New",
  "date": "2024-01-15",
  "action": "continue"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Lead created successfully, continue to next step",
  "lead": {
    "_id": "65a1b2c3d4e5f6789012345",
    "leadId": "LD2024010001",
    "customerName": "John Doe",
    "mobileNumber": "9876543210",
    "email": "john@example.com",
    "sourceOfEntry": "reference",
    "referenceName": "Agent Smith",
    "leadStatus": "New",
    "stepCompleted": 1,
    "isDraft": false,
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "nextStep": 2
}
```

**Error Responses:**
```json
// Missing required fields
{
  "success": false,
  "message": "Customer name, mobile number, and date are required"
}

// Invalid date format
{
  "success": false,
  "message": "Invalid date format"
}

// Duplicate mobile number
{
  "success": false,
  "message": "Mobile number already exists"
}

// Validation errors
{
  "success": false,
  "message": "Customer name is required, Mobile number is required, Date is required"
}
```

#### **PUT/PATCH** `/api/leads/:id/step1` - Update Step 1
```json
{
  "customerName": "John Doe Updated",
  "mobileNumber": "9876543210",
  "email": "john.updated@example.com",
  "address": "Updated Address",
  "sourceOfEntry": "direct",
  "referenceName": "",
  "declarationAmount": 600000,
  "documentType": "Agreement",
  "leadStatus": "New",
  "date": "2024-01-15"
}
```

---

### **STEP 2** - Party Details

#### **PUT/PATCH** `/api/leads/:id/step2` - Update Step 2
```json
{
  "buyers": [
    {
      "name": "Buyer One",
      "phoneNumber": "9876543211",
      "address": "Buyer Address 1",
      "email": "buyer1@example.com",
      "aadhar": "123456789012",
      "pan": "ABCDE1234F"
    },
    {
      "name": "Buyer Two",
      "phoneNumber": "9876543212",
      "address": "Buyer Address 2",
      "email": "buyer2@example.com",
      "aadhar": "123456789013",
      "pan": "FGHIJ5678K"
    }
  ],
  "sellers": [
    {
      "name": "Seller One",
      "phoneNumber": "9876543213",
      "address": "Seller Address 1",
      "email": "seller1@example.com",
      "aadhar": "123456789014",
      "pan": "LMNOP9012Q"
    }
  ],
  "individual": {
    "name": "Individual Name",
    "phoneNumber": "9876543214",
    "address": "Individual Address",
    "email": "individual@example.com",
    "aadhar": "123456789015",
    "pan": "RSTUV3456W"
  },
  "documentTypeOption": "EM_0.50",
  "ownerName": "Property Owner",
  "bankName": "State Bank of India"
}
```

**Document Type Options:**
- `"EM_0.50"` - EM (0.50%)
- `"EM_0.25"` - EM (0.25%)
- `"RM_1.8"` - RM (1.8%)

---

### **STEP 3** - Property Details

#### **PUT/PATCH** `/api/leads/:id/step3` - Update Step 3
```json
{
  "propertyLocation": "Plot No. 123, Sector 45, City",
  "documentNumber": "DOC123456",
  "documentStartingDate": "2024-01-10",
  "documentStatus": "In Progress"
}
```

#### **POST** `/api/leads/:id/documents` - Upload Lead Documents
**Content-Type:** `multipart/form-data`
```
files: [document1.pdf, document2.jpg, document3.png]
```

**Response:**
```json
{
  "success": true,
  "message": "Documents uploaded successfully",
  "documents": [
    {
      "fileName": "property_deed.pdf",
      "filePath": "/uploads/1234567890-property_deed.pdf",
      "fileSize": 1024000,
      "mimeType": "application/pdf"
    }
  ]
}
```

#### **DELETE** `/api/leads/:id/documents/:docId` - Delete Document

---

### **STEP 4** - Financial Details

#### **PUT/PATCH** `/api/leads/:id/step4` - Update Step 4
```json
{
  "stampDuty": 25000,
  "registrationFee": 5000,
  "mutationFee": 2000,
  "otherFees": [
    {
      "description": "Legal Fee",
      "amount": 3000,
      "date": "2024-01-16"
    },
    {
      "description": "Processing Fee",
      "amount": 1500,
      "date": "2024-01-17"
    }
  ],
  "officeFee": 2500,
  "registrarCommission": [
    {
      "amount": 4000,
      "date": "2024-01-18",
      "description": "Registrar commission for processing"
    }
  ],
  "agentCommission": [
    {
      "amount": 3500,
      "date": "2024-01-19",
      "description": "Agent commission"
    }
  ],
  "paidAmount": {
    "amount": 20000,
    "mode": "UPI",
    "remark": "Partial payment received"
  },
  "pendingAmount": {
    "amount": 26500,
    "date": "2024-01-25",
    "remark": "Balance payment pending"
  }
}
```

**Amount Calculation Example:**
- Total = stampDuty + registrationFee + mutationFee + otherFees + officeFee + commissions
- Total = 25000 + 5000 + 2000 + 4500 + 2500 + 7500 = 46500
- Paid = 20000
- Pending = 46500 - 20000 = 26500 (auto-calculated)

---

### **STEP 5** - Completion

#### **PUT/PATCH** `/api/leads/:id/step5` - Complete Lead
```json
{
  "completionDate": "2024-01-25",
  "successStatus": "yes",
  "remark": "Lead completed successfully with all documentation"
}
```

---

## 📖 **READ OPERATIONS**

### **GET** `/api/leads` - Get All Leads
**Query Parameters:**
- `page=1` (default: 1)
- `limit=50` (default: 50)
- `search=John` (search in name, mobile, email, leadId)
- `status=New` (filter by status)
- `step=1` (filter by step completed)

**Response:**
```json
{
  "success": true,
  "leads": [
    {
      "_id": "65a1b2c3d4e5f6789012345",
      "leadId": "LD2024010001",
      "customerName": "John Doe",
      "mobileNumber": "9876543210",
      "email": "john@example.com",
      "sourceOfEntry": "reference",
      "referenceName": "Agent Smith",
      "leadStatus": "New",
      "stepCompleted": 1,
      "totalAmount": 46500,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "totalPages": 1,
  "limit": 50
}
```

### **GET** `/api/leads/:id` - Get Lead by ID
**Response:**
```json
{
  "success": true,
  "lead": {
    "_id": "65a1b2c3d4e5f6789012345",
    "leadId": "LD2024010001",
    "customerName": "John Doe",
    "mobileNumber": "9876543210",
    "email": "john@example.com",
    "address": "123 Main Street, City",
    "sourceOfEntry": "reference",
    "referenceName": "Agent Smith",
    "declarationAmount": 500000,
    "documentType": "Sale Deed",
    "leadStatus": "New",
    "date": "2024-01-15T00:00:00.000Z",
    "stepCompleted": 1,
    "buyers": [
      {
        "name": "Buyer One",
        "phoneNumber": "9876543211",
        "address": "Buyer Address 1",
        "email": "buyer1@example.com",
        "aadhar": "123456789012",
        "pan": "ABCDE1234F"
      }
    ],
    "sellers": [
      {
        "name": "Seller One",
        "phoneNumber": "9876543213",
        "address": "Seller Address 1",
        "email": "seller1@example.com",
        "aadhar": "123456789014",
        "pan": "LMNOP9012Q"
      }
    ],
    "individual": {
      "name": "Individual Name",
      "phoneNumber": "9876543214",
      "address": "Individual Address",
      "email": "individual@example.com",
      "aadhar": "123456789015",
      "pan": "RSTUV3456W"
    },
    "documentTypeOption": "EM_0.50",
    "ownerName": "Property Owner",
    "bankName": "State Bank of India",
    "propertyLocation": "Plot No. 123, Sector 45, City",
    "documentNumber": "DOC123456",
    "documentStartingDate": "2024-01-10T00:00:00.000Z",
    "documentStatus": "In Progress",
    "leadDocuments": [
      {
        "fileName": "property_deed.pdf",
        "filePath": "/uploads/1234567890-property_deed.pdf",
        "fileSize": 1024000,
        "mimeType": "application/pdf",
        "uploadedAt": "2024-01-15T12:00:00.000Z"
      }
    ],
    "stampDuty": 25000,
    "registrationFee": 5000,
    "mutationFee": 2000,
    "otherFees": [
      {
        "description": "Legal Fee",
        "amount": 3000,
        "date": "2024-01-16T00:00:00.000Z"
      }
    ],
    "officeFee": 2500,
    "registrarCommission": [
      {
        "amount": 4000,
        "date": "2024-01-18T00:00:00.000Z",
        "description": "Registrar commission for processing"
      }
    ],
    "agentCommission": [
      {
        "amount": 3500,
        "date": "2024-01-19T00:00:00.000Z",
        "description": "Agent commission"
      }
    ],
    "totalAmount": 46500,
    "paidAmount": {
      "amount": 20000,
      "mode": "UPI",
      "remark": "Partial payment received"
    },
    "pendingAmount": {
      "amount": 26500,
      "date": "2024-01-25T00:00:00.000Z",
      "remark": "Balance payment pending"
    },
    "completionDate": "2024-01-25T00:00:00.000Z",
    "successStatus": "yes",
    "remark": "Lead completed successfully",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-25T15:30:00.000Z"
  }
}
```

---

## ✏️ **UPDATE OPERATIONS**

### **PUT/PATCH** `/api/leads/:id` - General Update
```json
{
  "customerName": "John Doe Updated",
  "email": "john.updated@example.com",
  "leadStatus": "In Progress",
  "address": "New Address"
}
```

---

## 🗑️ **DELETE OPERATIONS**

### **DELETE** `/api/leads/:id` - Soft Delete Lead
**Response:**
```json
{
  "success": true,
  "message": "Lead deleted successfully"
}
```

### **DELETE** `/api/leads/:id/hard` - Hard Delete Lead
**Response:**
```json
{
  "success": true,
  "message": "Lead permanently deleted"
}
```

---

## 📊 **STATISTICS**

### **GET** `/api/leads/stats` - Get Lead Statistics
**Response:**
```json
{
  "success": true,
  "stats": {
    "totalLeads": 150,
    "newLeads": 25,
    "inProgressLeads": 75,
    "completedLeads": 50,
    "step1Leads": 25,
    "step2Leads": 30,
    "step3Leads": 35,
    "step4Leads": 35,
    "step5Leads": 25
  }
}
```

---

## 🔧 **FRONTEND INTEGRATION EXAMPLES**

### **JavaScript Fetch Examples**

#### Create Lead Step 1 with Error Handling
```javascript
const createLead = async (leadData) => {
  try {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Lead created:', result.lead);
      
      // Show success message
      alert(result.message);
      
      // Navigate to next step if continue was clicked
      if (result.nextStep) {
        window.location.href = `/leads/${result.lead._id}/step${result.nextStep}`;
      } else {
        // If save was clicked, stay on current page or redirect to leads list
        window.location.href = '/leads';
      }
    } else {
      // Handle error
      console.error('Error:', result.message);
      alert('Error: ' + result.message);
    }
  } catch (error) {
    console.error('Network error:', error);
    alert('Network error. Please try again.');
  }
};

// Usage for Save button
const saveLeadStep1 = (formData) => {
  createLead({
    ...formData,
    action: "save"
  });
};

// Usage for Continue button
const continueToStep2 = (formData) => {
  createLead({
    ...formData,
    action: "continue"
  });
};

// Example form data
const formData = {
  customerName: "John Doe",
  mobileNumber: "9876543210",
  email: "john@example.com",
  address: "123 Main Street",
  sourceOfEntry: "direct", // or "reference"
  referenceName: "", // only if sourceOfEntry is "reference"
  declarationAmount: 500000,
  documentType: "Sale Deed",
  date: "2024-01-15"
};
```

#### Form Validation Before API Call
```javascript
const validateStep1Form = (formData) => {
  const errors = [];
  
  if (!formData.customerName || formData.customerName.trim() === '') {
    errors.push('Customer name is required');
  }
  
  if (!formData.mobileNumber || formData.mobileNumber.trim() === '') {
    errors.push('Mobile number is required');
  } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
    errors.push('Mobile number must be 10 digits');
  }
  
  if (!formData.date) {
    errors.push('Date is required');
  }
  
  if (formData.sourceOfEntry === 'reference' && !formData.referenceName) {
    errors.push('Reference name is required when source is reference');
  }
  
  return errors;
};

// Usage
const handleFormSubmit = (formData, action) => {
  const errors = validateStep1Form(formData);
  
  if (errors.length > 0) {
    alert('Please fix the following errors:\n' + errors.join('\n'));
    return;
  }
  
  if (action === 'save') {
    saveLeadStep1(formData);
  } else {
    continueToStep2(formData);
  }
};
```

#### Update Step 2 with Multiple Buyers/Sellers
```javascript
const updateStep2 = async (leadId, stepData) => {
  try {
    const response = await fetch(`/api/leads/${leadId}/step2`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stepData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Step 2 updated:', result.lead);
      alert('Step 2 updated successfully!');
      // Navigate to step 3 or stay on current step
    } else {
      alert('Error: ' + result.message);
    }
  } catch (error) {
    console.error('Error updating step 2:', error);
    alert('Network error. Please try again.');
  }
};

// Example: Adding multiple buyers and sellers
const step2Data = {
  buyers: [
    {
      name: "Buyer One",
      phoneNumber: "9876543211",
      address: "Buyer Address 1",
      email: "buyer1@example.com",
      aadhar: "123456789012",
      pan: "ABCDE1234F"
    },
    {
      name: "Buyer Two",
      phoneNumber: "9876543212",
      address: "Buyer Address 2",
      email: "buyer2@example.com",
      aadhar: "123456789013",
      pan: "FGHIJ5678K"
    }
  ],
  sellers: [
    {
      name: "Seller One",
      phoneNumber: "9876543213",
      address: "Seller Address 1",
      email: "seller1@example.com",
      aadhar: "123456789014",
      pan: "LMNOP9012Q"
    }
  ],
  individual: {
    name: "Individual Name",
    phoneNumber: "9876543214",
    address: "Individual Address",
    email: "individual@example.com",
    aadhar: "123456789015",
    pan: "RSTUV3456W"
  },
  documentTypeOption: "EM_0.50",
  ownerName: "Property Owner",
  bankName: "State Bank of India"
};

// Usage
updateStep2('65a1b2c3d4e5f6789012345', step2Data);
```

#### Dynamic Buyer/Seller Management
```javascript
// Add new buyer to the form
const addBuyer = () => {
  const buyersContainer = document.getElementById('buyers-container');
  const buyerIndex = buyersContainer.children.length;
  
  const buyerHTML = `
    <div class="buyer-form" data-index="${buyerIndex}">
      <h4>Buyer ${buyerIndex + 1}</h4>
      <input type="text" name="buyers[${buyerIndex}][name]" placeholder="Buyer Name" required>
      <input type="tel" name="buyers[${buyerIndex}][phoneNumber]" placeholder="Phone Number" required>
      <input type="text" name="buyers[${buyerIndex}][address]" placeholder="Address">
      <input type="email" name="buyers[${buyerIndex}][email]" placeholder="Email">
      <input type="text" name="buyers[${buyerIndex}][aadhar]" placeholder="Aadhaar (12 digits)" pattern="\d{12}">
      <input type="text" name="buyers[${buyerIndex}][pan]" placeholder="PAN" pattern="[A-Z]{5}\d{4}[A-Z]">
      <button type="button" onclick="removeBuyer(${buyerIndex})">Remove Buyer</button>
    </div>
  `;
  
  buyersContainer.insertAdjacentHTML('beforeend', buyerHTML);
};

// Remove buyer from the form
const removeBuyer = (index) => {
  const buyerForm = document.querySelector(`[data-index="${index}"]`);
  if (buyerForm) {
    buyerForm.remove();
  }
};

// Collect form data for step 2
const collectStep2Data = () => {
  const formData = new FormData(document.getElementById('step2-form'));
  const data = {
    buyers: [],
    sellers: [],
    individual: {},
    documentTypeOption: formData.get('documentTypeOption'),
    ownerName: formData.get('ownerName'),
    bankName: formData.get('bankName')
  };
  
  // Collect buyers data
  const buyerForms = document.querySelectorAll('.buyer-form');
  buyerForms.forEach((form, index) => {
    const buyer = {
      name: formData.get(`buyers[${index}][name]`),
      phoneNumber: formData.get(`buyers[${index}][phoneNumber]`),
      address: formData.get(`buyers[${index}][address]`),
      email: formData.get(`buyers[${index}][email]`),
      aadhar: formData.get(`buyers[${index}][aadhar]`),
      pan: formData.get(`buyers[${index}][pan]`)
    };
    data.buyers.push(buyer);
  });
  
  // Similar logic for sellers...
  
  return data;
};
```

#### Upload Documents with Progress
```javascript
const uploadDocuments = async (leadId, files) => {
  try {
    const formData = new FormData();
    
    // Add all files to FormData
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    
    // Show upload progress
    const progressBar = document.getElementById('upload-progress');
    
    const response = await fetch(`/api/leads/${leadId}/documents`, {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Documents uploaded:', result.documents);
      alert('Documents uploaded successfully!');
      
      // Display uploaded documents
      displayUploadedDocuments(result.documents);
    } else {
      alert('Error: ' + result.message);
    }
  } catch (error) {
    console.error('Error uploading documents:', error);
    alert('Upload failed. Please try again.');
  }
};

// Display uploaded documents
const displayUploadedDocuments = (documents) => {
  const container = document.getElementById('uploaded-documents');
  
  documents.forEach(doc => {
    const docElement = document.createElement('div');
    docElement.className = 'document-item';
    docElement.innerHTML = `
      <div class="document-info">
        <span class="file-name">${doc.fileName}</span>
        <span class="file-size">${(doc.fileSize / 1024).toFixed(2)} KB</span>
        <span class="file-type">${doc.mimeType}</span>
      </div>
      <div class="document-actions">
        <a href="${doc.filePath}" target="_blank" class="view-btn">View</a>
        <button onclick="deleteDocument('${leadId}', '${doc._id}')" class="delete-btn">Delete</button>
      </div>
    `;
    container.appendChild(docElement);
  });
};

// Delete document
const deleteDocument = async (leadId, docId) => {
  if (!confirm('Are you sure you want to delete this document?')) {
    return;
  }
  
  try {
    const response = await fetch(`/api/leads/${leadId}/documents/${docId}`, {
      method: 'DELETE'
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert('Document deleted successfully!');
      // Remove from UI
      location.reload(); // Or update UI dynamically
    } else {
      alert('Error: ' + result.message);
    }
  } catch (error) {
    console.error('Error deleting document:', error);
    alert('Delete failed. Please try again.');
  }
};

// File input handler
const handleFileUpload = (event) => {
  const files = event.target.files;
  const leadId = document.getElementById('leadId').value;
  
  if (files.length > 0) {
    uploadDocuments(leadId, files);
  }
};
```

#### Step 4 - Financial Calculations with Auto-Total
```javascript
const updateStep4 = async (leadId, stepData) => {
  try {
    const response = await fetch(`/api/leads/${leadId}/step4`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stepData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Step 4 updated:', result.lead);
      console.log('Total Amount:', result.lead.totalAmount);
      console.log('Pending Amount:', result.lead.pendingAmount?.amount);
      alert('Financial details updated successfully!');
    } else {
      alert('Error: ' + result.message);
    }
  } catch (error) {
    console.error('Error updating step 4:', error);
    alert('Update failed. Please try again.');
  }
};

// Auto-calculate totals on frontend
const calculateTotals = () => {
  const stampDuty = parseFloat(document.getElementById('stampDuty').value) || 0;
  const registrationFee = parseFloat(document.getElementById('registrationFee').value) || 0;
  const mutationFee = parseFloat(document.getElementById('mutationFee').value) || 0;
  const officeFee = parseFloat(document.getElementById('officeFee').value) || 0;
  
  // Calculate other fees total
  let otherFeesTotal = 0;
  document.querySelectorAll('.other-fee-amount').forEach(input => {
    otherFeesTotal += parseFloat(input.value) || 0;
  });
  
  // Calculate commissions total
  let commissionsTotal = 0;
  document.querySelectorAll('.commission-amount').forEach(input => {
    commissionsTotal += parseFloat(input.value) || 0;
  });
  
  const totalAmount = stampDuty + registrationFee + mutationFee + officeFee + otherFeesTotal + commissionsTotal;
  
  // Update total amount display
  document.getElementById('totalAmount').textContent = totalAmount.toFixed(2);
  
  // Calculate pending amount
  const paidAmount = parseFloat(document.getElementById('paidAmount').value) || 0;
  const pendingAmount = totalAmount - paidAmount;
  
  document.getElementById('pendingAmount').textContent = pendingAmount.toFixed(2);
  
  return { totalAmount, pendingAmount };
};

// Add event listeners for auto-calculation
const setupAutoCalculation = () => {
  const amountInputs = document.querySelectorAll('input[type="number"]');
  amountInputs.forEach(input => {
    input.addEventListener('input', calculateTotals);
  });
};

// Add other fee dynamically
const addOtherFee = () => {
  const container = document.getElementById('other-fees-container');
  const index = container.children.length;
  
  const feeHTML = `
    <div class="other-fee-item" data-index="${index}">
      <input type="text" name="otherFees[${index}][description]" placeholder="Fee Description" required>
      <input type="number" name="otherFees[${index}][amount]" placeholder="Amount" class="other-fee-amount" min="0" step="0.01">
      <input type="date" name="otherFees[${index}][date]" required>
      <button type="button" onclick="removeOtherFee(${index})">Remove</button>
    </div>
  `;
  
  container.insertAdjacentHTML('beforeend', feeHTML);
  setupAutoCalculation(); // Re-setup event listeners
};

// Example Step 4 data
const step4Data = {
  stampDuty: 25000,
  registrationFee: 5000,
  mutationFee: 2000,
  otherFees: [
    {
      description: "Legal Fee",
      amount: 3000,
      date: "2024-01-16"
    }
  ],
  officeFee: 2500,
  registrarCommission: [
    {
      amount: 4000,
      date: "2024-01-18",
      description: "Registrar commission for processing"
    }
  ],
  agentCommission: [
    {
      amount: 3500,
      date: "2024-01-19",
      description: "Agent commission"
    }
  ],
  paidAmount: {
    amount: 20000,
    mode: "UPI",
    remark: "Partial payment received"
  },
  pendingAmount: {
    amount: 26500, // This will be auto-calculated
    date: "2024-01-25",
    remark: "Balance payment pending"
  }
};
```

#### Get All Leads with Advanced Filtering
```javascript
const getLeads = async (page = 1, limit = 50, search = '', status = '', step = '') => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(status && { status }),
      ...(step && { step })
    });
    
    const response = await fetch(`/api/leads?${params}`);
    const result = await response.json();
    
    if (result.success) {
      console.log('Leads:', result.leads);
      displayLeads(result.leads);
      setupPagination(result.page, result.totalPages, result.total);
    } else {
      alert('Error: ' + result.message);
    }
  } catch (error) {
    console.error('Error fetching leads:', error);
    alert('Failed to fetch leads. Please try again.');
  }
};

// Display leads in a table
const displayLeads = (leads) => {
  const tbody = document.getElementById('leads-table-body');
  tbody.innerHTML = '';
  
  leads.forEach(lead => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${lead.leadId}</td>
      <td>${lead.customerName}</td>
      <td>${lead.mobileNumber}</td>
      <td>${lead.email || 'N/A'}</td>
      <td><span class="status-badge status-${lead.leadStatus.toLowerCase().replace(' ', '-')}">${lead.leadStatus}</span></td>
      <td>Step ${lead.stepCompleted}</td>
      <td>₹${lead.totalAmount?.toLocaleString() || '0'}</td>
      <td>${new Date(lead.createdAt).toLocaleDateString()}</td>
      <td>
        <button onclick="viewLead('${lead._id}')" class="btn-view">View</button>
        <button onclick="editLead('${lead._id}')" class="btn-edit">Edit</button>
        <button onclick="deleteLead('${lead._id}')" class="btn-delete">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
};

// Setup pagination
const setupPagination = (currentPage, totalPages, totalRecords) => {
  const paginationContainer = document.getElementById('pagination');
  paginationContainer.innerHTML = '';
  
  // Previous button
  if (currentPage > 1) {
    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Previous';
    prevBtn.onclick = () => getLeads(currentPage - 1);
    paginationContainer.appendChild(prevBtn);
  }
  
  // Page numbers
  for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
    const pageBtn = document.createElement('button');
    pageBtn.textContent = i;
    pageBtn.className = i === currentPage ? 'active' : '';
    pageBtn.onclick = () => getLeads(i);
    paginationContainer.appendChild(pageBtn);
  }
  
  // Next button
  if (currentPage < totalPages) {
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.onclick = () => getLeads(currentPage + 1);
    paginationContainer.appendChild(nextBtn);
  }
  
  // Show total records
  const totalInfo = document.getElementById('total-records');
  totalInfo.textContent = `Showing ${totalRecords} total records`;
};

// Search functionality
const setupSearch = () => {
  const searchInput = document.getElementById('search-input');
  const statusFilter = document.getElementById('status-filter');
  const stepFilter = document.getElementById('step-filter');
  
  const performSearch = () => {
    const search = searchInput.value;
    const status = statusFilter.value;
    const step = stepFilter.value;
    
    getLeads(1, 50, search, status, step);
  };
  
  searchInput.addEventListener('input', debounce(performSearch, 500));
  statusFilter.addEventListener('change', performSearch);
  stepFilter.addEventListener('change', performSearch);
};

// Debounce function for search
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
```

---

## 🎯 **FORM VALIDATION RULES**

### Step 1 Required Fields & Validation
```javascript
const validateStep1 = (data) => {
  const errors = [];
  
  // Required fields
  if (!data.customerName?.trim()) errors.push('Customer name is required');
  if (!data.mobileNumber?.trim()) errors.push('Mobile number is required');
  if (!data.date) errors.push('Date is required');
  
  // Format validation
  if (data.mobileNumber && !/^\d{10}$/.test(data.mobileNumber)) {
    errors.push('Mobile number must be exactly 10 digits');
  }
  
  // Date validation
  if (data.date && isNaN(new Date(data.date).getTime())) {
    errors.push('Invalid date format');
  }
  
  // Conditional validation
  if (data.sourceOfEntry === 'reference' && !data.referenceName?.trim()) {
    errors.push('Reference name is required when source is reference');
  }
  
  // Amount validation
  if (data.declarationAmount && data.declarationAmount < 0) {
    errors.push('Declaration amount cannot be negative');
  }
  
  return errors;
};
```

### Step 2 Validation
```javascript
const validateStep2 = (data) => {
  const errors = [];
  
  // Validate buyers
  if (data.buyers && data.buyers.length > 0) {
    data.buyers.forEach((buyer, index) => {
      if (!buyer.name?.trim()) errors.push(`Buyer ${index + 1}: Name is required`);
      if (!buyer.phoneNumber?.trim()) errors.push(`Buyer ${index + 1}: Phone number is required`);
      
      // PAN validation
      if (buyer.pan && !/^[A-Z]{5}\d{4}[A-Z]$/.test(buyer.pan)) {
        errors.push(`Buyer ${index + 1}: Invalid PAN format (ABCDE1234F)`);
      }
      
      // Aadhaar validation
      if (buyer.aadhar && !/^\d{12}$/.test(buyer.aadhar)) {
        errors.push(`Buyer ${index + 1}: Aadhaar must be 12 digits`);
      }
      
      // Email validation
      if (buyer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyer.email)) {
        errors.push(`Buyer ${index + 1}: Invalid email format`);
      }
    });
  }
  
  // Similar validation for sellers and individual...
  
  return errors;
};
```

### Step 3 Validation
```javascript
const validateStep3 = (data) => {
  const errors = [];
  
  // Date format validation (DD-MM-YYYY)
  if (data.documentStartingDate) {
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
    if (!dateRegex.test(data.documentStartingDate)) {
      errors.push('Document starting date must be in DD-MM-YYYY format');
    }
  }
  
  return errors;
};
```

### Step 4 Validation
```javascript
const validateStep4 = (data) => {
  const errors = [];
  
  // Amount validations
  const amountFields = ['stampDuty', 'registrationFee', 'mutationFee', 'officeFee'];
  amountFields.forEach(field => {
    if (data[field] !== undefined && data[field] < 0) {
      errors.push(`${field} cannot be negative`);
    }
  });
  
  // Other fees validation
  if (data.otherFees && data.otherFees.length > 0) {
    data.otherFees.forEach((fee, index) => {
      if (!fee.description?.trim()) errors.push(`Other fee ${index + 1}: Description is required`);
      if (fee.amount < 0) errors.push(`Other fee ${index + 1}: Amount cannot be negative`);
    });
  }
  
  // Paid amount validation
  if (data.paidAmount && data.paidAmount.amount < 0) {
    errors.push('Paid amount cannot be negative');
  }
  
  return errors;
};
```

### Step 5 Validation
```javascript
const validateStep5 = (data) => {
  const errors = [];
  
  // Success status validation
  if (data.successStatus && !['yes', 'no'].includes(data.successStatus)) {
    errors.push('Success status must be "yes" or "no"');
  }
  
  // Date format validation
  if (data.completionDate) {
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
    if (!dateRegex.test(data.completionDate)) {
      errors.push('Completion date must be in DD-MM-YYYY format');
    }
  }
  
  return errors;
};
```

---

## 🚨 **ERROR HANDLING**

All API responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "lead": { /* lead data */ },
  "nextStep": 2 // only for step progression
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

### Frontend Error Handling Template
```javascript
const handleApiResponse = async (response) => {
  const result = await response.json();
  
  if (result.success) {
    // Handle success
    return result;
  } else {
    // Handle error
    throw new Error(result.message);
  }
};

// Usage in API calls
const apiCall = async () => {
  try {
    const response = await fetch('/api/leads', { /* options */ });
    const result = await handleApiResponse(response);
    
    // Success handling
    console.log('Success:', result);
    
  } catch (error) {
    // Error handling
    console.error('Error:', error.message);
    alert('Error: ' + error.message);
  }
};
```

---

## 📋 **COMPLETE WORKFLOW EXAMPLE**

```javascript
// Complete lead creation workflow
class LeadManager {
  constructor(baseUrl = '/api/leads') {
    this.baseUrl = baseUrl;
    this.currentLead = null;
  }
  
  // Step 1: Create lead
  async createLead(formData, action = 'save') {
    const data = { ...formData, action };
    
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        this.currentLead = result.lead;
        return result;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Create lead error:', error);
      throw error;
    }
  }
  
  // Update any step
  async updateStep(step, data) {
    if (!this.currentLead) {
      throw new Error('No current lead found');
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/${this.currentLead._id}/step${step}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        this.currentLead = result.lead;
        return result;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error(`Update step ${step} error:`, error);
      throw error;
    }
  }
  
  // Get lead by ID
  async getLead(leadId) {
    try {
      const response = await fetch(`${this.baseUrl}/${leadId}`);
      const result = await response.json();
      
      if (result.success) {
        this.currentLead = result.lead;
        return result.lead;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Get lead error:', error);
      throw error;
    }
  }
  
  // Upload documents
  async uploadDocuments(files) {
    if (!this.currentLead) {
      throw new Error('No current lead found');
    }
    
    const formData = new FormData();
    for (let file of files) {
      formData.append('files', file);
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/${this.currentLead._id}/documents`, {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        this.currentLead = result.lead;
        return result;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Upload documents error:', error);
      throw error;
    }
  }
}

// Usage
const leadManager = new LeadManager();

// Create and manage a lead
const manageLead = async () => {
  try {
    // Step 1
    const step1Data = {
      customerName: "John Doe",
      mobileNumber: "9876543210",
      email: "john@example.com",
      date: "2024-01-15"
    };
    
    await leadManager.createLead(step1Data, 'continue');
    console.log('Step 1 completed');
    
    // Step 2
    const step2Data = {
      buyers: [{ name: "Buyer 1", phoneNumber: "9876543211" }],
      documentTypeOption: "EM_0.50"
    };
    
    await leadManager.updateStep(2, step2Data);
    console.log('Step 2 completed');
    
    // Continue with other steps...
    
  } catch (error) {
    console.error('Lead management error:', error.message);
  }
};
```