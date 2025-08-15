// API Configuration - Easy switching between mock and real APIs
const apiConfig = {
  // Set to true to use real APIs, false to use mock data
  useRealAPIs: false,
  
  // Individual API settings
  incorporation: {
    useReal: false,
    providers: ['firstbase', 'clerky', 'zenbusiness'],
    defaultProvider: 'firstbase'
  },
  
  ein: {
    useReal: false,
    // EIN is typically handled by incorporation provider
    provider: 'incorporation_provider'
  },
  
  bank: {
    useReal: false,
    provider: 'mercury'
  },
  
  // Mock data settings
  mock: {
    enableProcessSimulation: true,
    simulationSpeed: 'normal', // 'fast', 'normal', 'slow'
    autoProgress: true // Automatically progress companies through steps
  }
};

// Helper functions
const isMockMode = () => !apiConfig.useRealAPIs;
const isRealMode = () => apiConfig.useRealAPIs;

const getServiceClass = (serviceName) => {
  if (isMockMode()) {
    return require(`../services/Mock${serviceName}Service`);
  } else {
    return require(`../services/${serviceName}Service`);
  }
};

const getServiceInstance = (serviceName) => {
  const ServiceClass = getServiceClass(serviceName);
  return new ServiceClass();
};

module.exports = {
  apiConfig,
  isMockMode,
  isRealMode,
  getServiceClass,
  getServiceInstance
}; 