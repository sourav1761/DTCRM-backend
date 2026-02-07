# Payment Management API Documentation

## Base URL: `/api/leads/:leadId/payments`

## 1. Add Payment
**POST** `/api/leads/:leadId/payments`

### Request Body:
```json
{
  "amount": 50000,
  "mode": "online",
  "date": "2024-01-15",
  "remark": "First installment payment",
  "reference": "TXN123456789"
}
```

### Response:
```json
{
  "success": true,
  "message": "Payment added successfully",
  "payment": {
    "_id": "65a1b2c3d4e5f6789012345",
    "amount": 50000,
    "mode": "online",
    "date": "2024-01-15T00:00:00.000Z",
    "remark": "First installment payment",
    "reference": "TXN123456789"
  },
  "totalPaid": 50000,
  "pendingAmount": 150000
}
```

## 2. Get All Payments for a Lead
**GET** `/api/leads/:leadId/payments`

### Response:
```json
{
  "success": true,
  "payments": [
    {
      "_id": "65a1b2c3d4e5f6789012345",
      "amount": 50000,
      "mode": "online",
      "date": "2024-01-15T00:00:00.000Z",
      "remark": "First installment payment",
      "reference": "TXN123456789"
    },
    {
      "_id": "65a1b2c3d4e5f6789012346",
      "amount": 30000,
      "mode": "cash",
      "date": "2024-01-20T00:00:00.000Z",
      "remark": "Second installment",
      "reference": ""
    }
  ],
  "totalAmount": 200000,
  "totalPaid": 80000,
  "pendingAmount": 120000
}
```

## 3. Update Payment
**PUT** `/api/leads/:leadId/payments/:paymentId`

### Request Body:
```json
{
  "amount": 55000,
  "mode": "cheque",
  "date": "2024-01-16",
  "remark": "Updated first installment",
  "reference": "CHQ123456"
}
```

### Response:
```json
{
  "success": true,
  "message": "Payment updated successfully",
  "payment": {
    "_id": "65a1b2c3d4e5f6789012345",
    "amount": 55000,
    "mode": "cheque",
    "date": "2024-01-16T00:00:00.000Z",
    "remark": "Updated first installment",
    "reference": "CHQ123456"
  },
  "totalPaid": 85000,
  "pendingAmount": 115000
}
```

## 4. Delete Payment
**DELETE** `/api/leads/:leadId/payments/:paymentId`

### Response:
```json
{
  "success": true,
  "message": "Payment deleted successfully",
  "totalPaid": 30000,
  "pendingAmount": 170000
}
```

## Payment Modes Available:
- `cash`
- `cheque`
- `online`
- `card`
- `upi`

## Frontend Integration Examples

### 1. Fetch Payments for Display
```javascript
const fetchPayments = async (leadId) => {
  try {
    const response = await fetch(`/api/leads/${leadId}/payments`);
    const data = await response.json();
    
    if (data.success) {
      return {
        payments: data.payments,
        totalAmount: data.totalAmount,
        totalPaid: data.totalPaid,
        pendingAmount: data.pendingAmount
      };
    }
  } catch (error) {
    console.error('Error fetching payments:', error);
  }
};
```

### 2. Add New Payment
```javascript
const addPayment = async (leadId, paymentData) => {
  try {
    const response = await fetch(`/api/leads/${leadId}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding payment:', error);
  }
};
```

### 3. Update Payment
```javascript
const updatePayment = async (leadId, paymentId, paymentData) => {
  try {
    const response = await fetch(`/api/leads/${leadId}/payments/${paymentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating payment:', error);
  }
};
```

### 4. Delete Payment
```javascript
const deletePayment = async (leadId, paymentId) => {
  try {
    const response = await fetch(`/api/leads/${leadId}/payments/${paymentId}`, {
      method: 'DELETE'
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting payment:', error);
  }
};
```

## Updated Step 4 API

### Update Step 4 with Multiple Payments
**PUT** `/api/leads/:leadId/step4`

### Request Body:
```json
{
  "stampDuty": 10000,
  "registrationFee": 5000,
  "mutationFee": 2000,
  "officeFee": 3000,
  "otherFees": [
    {
      "description": "Legal fees",
      "amount": 5000,
      "date": "2024-01-10"
    }
  ],
  "registrarCommission": [
    {
      "amount": 2000,
      "date": "2024-01-10",
      "description": "Registrar commission"
    }
  ],
  "agentCommission": [
    {
      "amount": 3000,
      "date": "2024-01-10",
      "description": "Agent commission"
    }
  ],
  "payments": [
    {
      "amount": 15000,
      "mode": "online",
      "date": "2024-01-15",
      "remark": "Initial payment",
      "reference": "TXN123"
    },
    {
      "amount": 10000,
      "mode": "cash",
      "date": "2024-01-20",
      "remark": "Second payment",
      "reference": ""
    }
  ]
}
```