const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

class MockDataService {
  constructor() {
    this.mockData = this.initializeMockData();
  }

  initializeMockData() {
    return {
      companies: [
        {
          id: 'company-001',
          company_name: 'TechStartup Inc',
          entity_type: 'LLC',
          state: 'CA',
          status: 'bank_ready',
          company_details: {
            business_purpose: 'Technology consulting and software development',
            industry: 'Technology',
            expected_monthly_transactions: 15000,
            expected_monthly_volume: 75000
          },
          created_at: moment().subtract(30, 'days').toISOString(),
          updated_at: moment().subtract(2, 'days').toISOString()
        },
        {
          id: 'company-002',
          company_name: 'GreenEnergy Solutions',
          entity_type: 'Corporation',
          state: 'NY',
          status: 'ein_ready',
          company_details: {
            business_purpose: 'Renewable energy consulting and installation',
            industry: 'Energy',
            expected_monthly_transactions: 25000,
            expected_monthly_volume: 120000
          },
          created_at: moment().subtract(20, 'days').toISOString(),
          updated_at: moment().subtract(5, 'days').toISOString()
        },
        {
          id: 'company-003',
          company_name: 'Creative Design Studio',
          entity_type: 'LLC',
          state: 'TX',
          status: 'incorporated',
          company_details: {
            business_purpose: 'Graphic design and branding services',
            industry: 'Creative Services',
            expected_monthly_transactions: 8000,
            expected_monthly_volume: 40000
          },
          created_at: moment().subtract(15, 'days').toISOString(),
          updated_at: moment().subtract(8, 'days').toISOString()
        },
        {
          id: 'company-004',
          company_name: 'HealthTech Innovations',
          entity_type: 'Corporation',
          state: 'MA',
          status: 'incorporation_in_progress',
          company_details: {
            business_purpose: 'Healthcare technology solutions',
            industry: 'Healthcare',
            expected_monthly_transactions: 30000,
            expected_monthly_volume: 150000
          },
          created_at: moment().subtract(10, 'days').toISOString(),
          updated_at: moment().subtract(1, 'days').toISOString()
        },
        {
          id: 'company-005',
          company_name: 'Local Food Market',
          entity_type: 'LLC',
          state: 'OR',
          status: 'pending_incorporation',
          company_details: {
            business_purpose: 'Local organic food retail and delivery',
            industry: 'Food & Beverage',
            expected_monthly_transactions: 12000,
            expected_monthly_volume: 60000
          },
          created_at: moment().subtract(5, 'days').toISOString(),
          updated_at: moment().toISOString()
        }
      ],
      founders: [
        {
          id: 'founder-001',
          company_id: 'company-001',
          legal_name: 'Sarah Johnson',
          date_of_birth: '1985-03-15',
          address: {
            street: '123 Innovation Drive',
            city: 'San Francisco',
            state: 'CA',
            zip: '94105'
          },
          id_type: 'passport',
          id_number: 'P123456789',
          id_front_image_url: 'https://example.com/id_front_001.jpg',
          id_back_image_url: 'https://example.com/id_back_001.jpg',
          selfie_image_url: 'https://example.com/selfie_001.jpg',
          kyc_verified: true,
          created_at: moment().subtract(30, 'days').toISOString()
        },
        {
          id: 'founder-002',
          company_id: 'company-002',
          legal_name: 'Michael Chen',
          date_of_birth: '1982-07-22',
          address: {
            street: '456 Green Street',
            city: 'New York',
            state: 'NY',
            zip: '10001'
          },
          id_type: 'driver_license',
          id_number: 'DL987654321',
          id_front_image_url: 'https://example.com/id_front_002.jpg',
          id_back_image_url: 'https://example.com/id_back_002.jpg',
          selfie_image_url: 'https://example.com/selfie_002.jpg',
          kyc_verified: true,
          created_at: moment().subtract(20, 'days').toISOString()
        },
        {
          id: 'founder-003',
          company_id: 'company-003',
          legal_name: 'Emily Rodriguez',
          date_of_birth: '1990-11-08',
          address: {
            street: '789 Creative Lane',
            city: 'Austin',
            state: 'TX',
            zip: '73301'
          },
          id_type: 'state_id',
          id_number: 'TX123456789',
          id_front_image_url: 'https://example.com/id_front_003.jpg',
          id_back_image_url: 'https://example.com/id_back_003.jpg',
          selfie_image_url: 'https://example.com/selfie_003.jpg',
          kyc_verified: true,
          created_at: moment().subtract(15, 'days').toISOString()
        }
      ],
      incorporation_requests: [
        {
          id: 'inc-001',
          company_id: 'company-001',
          formation_provider: 'firstbase',
          external_request_id: 'FB123456789',
          status: 'completed',
          request_data: {
            company_name: 'TechStartup Inc',
            entity_type: 'LLC',
            state: 'CA'
          },
          response_data: {
            request_id: 'FB123456789',
            status: 'completed',
            documents: {
              articles_of_incorporation: 'https://example.com/articles_001.pdf',
              formation_certificate: 'https://example.com/certificate_001.pdf'
            }
          },
          articles_of_incorporation_url: 'https://example.com/articles_001.pdf',
          formation_certificate_url: 'https://example.com/certificate_001.pdf',
          submitted_at: moment().subtract(28, 'days').toISOString(),
          completed_at: moment().subtract(25, 'days').toISOString()
        },
        {
          id: 'inc-002',
          company_id: 'company-002',
          formation_provider: 'clerky',
          external_request_id: 'CL987654321',
          status: 'completed',
          request_data: {
            company_name: 'GreenEnergy Solutions',
            entity_type: 'Corporation',
            state: 'NY'
          },
          response_data: {
            request_id: 'CL987654321',
            status: 'completed',
            documents: {
              articles_of_incorporation: 'https://example.com/articles_002.pdf',
              formation_certificate: 'https://example.com/certificate_002.pdf'
            }
          },
          articles_of_incorporation_url: 'https://example.com/articles_002.pdf',
          formation_certificate_url: 'https://example.com/certificate_002.pdf',
          submitted_at: moment().subtract(18, 'days').toISOString(),
          completed_at: moment().subtract(15, 'days').toISOString()
        },
        {
          id: 'inc-003',
          company_id: 'company-003',
          formation_provider: 'firstbase',
          external_request_id: 'FB456789123',
          status: 'completed',
          request_data: {
            company_name: 'Creative Design Studio',
            entity_type: 'LLC',
            state: 'TX'
          },
          response_data: {
            request_id: 'FB456789123',
            status: 'completed',
            documents: {
              articles_of_incorporation: 'https://example.com/articles_003.pdf',
              formation_certificate: 'https://example.com/certificate_003.pdf'
            }
          },
          articles_of_incorporation_url: 'https://example.com/articles_003.pdf',
          formation_certificate_url: 'https://example.com/certificate_003.pdf',
          submitted_at: moment().subtract(13, 'days').toISOString(),
          completed_at: moment().subtract(10, 'days').toISOString()
        },
        {
          id: 'inc-004',
          company_id: 'company-004',
          formation_provider: 'firstbase',
          external_request_id: 'FB789123456',
          status: 'in_progress',
          request_data: {
            company_name: 'HealthTech Innovations',
            entity_type: 'Corporation',
            state: 'MA'
          },
          response_data: {
            request_id: 'FB789123456',
            status: 'in_progress',
            estimated_completion: moment().add(3, 'days').toISOString()
          },
          submitted_at: moment().subtract(8, 'days').toISOString()
        }
      ],
      ein_requests: [
        {
          id: 'ein-001',
          company_id: 'company-001',
          ein_number: '12-3456789',
          status: 'issued',
          request_data: {
            company_name: 'TechStartup Inc',
            entity_type: 'LLC',
            state: 'CA'
          },
          response_data: {
            status: 'issued',
            ein_number: '12-3456789',
            issued_date: moment().subtract(23, 'days').toISOString()
          },
          ein_letter_url: 'https://example.com/ein_letter_001.pdf',
          submitted_at: moment().subtract(25, 'days').toISOString(),
          issued_at: moment().subtract(23, 'days').toISOString()
        },
        {
          id: 'ein-002',
          company_id: 'company-002',
          ein_number: '98-7654321',
          status: 'issued',
          request_data: {
            company_name: 'GreenEnergy Solutions',
            entity_type: 'Corporation',
            state: 'NY'
          },
          response_data: {
            status: 'issued',
            ein_number: '98-7654321',
            issued_date: moment().subtract(13, 'days').toISOString()
          },
          ein_letter_url: 'https://example.com/ein_letter_002.pdf',
          submitted_at: moment().subtract(15, 'days').toISOString(),
          issued_at: moment().subtract(13, 'days').toISOString()
        },
        {
          id: 'ein-003',
          company_id: 'company-003',
          status: 'pending',
          request_data: {
            company_name: 'Creative Design Studio',
            entity_type: 'LLC',
            state: 'TX'
          },
          response_data: {
            status: 'pending',
            estimated_completion: moment().add(2, 'days').toISOString()
          },
          submitted_at: moment().subtract(10, 'days').toISOString()
        }
      ],
      bank_accounts: [
        {
          id: 'bank-001',
          company_id: 'company-001',
          bank_provider: 'mercury',
          external_account_id: 'MC123456789',
          account_number: '****1234',
          routing_number: '021000021',
          account_type: 'checking',
          status: 'active',
          account_details: {
            account_name: 'TechStartup Inc - Business Checking',
            monthly_fee: 0,
            minimum_balance: 0
          },
          kyc_data: {
            company_name: 'TechStartup Inc',
            ein_number: '12-3456789',
            formation_date: moment().subtract(25, 'days').toISOString()
          },
          submitted_at: moment().subtract(20, 'days').toISOString(),
          approved_at: moment().subtract(18, 'days').toISOString()
        },
        {
          id: 'bank-002',
          company_id: 'company-002',
          bank_provider: 'mercury',
          external_account_id: 'MC987654321',
          account_number: '****5678',
          routing_number: '021000021',
          account_type: 'checking',
          status: 'pending',
          account_details: {
            account_name: 'GreenEnergy Solutions - Business Checking',
            monthly_fee: 0,
            minimum_balance: 0
          },
          kyc_data: {
            company_name: 'GreenEnergy Solutions',
            ein_number: '98-7654321',
            formation_date: moment().subtract(15, 'days').toISOString()
          },
          submitted_at: moment().subtract(10, 'days').toISOString()
        }
      ],
      users: [
        {
          id: 'user-001',
          email: 'sarah@techstartup.com',
          first_name: 'Sarah',
          last_name: 'Johnson',
          role: 'founder',
          company_id: 'company-001',
          email_verified: true,
          last_login: moment().subtract(2, 'hours').toISOString(),
          created_at: moment().subtract(30, 'days').toISOString()
        },
        {
          id: 'user-002',
          email: 'michael@greenenergy.com',
          first_name: 'Michael',
          last_name: 'Chen',
          role: 'founder',
          company_id: 'company-002',
          email_verified: true,
          last_login: moment().subtract(1, 'day').toISOString(),
          created_at: moment().subtract(20, 'days').toISOString()
        },
        {
          id: 'user-003',
          email: 'emily@creativedesign.com',
          first_name: 'Emily',
          last_name: 'Rodriguez',
          role: 'founder',
          company_id: 'company-003',
          email_verified: true,
          last_login: moment().subtract(3, 'days').toISOString(),
          created_at: moment().subtract(15, 'days').toISOString()
        }
      ]
    };
  }

