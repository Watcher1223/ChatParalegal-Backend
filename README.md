# ChatParalegal Backend

This is a Node.js backend for AI-powered startup legal automation, handling company incorporation, EIN applications, and bank account setup.

## 🏗️ **Complete Backend Architecture**

### **Core Components Created:**

1. **Database Structure** - 6 comprehensive migrations covering:
   - Companies, Founders, Incorporation Requests, EIN Requests, Bank Accounts, Users

2. **Service Layer** - Automated workflow services:
   - `IncorporationService` - Handles company formation APIs
   - `EINService` - Manages EIN applications
   - `BankService` - Handles Mercury bank setup
   - `EmailService` - Automated notifications

3. **API Routes** - Complete REST API:
   - Company registration and management
   - Incorporation process control
   - EIN status tracking
   - Bank account monitoring
   - Webhook endpoints for external APIs
   - User authentication

4. **Security & Infrastructure**:
   - JWT authentication with bcrypt
   - Input validation and sanitization
   - Rate limiting and security headers
   - Comprehensive error handling
   - Winston logging system

### **🚀 Automation Flow Implementation:**

**Step 1: User Registration** ✅
- Company and founder data collection
- KYC information storage
- Status: `pending_incorporation`

**Step 2: Company Registration API** ✅
- Integration with Firstbase, Clerky, ZenBusiness
- Webhook handlers for status updates
- Automatic EIN application trigger

**Step 3: EIN Application** ✅
- Partner API integration for EIN requests
- Status tracking: `pending_ein` → `ein_ready`
- Automatic bank setup trigger

**Step 4: Mercury Bank Setup** ✅
- Company documents and KYC submission
- Status tracking: `pending_bank_approval` → `bank_ready`
- Automated email with account credentials

### ** Project Structure:**
```
ChatParalegal-Backend/
├── src/
│   ├── database/
│   │   ├── migrations/          # 6 database tables
│   │   └── connection.js        # Database connection
│   ├── models/                  # Data models
│   ├── services/                # Business logic
│   ├── routes/                  # API endpoints
│   ├── middleware/              # Error handling, validation
│   ├── utils/                   # Logging, utilities
│   └── server.js                # Main server file
├── package.json                 # Dependencies & scripts
├── knexfile.js                  # Database configuration
├── env.example                  # Environment variables
├── start.sh                     # Startup script
└── README.md                    # Comprehensive documentation
```

### **🔧 Getting Started:**

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp env.example .env
   # Edit .env with your API keys and database settings
   ```

3. **Setup database:**
   ```bash
   createdb chat_paralegal
   npm run migrate
   ```

4. **Start development server:**
   ```bash
   ./start.sh
   # or
   npm run dev
   ```

### **🌐 API Endpoints Available:**
- **Health Check:** `GET /health`
- **Company Registration:** `POST /api/v1/company/register`
- **Incorporation:** `POST /api/v1/incorporation/initiate/:companyId`
- **Status Tracking:** Multiple endpoints for monitoring progress
- **Webhooks:** For external API callbacks

### ** Security Features:**
- JWT authentication
- Input validation
- Rate limiting
- Security headers
- CORS configuration
- Comprehensive error handling

This backend provides a production-ready foundation for your AI paralegal automation system. The webhook system ensures real-time updates from external services, while the automated workflow handles the entire process from company registration to bank account setup.

You can now integrate this with your frontend application and external APIs (Firstbase, Mercury, etc.) to create a seamless startup formation experience! 

## 🗄️ **Database Viewing Options**

### **1. Command Line (psql) - Most Direct**
```bash
# Connect to your database
psql -h localhost -U postgres -d chat_paralegal

# Once connected, you can:
# List all tables
\dt

# View table structure
\d companies
\d founders
\d incorporation_requests

# Query data
SELECT * FROM companies;
SELECT * FROM founders;
SELECT * FROM incorporation_requests;

# Exit psql
\q
```

