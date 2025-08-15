# 🚀 ChatParalegal Backend API Documentation

## 📋 **Overview**
This document describes all available API endpoints for the ChatParalegal backend system. The system is currently running in **MOCK MODE** with realistic test data. All endpoints return structured JSON responses.

**Base URL**: `http://localhost:3000/api/v1`

---

## 🔐 **Authentication Endpoints**

### **User Registration**
- **Endpoint**: `POST /auth/register`
- **Description**: Register a new user account
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123",
    "first_name": "John",
    "last_name": "Doe",
    "company_id": "company-123"
  }
  ```
- **Response**: User account created with JWT token

### **User Login**
- **Endpoint**: `POST /auth/login`
- **Description**: Authenticate user and get JWT token
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123"
  }
  ```
- **Response**: JWT token and user information

### **Get User Profile**
- **Endpoint**: `GET /auth/profile`
- **Description**: Get current user's profile information
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Response**: User profile data

---

## 🏢 **Company Management Endpoints**

### **Register Company with Founder**
- **Endpoint**: `POST /company/register`
- **Description**: Create a new company and founder record
- **Request Body**:
  ```json
  {
    "company_name": "TechStartup Inc",
    "entity_type": "LLC",
    "state": "CA",
    "company_details": {
      "business_purpose": "Technology consulting",
      "industry": "Technology"
    },
    "founder": {
      "legal_name": "John Doe",
      "date_of_birth": "1990-01-01",
      "address": {
        "street": "123 Main St",
        "city": "San Francisco",
        "state": "CA",
        "zip": "94105"
      },
      "id_type": "passport",
      "id_number": "P123456789"
    }
  }
  ```
- **Response**: Company and founder created with IDs

### **Get Company Details**
- **Endpoint**: `GET /company/:id`
- **Description**: Get detailed information about a specific company
- **Parameters**: `id` - Company UUID
- **Response**: Company details with founder information

### **Update Company Information**
- **Endpoint**: `PUT /company/:id`
- **Description**: Update company details (only if pending incorporation)
- **Parameters**: `id` - Company UUID
- **Request Body**: Company update data
- **Response**: Updated company information

### **List All Companies**
- **Endpoint**: `GET /company`
- **Description**: Get paginated list of all companies
- **Query Parameters**:
  - `status` - Filter by company status
  - `page` - Page number (default: 1)
  - `limit` - Items per page (default: 10)
- **Response**: Paginated company list with metadata

### **Delete Company**
- **Endpoint**: `DELETE /company/:id`
- **Description**: Delete company (only if pending incorporation)
- **Parameters**: `id` - Company UUID
- **Response**: Deletion confirmation

---

## 📋 **Incorporation Process Endpoints**

### **Initiate Incorporation**
- **Endpoint**: `POST /incorporation/initiate/:companyId`
- **Description**: Start the incorporation process for a company
- **Parameters**: `companyId` - Company UUID
- **Request Body**:
  ```json
  {
    "formation_provider": "firstbase"
  }
  ```
- **Response**: Incorporation request details with estimated completion

### **Get Incorporation Status**
- **Endpoint**: `GET /incorporation/status/:companyId`
- **Description**: Check current incorporation status
- **Parameters**: `companyId` - Company UUID
- **Response**: Current status, provider, and timeline

### **Get Incorporation Documents**
- **Endpoint**: `GET /incorporation/documents/:companyId`
- **Description**: Retrieve incorporation documents once complete
- **Parameters**: `companyId` - Company UUID
- **Response**: Document URLs and status

---

## 🔢 **EIN Management Endpoints**

### **Get EIN Status**
- **Endpoint**: `GET /ein/status/:companyId`
- **Description**: Check EIN application status
- **Parameters**: `companyId` - Company UUID
- **Response**: EIN application status and timeline

### **Get EIN Number**
- **Endpoint**: `GET /ein/number/:companyId`
- **Description**: Retrieve EIN number once issued
- **Parameters**: `companyId` - Company UUID
- **Response**: EIN number and confirmation letter

---

## 🏦 **Bank Account Endpoints**

### **Get Bank Account Status**
- **Endpoint**: `GET /bank/status/:companyId`
- **Description**: Check bank account setup status
- **Parameters**: `companyId` - Company UUID
- **Response**: Bank account application status

### **Get Bank Account Details**
- **Endpoint**: `GET /bank/account/:companyId`
- **Description**: Retrieve bank account details once approved
- **Parameters**: `companyId` - Company UUID
- **Response**: Account number, routing number, and bank details

---

## 📊 **Dashboard Endpoints**

### **Get Dashboard Overview**
- **Endpoint**: `GET /dashboard/overview`
- **Description**: Get overall system statistics and recent activity
- **Response**: Company counts, completion rates, and activity feed