  // Company methods
  getAllCompanies() {
    return this.mockData.companies;
  }

  getCompanyById(id) {
    return this.mockData.companies.find(c => c.id === id);
  }

  getCompaniesByStatus(status) {
    return this.mockData.companies.filter(c => c.status === status);
  }

  createCompany(companyData) {
    const newCompany = {
      id: `company-${uuidv4().substring(0, 8)}`,
      ...companyData,
      status: 'pending_incorporation',
      created_at: moment().toISOString(),
      updated_at: moment().toISOString()
    };
    this.mockData.companies.push(newCompany);
    return newCompany;
  }

  updateCompanyStatus(id, status) {
    const company = this.mockData.companies.find(c => c.id === id);
    if (company) {
      company.status = status;
      company.updated_at = moment().toISOString();
      return company;
    }
    return null;
  }

  // Founder methods
  getFoundersByCompanyId(companyId) {
    return this.mockData.founders.filter(f => f.company_id === companyId);
  }

  createFounder(founderData) {
    const newFounder = {
      id: `founder-${uuidv4().substring(0, 8)}`,
      ...founderData,
      created_at: moment().toISOString()
    };
    this.mockData.founders.push(newFounder);
    return newFounder;
  }

  // Incorporation methods
  getIncorporationByCompanyId(companyId) {
    return this.mockData.incorporation_requests.find(inc => inc.company_id === companyId);
  }

