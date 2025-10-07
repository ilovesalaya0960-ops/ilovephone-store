// API Configuration
const API_BASE_URL = 'http://localhost:5001/api';

// API Endpoints
const API_ENDPOINTS = {
    // New Devices
    newDevices: `${API_BASE_URL}/new-devices`,

    // Used Devices
    usedDevices: `${API_BASE_URL}/used-devices`,

    // Repairs
    repairs: `${API_BASE_URL}/repairs`,

    // Installments
    installments: `${API_BASE_URL}/installments`,
    installmentPayments: (id) => `${API_BASE_URL}/installments/${id}/payments`,

    // Pawn Devices
    pawn: `${API_BASE_URL}/pawn`,

    // Accessories
    accessories: `${API_BASE_URL}/accessories`,
    accessoriesClaims: `${API_BASE_URL}/accessories/claims`,
    accessoryClaim: (id) => `${API_BASE_URL}/accessories/${id}/claim`,
    accessoryReturnStock: (id) => `${API_BASE_URL}/accessories/${id}/return-stock`,

    // Equipment
    equipment: `${API_BASE_URL}/equipment`
};

// Export for use in other files
window.API_BASE_URL = API_BASE_URL;
window.API_ENDPOINTS = API_ENDPOINTS;