### **Get Company Process Flow**
- **Endpoint**: `GET /dashboard/process/:companyId`
- **Description**: Get detailed process flow for a specific company
- **Parameters**: `companyId` - Company UUID
- **Response**: Step-by-step process status and details

### **Simulate Process Progression**
- **Endpoint**: `POST /dashboard/simulate-progression`
- **Description**: Manually trigger process simulation (for testing)
- **Response**: Updated statistics after simulation

---

## 🔄 **Webhook Endpoints**

### **Incorporation Webhook**
- **Endpoint**: `POST /webhooks/incorporation/:provider`
- **Description**: Receive incorporation status updates
- **Parameters**: `provider` - Formation provider name
- **Headers**: `x-signature` or `authorization` for verification
- **Request Body**: Provider-specific webhook data

### **EIN Webhook**
- **Endpoint**: `POST /webhooks/ein/:partner`
- **Description**: Receive EIN application status updates
- **Parameters**: `partner` - EIN service partner name
- **Headers**: `x-signature` or `authorization` for verification
- **Request Body**: Partner-specific webhook data

### **Bank Webhook**
- **Endpoint**: `POST /webhooks/bank/:provider`
- **Description**: Receive bank account status updates
- **Parameters**: `provider` - Bank provider name
- **Headers**: `x-signature` or `authorization` for verification
- **Request Body**: Provider-specific webhook data

### **Test Webhook**
- **Endpoint**: `POST /webhooks/test`
- **Description**: Test webhook endpoint for development
- **Request Body**: Any test data
- **Response**: Echo of received data with timestamp

---

## 🎯 **Mock Data Features**

### **Realistic Test Data**
- **5 sample companies** in various stages of the process
- **3 sample founders** with complete KYC information
- **Incorporation requests** with realistic timelines
- **EIN applications** with status progression
- **Bank accounts** with approval workflows

### **Process Simulation**
- **Automatic progression** through incorporation steps
- **Realistic timelines** (days/weeks for each step)
- **Status updates** that mimic real API behavior
- **Document generation** with placeholder URLs

### **Status Progression**
1. **pending_incorporation** → **incorporation_in_progress**
2. **incorporation_in_progress** → **incorporated**
3. **incorporated** → **ein_ready**
4. **ein_ready** → **bank_ready**

---

## 🔧 **Configuration & Switching to Real APIs**

### **Enable Real APIs**
To switch from mock to real APIs, update `src/config/apiConfig.js`:

```javascript
const apiConfig = {
  useRealAPIs: true,  // Change to true
  
  incorporation: {
    useReal: true,     // Change to true
    providers: ['firstbase', 'clerky', 'zenbusiness'],
    defaultProvider: 'firstbase'
  },
  
  ein: {
    useReal: true,     // Change to true
    provider: 'incorporation_provider'
  },
  
  bank: {
    useReal: true,     // Change to true
    provider: 'mercury'
  }
};
```

### **Required Environment Variables**
```bash
# For Firstbase
FIRSTBASE_API_KEY=your_api_key
FIRSTBASE_WEBHOOK_SECRET=your_webhook_secret

# For Mercury
MERCURY_API_KEY=your_api_key
MERCURY_WEBHOOK_SECRET=your_webhook_secret

# For other providers
CLERKY_API_KEY=your_api_key
ZENBUSINESS_API_KEY=your_api_key
```

---

## 📱 **Frontend Integration Examples**

### **Company Registration Flow**
```javascript
// 1. Register company
const companyResponse = await fetch('/api/v1/company/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(companyData)
});

// 2. Initiate incorporation
const incorporationResponse = await fetch(`/api/v1/incorporation/initiate/${companyId}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ formation_provider: 'firstbase' })
});

// 3. Monitor progress
const statusResponse = await fetch(`/api/v1/incorporation/status/${companyId}`);
const einStatusResponse = await fetch(`/api/v1/ein/status/${companyId}`);
const bankStatusResponse = await fetch(`/api/v1/bank/status/${companyId}`);
```

### **Dashboard Integration**
```javascript
// Get overview statistics
const overviewResponse = await fetch('/api/v1/dashboard/overview');

// Get company process flow
const processFlowResponse = await fetch(`/api/v1/dashboard/process/${companyId}`);

// Simulate process progression (for testing)
const simulationResponse = await fetch('/api/v1/dashboard/simulate-progression', {
  method: 'POST'
});
```

---

## 🚀 **Getting Started**

1. **Start the server**: `npm run dev`
2. **Test endpoints**: Use the health check at `GET /health`
3. **Register a company**: Use `POST /company/register`
4. **Monitor progress**: Use dashboard and status endpoints
5. **Switch to real APIs**: Update configuration and add API keys

---

## 📞 **Support**

For questions or issues:
- Check the server logs for detailed information
- Verify endpoint URLs and request formats
- Ensure all required fields are provided in requests
- Test with the provided mock data first

**Happy coding! 🎉** 