  createIncorporationRequest(incorporationData) {
    const newRequest = {
      id: `inc-${uuidv4().substring(0, 8)}`,
      ...incorporationData,
      status: 'pending',
      created_at: moment().toISOString()
    };
    this.mockData.incorporation_requests.push(newRequest);
    return newRequest;
  }

  // EIN methods
  getEINByCompanyId(companyId) {
    return this.mockData.ein_requests.find(ein => ein.company_id === companyId);
  }

  // Bank methods
  getBankAccountByCompanyId(companyId) {
    return this.mockData.bank_accounts.find(bank => bank.company_id === companyId);
  }

  // User methods
  getUserByEmail(email) {
    return this.mockData.users.find(u => u.email === email);
  }

  createUser(userData) {
    const newUser = {
      id: `user-${uuidv4().substring(0, 8)}`,
      ...userData,
      email_verified: false,
      created_at: moment().toISOString()
    };
    this.mockData.users.push(newUser);
    return newUser;
  }

  // Dashboard statistics
  getDashboardStats() {
    const totalCompanies = this.mockData.companies.length;
    const pendingIncorporation = this.mockData.companies.filter(c => c.status === 'pending_incorporation').length;
    const incorporated = this.mockData.companies.filter(c => c.status === 'incorporated').length;
    const einReady = this.mockData.companies.filter(c => c.status === 'ein_ready').length;
    const bankReady = this.mockData.companies.filter(c => c.status === 'bank_ready').length;

    return {
      total_companies: totalCompanies,
      pending_incorporation: pendingIncorporation,
      incorporated: incorporated,
      ein_ready: einReady,
      bank_ready: bankReady,
      completion_rate: Math.round((bankReady / totalCompanies) * 100)
    };
  }

  // Simulate process progression
  simulateProcessProgression() {
    // Simulate companies moving through the process
    this.mockData.companies.forEach(company => {
      if (company.status === 'pending_incorporation') {
        // 20% chance to move to incorporation_in_progress
        if (Math.random() < 0.2) {
          company.status = 'incorporation_in_progress';
          company.updated_at = moment().toISOString();
        }
      } else if (company.status === 'incorporation_in_progress') {
        // 30% chance to complete incorporation
        if (Math.random() < 0.3) {
          company.status = 'incorporated';
          company.updated_at = moment().toISOString();
        }
      } else if (company.status === 'incorporated') {
        // 40% chance to get EIN
        if (Math.random() < 0.4) {
          company.status = 'ein_ready';
          company.updated_at = moment().toISOString();
        }
      } else if (company.status === 'ein_ready') {
        // 50% chance to get bank account
        if (Math.random() < 0.5) {
          company.status = 'bank_ready';
          company.updated_at = moment().toISOString();
        }
      }
    });
  }
}

module.exports = MockDataService; 