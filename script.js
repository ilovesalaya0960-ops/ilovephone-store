// Store data
const stores = {
    salaya: 'ร้านไอเลิฟโฟน - ศาลายา',
    klongyong: 'ร้านไอเลิฟโฟน - คลองโยง'
};

let currentStore = 'salaya';
let currentMonth = new Date().toISOString().slice(0, 7); // Format: YYYY-MM

// ===== API HELPER FUNCTIONS =====
const API = {
    // GET request
    async get(endpoint, params = {}) {
        try {
            const queryString = new URLSearchParams(params).toString();
            const url = queryString ? `${endpoint}?${queryString}` : endpoint;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API GET Error:', error);
            throw error;
        }
    },

    // POST request
    async post(endpoint, data = {}) {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API POST Error:', error);
            throw error;
        }
    },

    // PUT request
    async put(endpoint, data = {}) {
        try {
            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API PUT Error:', error);
            throw error;
        }
    },

    // DELETE request
    async delete(endpoint) {
        try {
            const response = await fetch(endpoint, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API DELETE Error:', error);
            throw error;
        }
    }
};

// Page titles
const pageTitles = {
    'dashboard': 'แดชบอร์ด',
    'income-breakdown': 'รายรับแยกตามประเภท',
    'expense-breakdown': 'รายจ่ายแยกตามประเภท',
    'profit-breakdown': 'กำไรสุทธิแยกตามประเภท',
    'new-devices': 'จัดการเครื่องใหม่',
    'used-devices': 'เครื่องมือสอง',
    'installment': 'เครื่องผ่อน',
    'pawn': 'เครื่องจำนำ',
    'repair': 'เครื่องซ่อม',
    'accessories': 'รายการอะไหล่',
    'expenses': 'ค่าใช้จ่าย'
};

// Mock data for dashboard (จะถูกแทนที่ด้วยข้อมูลจริงจากฐานข้อมูล)
const mockData = {
    salaya: {
        '2025-10': { newDevices: 45, usedDevices: 23, repair: 67, installment: 12, pawn: 8, income: 450000, expense: 120000 },
        '2025-09': { newDevices: 38, usedDevices: 19, repair: 54, installment: 15, pawn: 5, income: 380000, expense: 110000 },
        '2025-08': { newDevices: 42, usedDevices: 25, repair: 61, installment: 18, pawn: 10, income: 425000, expense: 125000 },
        '2025-07': { newDevices: 36, usedDevices: 21, repair: 58, installment: 14, pawn: 7, income: 395000, expense: 115000 },
        '2025-06': { newDevices: 40, usedDevices: 17, repair: 52, installment: 16, pawn: 9, income: 410000, expense: 118000 },
        '2025-05': { newDevices: 33, usedDevices: 22, repair: 64, installment: 13, pawn: 6, income: 375000, expense: 112000 },
        '2025-04': { newDevices: 47, usedDevices: 20, repair: 59, installment: 17, pawn: 11, income: 465000, expense: 128000 },
        '2025-03': { newDevices: 41, usedDevices: 24, repair: 66, installment: 19, pawn: 8, income: 430000, expense: 122000 },
        '2025-02': { newDevices: 35, usedDevices: 16, repair: 48, installment: 11, pawn: 5, income: 355000, expense: 105000 },
        '2025-01': { newDevices: 39, usedDevices: 18, repair: 55, installment: 14, pawn: 7, income: 400000, expense: 117000 },
        '2024-12': { newDevices: 50, usedDevices: 27, repair: 72, installment: 20, pawn: 12, income: 520000, expense: 135000 },
        '2024-11': { newDevices: 44, usedDevices: 22, repair: 63, installment: 15, pawn: 9, income: 445000, expense: 124000 },
    },
    klongyong: {
        '2025-10': { newDevices: 32, usedDevices: 18, repair: 45, installment: 9, pawn: 6, income: 320000, expense: 95000 },
        '2025-09': { newDevices: 28, usedDevices: 15, repair: 38, installment: 11, pawn: 4, income: 280000, expense: 85000 },
        '2025-08': { newDevices: 35, usedDevices: 20, repair: 42, installment: 13, pawn: 7, income: 310000, expense: 90000 },
        '2025-07': { newDevices: 30, usedDevices: 16, repair: 40, installment: 10, pawn: 5, income: 295000, expense: 88000 },
        '2025-06': { newDevices: 33, usedDevices: 14, repair: 37, installment: 12, pawn: 6, income: 305000, expense: 92000 },
        '2025-05': { newDevices: 27, usedDevices: 17, repair: 44, installment: 9, pawn: 4, income: 270000, expense: 82000 },
        '2025-04': { newDevices: 36, usedDevices: 19, repair: 46, installment: 14, pawn: 8, income: 335000, expense: 98000 },
        '2025-03': { newDevices: 31, usedDevices: 21, repair: 48, installment: 15, pawn: 6, income: 315000, expense: 94000 },
        '2025-02': { newDevices: 26, usedDevices: 13, repair: 35, installment: 8, pawn: 3, income: 255000, expense: 78000 },
        '2025-01': { newDevices: 29, usedDevices: 16, repair: 39, installment: 10, pawn: 5, income: 285000, expense: 86000 },
        '2024-12': { newDevices: 38, usedDevices: 22, repair: 52, installment: 16, pawn: 9, income: 365000, expense: 102000 },
        '2024-11': { newDevices: 34, usedDevices: 18, repair: 43, installment: 12, pawn: 7, income: 325000, expense: 96000 },
    }
};

// Thai month names
const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeStoreSelector();
    initializeMonthSelector();
    updateDashboard();
});

// Navigation functionality
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));

            // Add active class to clicked item
            this.classList.add('active');

            // Get page to show
            const page = this.getAttribute('data-page');

            // Hide all pages
            const allPages = document.querySelectorAll('.page-content');
            allPages.forEach(p => p.classList.remove('active'));

            // Show selected page
            const selectedPage = document.getElementById(page);
            if (selectedPage) {
                selectedPage.classList.add('active');
            }

            // Update page title
            const pageTitle = document.getElementById('pageTitle');
            pageTitle.textContent = pageTitles[page] || 'ระบบจัดการร้านมือถือ';
        });
    });
}

// Store selector functionality
function initializeStoreSelector() {
    const storeSelect = document.getElementById('storeSelect');
    const currentStoreDisplay = document.getElementById('currentStore');

    storeSelect.addEventListener('change', function() {
        currentStore = this.value;
        currentStoreDisplay.textContent = stores[currentStore];

        // Update store toggle buttons
        updateStoreToggleButtons();

        // Update dashboard with new store data
        updateDashboard();

        // Reload new devices data
        loadNewDevicesData();

        // Reload used devices data
        loadUsedDevicesData();

        // Reload repair data
        loadRepairData();

        // Reload installment data
        loadInstallmentData();

        // Reload pawn data
        loadPawnData();

        // Reload accessories data
        loadAccessoriesData();

        // Optional: Show a brief notification
        showStoreChangeNotification();
    });
}

// Switch store within page
function switchStoreInPage(store, page) {
    // Update current store
    currentStore = store;

    // Update store display in sidebar
    const currentStoreDisplay = document.getElementById('currentStore');
    const storeSelect = document.getElementById('storeSelect');
    if (currentStoreDisplay) {
        currentStoreDisplay.textContent = stores[store];
    }
    if (storeSelect) {
        storeSelect.value = store;
    }

    // Update all store toggle buttons
    updateStoreToggleButtons();

    // Reload data for the specific page
    if (page === 'newDevices') {
        loadNewDevicesData();
    } else if (page === 'usedDevices') {
        loadUsedDevicesData();
    }

    // Update dashboard
    updateDashboard();
}

// Month selector functionality
function initializeMonthSelector() {
    const monthSelect = document.getElementById('monthSelect');
    if (!monthSelect) return;

    // Generate last 12 months
    const months = [];
    const today = new Date();

    for (let i = 0; i < 12; i++) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const yearMonth = date.toISOString().slice(0, 7);
        const year = date.getFullYear();
        const month = date.getMonth();
        const thaiYear = year + 543; // Convert to Buddhist calendar

        months.push({
            value: yearMonth,
            label: `${thaiMonths[month]} ${thaiYear}`
        });
    }

    // Populate month selector
    monthSelect.innerHTML = months.map(m =>
        `<option value="${m.value}">${m.label}</option>`
    ).join('');

    // Set current month as selected
    monthSelect.value = currentMonth;

    // Add change event listener
    monthSelect.addEventListener('change', function() {
        currentMonth = this.value;
        updateDashboard();
    });
}

// Update dashboard with data
function updateDashboard() {
    // Get data for current store and month
    const data = mockData[currentStore]?.[currentMonth] || {
        newDevices: 0,
        usedDevices: 0,
        repair: 0,
        installment: 0,
        pawn: 0,
        income: 0,
        expense: 0
    };

    // Get real data from new devices database
    const realNewDevicesCount = newDevices ?
        newDevices.filter(d => d.store === currentStore && d.status === 'stock').length : 0;

    // Get real data from used devices database
    const realUsedDevicesCount = usedDevices ?
        usedDevices.filter(d => d.store === currentStore && d.status === 'stock').length : 0;

    // Calculate income breakdown from real data
    const currentYear = currentMonth.substring(0, 4);
    const currentMonthNum = currentMonth.substring(5, 7);

    // Income from new devices (sold in current month)
    let incomeNewDevices = 0;
    if (newDevices) {
        incomeNewDevices = newDevices
            .filter(d => d.store === currentStore && d.status === 'sold' && d.saleDate)
            .filter(d => {
                const saleDate = new Date(d.saleDate);
                return saleDate.getFullYear().toString() === currentYear &&
                       (saleDate.getMonth() + 1).toString().padStart(2, '0') === currentMonthNum;
            })
            .reduce((sum, d) => sum + (d.salePrice || 0), 0);
    }

    // Income from used devices (sold in current month)
    let incomeUsedDevices = 0;
    if (usedDevices) {
        incomeUsedDevices = usedDevices
            .filter(d => d.store === currentStore && d.status === 'sold' && d.saleDate)
            .filter(d => {
                const saleDate = new Date(d.saleDate);
                return saleDate.getFullYear().toString() === currentYear &&
                       (saleDate.getMonth() + 1).toString().padStart(2, '0') === currentMonthNum;
            })
            .reduce((sum, d) => sum + (d.salePrice || 0), 0);
    }

    // Income from installments (completed in current month)
    let incomeInstallment = 0;
    if (installmentDevices) {
        incomeInstallment = installmentDevices
            .filter(i => i.store === currentStore && i.status === 'completed' && i.completedDate)
            .filter(i => {
                const completedDate = new Date(i.completedDate);
                return completedDate.getFullYear().toString() === currentYear &&
                       (completedDate.getMonth() + 1).toString().padStart(2, '0') === currentMonthNum;
            })
            .reduce((sum, i) => sum + (i.salePrice || 0), 0);
    }

    // Income from pawn (returned in current month)
    let incomePawn = 0;
    if (pawnDevices) {
        incomePawn = pawnDevices
            .filter(p => p.store === currentStore && p.status === 'returned' && p.returnDate)
            .filter(p => {
                const returnDate = new Date(p.returnDate);
                return returnDate.getFullYear().toString() === currentYear &&
                       (returnDate.getMonth() + 1).toString().padStart(2, '0') === currentMonthNum;
            })
            .reduce((sum, p) => sum + ((p.pawnAmount || 0) + (p.interest || 0)), 0);
    }

    // Income from repairs (completed in current month)
    let incomeRepair = 0;
    if (repairDevices) {
        incomeRepair = repairDevices
            .filter(r => r.store === currentStore && r.status === 'completed' && r.completedDate)
            .filter(r => {
                const completedDate = new Date(r.completedDate);
                return completedDate.getFullYear().toString() === currentYear &&
                       (completedDate.getMonth() + 1).toString().padStart(2, '0') === currentMonthNum;
            })
            .reduce((sum, r) => sum + (r.repairCost || 0), 0);
    }

    // Calculate total income
    const totalIncomeAmount = incomeNewDevices + incomeUsedDevices + incomeInstallment + incomePawn + incomeRepair;

    // Update stat cards
    const statNewDevices = document.getElementById('statNewDevices');
    const statUsedDevices = document.getElementById('statUsedDevices');
    const statRepair = document.getElementById('statRepair');
    const statInstallment = document.getElementById('statInstallment');
    const statPawn = document.getElementById('statPawn');

    // Use real data for devices if available
    if (statNewDevices) statNewDevices.textContent = realNewDevicesCount || data.newDevices;
    if (statUsedDevices) statUsedDevices.textContent = realUsedDevicesCount || data.usedDevices;
    if (statRepair) statRepair.textContent = data.repair;
    if (statInstallment) statInstallment.textContent = data.installment;
    if (statPawn) statPawn.textContent = data.pawn;

    // Update income first (will update total income, expense, and profit later after calculating expenses)
    const totalIncome = document.getElementById('totalIncome');
    const totalExpense = document.getElementById('totalExpense');
    const netProfit = document.getElementById('netProfit');

    if (totalIncome) totalIncome.textContent = formatCurrency(totalIncomeAmount || data.income);

    // Update income breakdown
    const incomeNewDevicesEl = document.getElementById('incomeNewDevices');
    const incomeUsedDevicesEl = document.getElementById('incomeUsedDevices');
    const incomeInstallmentEl = document.getElementById('incomeInstallment');
    const incomePawnEl = document.getElementById('incomePawn');
    const incomeRepairEl = document.getElementById('incomeRepair');

    if (incomeNewDevicesEl) incomeNewDevicesEl.textContent = formatCurrency(incomeNewDevices);
    if (incomeUsedDevicesEl) incomeUsedDevicesEl.textContent = formatCurrency(incomeUsedDevices);
    if (incomeInstallmentEl) incomeInstallmentEl.textContent = formatCurrency(incomeInstallment);
    if (incomePawnEl) incomePawnEl.textContent = formatCurrency(incomePawn);
    if (incomeRepairEl) incomeRepairEl.textContent = formatCurrency(incomeRepair);

    // Calculate expense breakdown
    // Expense from new devices (purchase price of sold devices in current month)
    let expenseNewDevices = 0;
    if (newDevices) {
        expenseNewDevices = newDevices
            .filter(d => d.store === currentStore && d.status === 'sold' && d.saleDate)
            .filter(d => {
                const saleDate = new Date(d.saleDate);
                return saleDate.getFullYear().toString() === currentYear &&
                       (saleDate.getMonth() + 1).toString().padStart(2, '0') === currentMonthNum;
            })
            .reduce((sum, d) => sum + (d.purchasePrice || 0), 0);
    }

    // Expense from used devices (purchase price of sold devices in current month)
    let expenseUsedDevices = 0;
    if (usedDevices) {
        expenseUsedDevices = usedDevices
            .filter(d => d.store === currentStore && d.status === 'sold' && d.saleDate)
            .filter(d => {
                const saleDate = new Date(d.saleDate);
                return saleDate.getFullYear().toString() === currentYear &&
                       (saleDate.getMonth() + 1).toString().padStart(2, '0') === currentMonthNum;
            })
            .reduce((sum, d) => sum + (d.purchasePrice || 0), 0);
    }

    // Expense from installments (cost price of completed installments in current month)
    let expenseInstallment = 0;
    if (installmentDevices) {
        expenseInstallment = installmentDevices
            .filter(i => i.store === currentStore && i.status === 'completed' && i.completedDate)
            .filter(i => {
                const completedDate = new Date(i.completedDate);
                return completedDate.getFullYear().toString() === currentYear &&
                       (completedDate.getMonth() + 1).toString().padStart(2, '0') === currentMonthNum;
            })
            .reduce((sum, i) => sum + (i.costPrice || 0), 0);
    }

    // Expense from pawn (pawn amount given to customers in current month)
    let expensePawn = 0;
    if (pawnDevices) {
        expensePawn = pawnDevices
            .filter(p => p.store === currentStore && p.status === 'returned' && p.returnDate)
            .filter(p => {
                const returnDate = new Date(p.returnDate);
                return returnDate.getFullYear().toString() === currentYear &&
                       (returnDate.getMonth() + 1).toString().padStart(2, '0') === currentMonthNum;
            })
            .reduce((sum, p) => sum + (p.pawnAmount || 0), 0);
    }

    // Expense from accessories (cost price - not repair cost, but spare parts cost)
    let expenseAccessories = 0;
    // This would need accessories data with cost tracking

    // Calculate total expense
    const totalExpenseAmount = expenseNewDevices + expenseUsedDevices + expenseInstallment + expensePawn + expenseAccessories;

    // Update expense breakdown
    const expenseNewDevicesEl = document.getElementById('expenseNewDevices');
    const expenseUsedDevicesEl = document.getElementById('expenseUsedDevices');
    const expenseInstallmentEl = document.getElementById('expenseInstallment');
    const expensePawnEl = document.getElementById('expensePawn');
    const expenseAccessoriesEl = document.getElementById('expenseAccessories');

    if (expenseNewDevicesEl) expenseNewDevicesEl.textContent = formatCurrency(expenseNewDevices);
    if (expenseUsedDevicesEl) expenseUsedDevicesEl.textContent = formatCurrency(expenseUsedDevices);
    if (expenseInstallmentEl) expenseInstallmentEl.textContent = formatCurrency(expenseInstallment);
    if (expensePawnEl) expensePawnEl.textContent = formatCurrency(expensePawn);
    if (expenseAccessoriesEl) expenseAccessoriesEl.textContent = formatCurrency(expenseAccessories);

    // Calculate profit breakdown
    const profitNewDevices = incomeNewDevices - expenseNewDevices;
    const profitUsedDevices = incomeUsedDevices - expenseUsedDevices;
    const profitInstallment = incomeInstallment - expenseInstallment;
    const profitPawn = incomePawn - expensePawn;
    const profitRepair = incomeRepair; // No expense calculation for repair yet

    // Update profit breakdown
    const profitNewDevicesEl = document.getElementById('profitNewDevices');
    const profitUsedDevicesEl = document.getElementById('profitUsedDevices');
    const profitInstallmentEl = document.getElementById('profitInstallment');
    const profitPawnEl = document.getElementById('profitPawn');
    const profitRepairEl = document.getElementById('profitRepair');

    if (profitNewDevicesEl) {
        profitNewDevicesEl.textContent = formatCurrency(profitNewDevices);
        profitNewDevicesEl.parentElement.parentElement.classList.toggle('negative', profitNewDevices < 0);
    }
    if (profitUsedDevicesEl) {
        profitUsedDevicesEl.textContent = formatCurrency(profitUsedDevices);
        profitUsedDevicesEl.parentElement.parentElement.classList.toggle('negative', profitUsedDevices < 0);
    }
    if (profitInstallmentEl) {
        profitInstallmentEl.textContent = formatCurrency(profitInstallment);
        profitInstallmentEl.parentElement.parentElement.classList.toggle('negative', profitInstallment < 0);
    }
    if (profitPawnEl) {
        profitPawnEl.textContent = formatCurrency(profitPawn);
        profitPawnEl.parentElement.parentElement.classList.toggle('negative', profitPawn < 0);
    }
    if (profitRepairEl) {
        profitRepairEl.textContent = formatCurrency(profitRepair);
        profitRepairEl.parentElement.parentElement.classList.toggle('negative', profitRepair < 0);
    }

    // Update total expense with calculated value
    if (totalExpense) totalExpense.textContent = formatCurrency(totalExpenseAmount || data.expense);

    // Recalculate net profit with real data
    if (netProfit) {
        const profit = (totalIncomeAmount || data.income) - (totalExpenseAmount || data.expense);
        netProfit.textContent = formatCurrency(profit);

        // Change color based on profit/loss
        netProfit.classList.remove('income', 'expense', 'profit');
        if (profit > 0) {
            netProfit.classList.add('profit');
        } else if (profit < 0) {
            netProfit.classList.add('expense');
        }
    }

    // Animate numbers
    animateStats();
}

// Format currency
function formatCurrency(amount) {
    return '฿' + amount.toLocaleString('th-TH');
}

// Animate stat numbers
function animateStats() {
    const statValues = document.querySelectorAll('.stat-value, .summary-amount, .income-breakdown-amount, .expense-breakdown-amount, .profit-breakdown-amount');
    statValues.forEach(stat => {
        stat.style.animation = 'none';
        setTimeout(() => {
            stat.style.animation = 'fadeIn 0.5s ease';
        }, 10);
    });
}

// Navigate to page from dashboard
function navigateToPage(pageName) {
    // Remove active class from all nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    // Find and activate the target nav item
    const targetNavItem = document.querySelector(`.nav-item[data-page="${pageName}"]`);
    if (targetNavItem) {
        targetNavItem.classList.add('active');
    }

    // Hide all pages
    const allPages = document.querySelectorAll('.page-content');
    allPages.forEach(p => p.classList.remove('active'));

    // Show selected page
    const selectedPage = document.getElementById(pageName);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }

    // Update page title
    const pageTitle = document.getElementById('pageTitle');
    pageTitle.textContent = pageTitles[pageName] || 'ระบบจัดการร้านมือถือ';

    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show notification when store changes
function showStoreChangeNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = `เปลี่ยนเป็น ${stores[currentStore]} แล้ว`;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== NEW DEVICES MANAGEMENT =====

// Mock database for new devices
const newDevicesMockData = [
    // ร้านศาลายา - สต๊อก
    {
        id: '1001',
        brand: 'Apple',
        model: 'iPhone 15 Pro Max',
        color: 'Titanium Natural',
        imei: '358234567891234',
        ram: '8',
        rom: '256',
        purchasePrice: 42000,
        importDate: '2025-10-01',
        salePrice: 46900,
        saleDate: null,
        status: 'stock',
        note: '',
        store: 'salaya',
        createdAt: '2025-10-01T10:00:00Z'
    },
    {
        id: '1002',
        brand: 'Samsung',
        model: 'Galaxy S24 Ultra',
        color: 'Titanium Gray',
        imei: '358234567891235',
        ram: '12',
        rom: '512',
        purchasePrice: 38000,
        importDate: '2025-09-28',
        salePrice: 42900,
        saleDate: null,
        status: 'stock',
        note: '',
        store: 'salaya',
        createdAt: '2025-09-28T14:30:00Z'
    },
    {
        id: '1003',
        brand: 'Xiaomi',
        model: '14 Pro',
        color: 'Black',
        imei: '358234567891236',
        ram: '12',
        rom: '256',
        purchasePrice: 22000,
        importDate: '2025-10-03',
        salePrice: 24900,
        saleDate: null,
        status: 'stock',
        note: '',
        store: 'salaya',
        createdAt: '2025-10-03T09:15:00Z'
    },
    {
        id: '1004',
        brand: 'OPPO',
        model: 'Find X7 Pro',
        color: 'Ocean Blue',
        imei: '358234567891237',
        ram: '16',
        rom: '512',
        purchasePrice: 28000,
        importDate: '2025-09-30',
        salePrice: 31900,
        saleDate: null,
        status: 'stock',
        note: '',
        store: 'salaya',
        createdAt: '2025-09-30T11:20:00Z'
    },
    {
        id: '1005',
        brand: 'Vivo',
        model: 'X100 Pro',
        color: 'Asteroid Black',
        imei: '358234567891238',
        ram: '12',
        rom: '256',
        purchasePrice: 24000,
        importDate: '2025-10-02',
        salePrice: 27500,
        saleDate: null,
        status: 'stock',
        note: '',
        store: 'salaya',
        createdAt: '2025-10-02T13:45:00Z'
    },

    // ร้านศาลายา - ขายแล้ว
    {
        id: '1006',
        brand: 'Apple',
        model: 'iPhone 15',
        color: 'Pink',
        imei: '358234567891239',
        ram: '6',
        rom: '128',
        purchasePrice: 28000,
        importDate: '2025-09-15',
        salePrice: 32900,
        saleDate: '2025-09-20',
        status: 'sold',
        note: '',
        store: 'salaya',
        createdAt: '2025-09-15T10:00:00Z'
    },
    {
        id: '1007',
        brand: 'Samsung',
        model: 'Galaxy A54',
        color: 'Awesome Violet',
        imei: '358234567891240',
        ram: '8',
        rom: '256',
        purchasePrice: 11000,
        importDate: '2025-09-18',
        salePrice: 13900,
        saleDate: '2025-09-25',
        status: 'sold',
        note: '',
        store: 'salaya',
        createdAt: '2025-09-18T14:30:00Z'
    },
    {
        id: '1008',
        brand: 'Xiaomi',
        model: 'Redmi Note 13 Pro',
        color: 'Midnight Black',
        imei: '358234567891241',
        ram: '8',
        rom: '256',
        purchasePrice: 8500,
        importDate: '2025-09-10',
        salePrice: 10900,
        saleDate: '2025-09-22',
        status: 'sold',
        note: '',
        store: 'salaya',
        createdAt: '2025-09-10T09:00:00Z'
    },
    {
        id: '1009',
        brand: 'OPPO',
        model: 'Reno11 Pro',
        color: 'Rock Grey',
        imei: '358234567891242',
        ram: '12',
        rom: '512',
        purchasePrice: 16000,
        importDate: '2025-09-12',
        salePrice: 18900,
        saleDate: '2025-09-28',
        status: 'sold',
        note: '',
        store: 'salaya',
        createdAt: '2025-09-12T11:30:00Z'
    },
    {
        id: '1010',
        brand: 'Realme',
        model: 'GT 5 Pro',
        color: 'Mars Orange',
        imei: '358234567891243',
        ram: '12',
        rom: '256',
        purchasePrice: 18000,
        importDate: '2025-09-08',
        salePrice: 20900,
        saleDate: '2025-09-19',
        status: 'sold',
        note: '',
        store: 'salaya',
        createdAt: '2025-09-08T15:20:00Z'
    },

    // ร้านศาลายา - ตัดออก
    {
        id: '1011',
        brand: 'Samsung',
        model: 'Galaxy Z Flip5',
        color: 'Mint',
        imei: '358234567891244',
        ram: '8',
        rom: '256',
        purchasePrice: 28000,
        importDate: '2025-08-20',
        saleDate: '2025-09-15',
        salePrice: 0,
        status: 'removed',
        note: 'หน้าจอแตก ซ่อมแล้วไม่คุ้ม',
        store: 'salaya',
        createdAt: '2025-08-20T10:00:00Z'
    },
    {
        id: '1012',
        brand: 'Vivo',
        model: 'V29',
        color: 'Noble Black',
        imei: '358234567891245',
        ram: '12',
        rom: '256',
        purchasePrice: 12000,
        importDate: '2025-08-25',
        saleDate: '2025-09-10',
        salePrice: 0,
        status: 'removed',
        note: 'เมนบอร์ดเสีย',
        store: 'salaya',
        createdAt: '2025-08-25T13:00:00Z'
    },

    // ร้านคลองโยง - สต๊อก
    {
        id: '2001',
        brand: 'Apple',
        model: 'iPhone 14 Pro',
        color: 'Deep Purple',
        imei: '358234567892001',
        ram: '6',
        rom: '256',
        purchasePrice: 32000,
        importDate: '2025-10-01',
        salePrice: 36900,
        saleDate: null,
        status: 'stock',
        note: '',
        store: 'klongyong',
        createdAt: '2025-10-01T10:00:00Z'
    },
    {
        id: '2002',
        brand: 'Samsung',
        model: 'Galaxy S23 FE',
        color: 'Purple',
        imei: '358234567892002',
        ram: '8',
        rom: '256',
        purchasePrice: 16000,
        importDate: '2025-09-29',
        salePrice: 18900,
        saleDate: null,
        status: 'stock',
        note: '',
        store: 'klongyong',
        createdAt: '2025-09-29T11:30:00Z'
    },
    {
        id: '2003',
        brand: 'Xiaomi',
        model: 'Redmi Note 12 Pro',
        color: 'Sky Blue',
        imei: '358234567892003',
        ram: '8',
        rom: '128',
        purchasePrice: 7500,
        importDate: '2025-10-02',
        salePrice: 9900,
        saleDate: null,
        status: 'stock',
        note: '',
        store: 'klongyong',
        createdAt: '2025-10-02T14:00:00Z'
    },
    {
        id: '2004',
        brand: 'OnePlus',
        model: '12',
        color: 'Flowy Emerald',
        imei: '358234567892004',
        ram: '16',
        rom: '512',
        purchasePrice: 26000,
        importDate: '2025-09-28',
        salePrice: 29900,
        saleDate: null,
        status: 'stock',
        note: '',
        store: 'klongyong',
        createdAt: '2025-09-28T09:45:00Z'
    },

    // ร้านคลองโยง - ขายแล้ว
    {
        id: '2005',
        brand: 'Apple',
        model: 'iPhone 13',
        color: 'Starlight',
        imei: '358234567892005',
        ram: '4',
        rom: '128',
        purchasePrice: 18000,
        importDate: '2025-09-10',
        salePrice: 21900,
        saleDate: '2025-09-18',
        status: 'sold',
        note: '',
        store: 'klongyong',
        createdAt: '2025-09-10T10:00:00Z'
    },
    {
        id: '2006',
        brand: 'Samsung',
        model: 'Galaxy A34',
        color: 'Awesome Lime',
        imei: '358234567892006',
        ram: '8',
        rom: '128',
        purchasePrice: 8500,
        importDate: '2025-09-15',
        salePrice: 10900,
        saleDate: '2025-09-23',
        status: 'sold',
        note: '',
        store: 'klongyong',
        createdAt: '2025-09-15T13:20:00Z'
    },
    {
        id: '2007',
        brand: 'Realme',
        model: '11 Pro+',
        color: 'Sunrise Beige',
        imei: '358234567892007',
        ram: '12',
        rom: '256',
        purchasePrice: 12000,
        importDate: '2025-09-12',
        salePrice: 14500,
        saleDate: '2025-09-26',
        status: 'sold',
        note: '',
        store: 'klongyong',
        createdAt: '2025-09-12T11:00:00Z'
    },

    // ร้านคลองโยง - ตัดออก
    {
        id: '2008',
        brand: 'Xiaomi',
        model: 'POCO F5',
        color: 'Snowstorm White',
        imei: '358234567892008',
        ram: '12',
        rom: '256',
        purchasePrice: 10000,
        importDate: '2025-08-15',
        saleDate: '2025-09-05',
        salePrice: 0,
        status: 'removed',
        note: 'แบตเตอรี่บวม',
        store: 'klongyong',
        createdAt: '2025-08-15T14:30:00Z'
    }
];

// Data storage (ใช้ LocalStorage)
let newDevices = [];

// Initialize database
function initializeNewDevicesDatabase() {
    const storedData = localStorage.getItem('newDevices');

    if (!storedData) {
        // ถ้ายังไม่มีข้อมูลใน localStorage ให้ใช้ mock data
        newDevices = [...newDevicesMockData];
        localStorage.setItem('newDevices', JSON.stringify(newDevices));
        console.log('✅ เริ่มต้นฐานข้อมูลเครื่องใหม่สำเร็จ');
        console.log(`📊 มีข้อมูลทั้งหมด ${newDevices.length} รายการ`);
    } else {
        newDevices = JSON.parse(storedData);
        console.log('✅ โหลดข้อมูลจาก localStorage สำเร็จ');
        console.log(`📊 มีข้อมูลทั้งหมด ${newDevices.length} รายการ`);
    }
}

let currentEditId = null;

// ===== USED DEVICES DATABASE =====

// Mock database for used devices
const usedDevicesMockData = [
    // ร้านศาลายา - สต๊อก
    {
        id: 'U1001',
        brand: 'Apple',
        model: 'iPhone 12 Pro',
        color: 'Pacific Blue',
        imei: '358234567893001',
        ram: '6',
        rom: '128',
        purchasePrice: 15000,
        purchaseDate: '2025-10-02',
        salePrice: 18900,
        saleDate: null,
        condition: 'excellent',
        status: 'stock',
        note: '',
        store: 'salaya',
        createdAt: '2025-10-02T10:00:00Z'
    },
    {
        id: 'U1002',
        brand: 'Samsung',
        model: 'Galaxy S21 Ultra',
        color: 'Phantom Black',
        imei: '358234567893002',
        ram: '12',
        rom: '256',
        purchasePrice: 12000,
        purchaseDate: '2025-09-28',
        salePrice: 15900,
        saleDate: null,
        condition: 'good',
        status: 'stock',
        note: '',
        store: 'salaya',
        createdAt: '2025-09-28T11:30:00Z'
    },
    {
        id: 'U1003',
        brand: 'Xiaomi',
        model: 'Mi 11',
        color: 'Horizon Blue',
        imei: '358234567893003',
        ram: '8',
        rom: '256',
        purchasePrice: 6500,
        purchaseDate: '2025-10-01',
        salePrice: 8900,
        saleDate: null,
        condition: 'good',
        status: 'stock',
        note: '',
        store: 'salaya',
        createdAt: '2025-10-01T14:00:00Z'
    },
    {
        id: 'U1004',
        brand: 'OPPO',
        model: 'Find X3 Pro',
        color: 'Gloss Black',
        imei: '358234567893004',
        ram: '12',
        rom: '256',
        purchasePrice: 8500,
        purchaseDate: '2025-09-30',
        salePrice: 11500,
        saleDate: null,
        condition: 'excellent',
        status: 'stock',
        note: '',
        store: 'salaya',
        createdAt: '2025-09-30T09:15:00Z'
    },

    // ร้านศาลายา - ขายแล้ว
    {
        id: 'U1005',
        brand: 'Apple',
        model: 'iPhone 11',
        color: 'Green',
        imei: '358234567893005',
        ram: '4',
        rom: '128',
        purchasePrice: 9000,
        purchaseDate: '2025-09-15',
        salePrice: 12900,
        saleDate: '2025-09-22',
        condition: 'good',
        status: 'sold',
        note: '',
        store: 'salaya',
        createdAt: '2025-09-15T10:30:00Z'
    },
    {
        id: 'U1006',
        brand: 'Samsung',
        model: 'Galaxy Note 20',
        color: 'Mystic Bronze',
        imei: '358234567893006',
        ram: '8',
        rom: '256',
        purchasePrice: 8500,
        purchaseDate: '2025-09-12',
        salePrice: 11500,
        saleDate: '2025-09-25',
        condition: 'good',
        status: 'sold',
        note: '',
        store: 'salaya',
        createdAt: '2025-09-12T13:20:00Z'
    },
    {
        id: 'U1007',
        brand: 'Vivo',
        model: 'V21',
        color: 'Sunset Dazzle',
        imei: '358234567893007',
        ram: '8',
        rom: '128',
        purchasePrice: 4500,
        purchaseDate: '2025-09-18',
        salePrice: 6500,
        saleDate: '2025-09-28',
        condition: 'fair',
        status: 'sold',
        note: '',
        store: 'salaya',
        createdAt: '2025-09-18T15:00:00Z'
    },

    // ร้านศาลายา - ตัดออก
    {
        id: 'U1008',
        brand: 'Xiaomi',
        model: 'Redmi Note 10 Pro',
        color: 'Onyx Gray',
        imei: '358234567893008',
        ram: '8',
        rom: '128',
        purchasePrice: 5000,
        purchaseDate: '2025-08-20',
        salePrice: 0,
        saleDate: '2025-09-10',
        condition: 'poor',
        status: 'removed',
        note: 'หน้าจอแตก ค่าซ่อมสูงกว่ามูลค่า',
        store: 'salaya',
        createdAt: '2025-08-20T11:00:00Z'
    },

    // ร้านคลองโยง - สต๊อก
    {
        id: 'U2001',
        brand: 'Apple',
        model: 'iPhone XR',
        color: 'Black',
        imei: '358234567893101',
        ram: '3',
        rom: '64',
        purchasePrice: 6500,
        purchaseDate: '2025-09-30',
        salePrice: 8900,
        saleDate: null,
        condition: 'good',
        status: 'stock',
        note: '',
        store: 'klongyong',
        createdAt: '2025-09-30T10:00:00Z'
    },
    {
        id: 'U2002',
        brand: 'Samsung',
        model: 'Galaxy A52',
        color: 'Awesome Blue',
        imei: '358234567893102',
        ram: '8',
        rom: '128',
        purchasePrice: 5500,
        purchaseDate: '2025-10-01',
        salePrice: 7500,
        saleDate: null,
        condition: 'excellent',
        status: 'stock',
        note: '',
        store: 'klongyong',
        createdAt: '2025-10-01T14:20:00Z'
    },
    {
        id: 'U2003',
        brand: 'Realme',
        model: '8 Pro',
        color: 'Infinite Blue',
        imei: '358234567893103',
        ram: '8',
        rom: '128',
        purchasePrice: 3500,
        purchaseDate: '2025-09-28',
        salePrice: 5200,
        saleDate: null,
        condition: 'good',
        status: 'stock',
        note: '',
        store: 'klongyong',
        createdAt: '2025-09-28T11:00:00Z'
    },

    // ร้านคลองโยง - ขายแล้ว
    {
        id: 'U2004',
        brand: 'Apple',
        model: 'iPhone SE (2020)',
        color: 'White',
        imei: '358234567893104',
        ram: '3',
        rom: '64',
        purchasePrice: 5500,
        purchaseDate: '2025-09-15',
        salePrice: 7500,
        saleDate: '2025-09-23',
        condition: 'good',
        status: 'sold',
        note: '',
        store: 'klongyong',
        createdAt: '2025-09-15T09:30:00Z'
    },
    {
        id: 'U2005',
        brand: 'OPPO',
        model: 'Reno6',
        color: 'Aurora',
        imei: '358234567893105',
        ram: '8',
        rom: '128',
        purchasePrice: 4000,
        purchaseDate: '2025-09-20',
        salePrice: 5900,
        saleDate: '2025-09-27',
        condition: 'good',
        status: 'sold',
        note: '',
        store: 'klongyong',
        createdAt: '2025-09-20T13:45:00Z'
    },

    // ร้านคลองโยง - ตัดออก
    {
        id: 'U2006',
        brand: 'Vivo',
        model: 'Y20',
        color: 'Obsidian Black',
        imei: '358234567893106',
        ram: '4',
        rom: '64',
        purchasePrice: 2500,
        purchaseDate: '2025-08-25',
        salePrice: 0,
        saleDate: '2025-09-08',
        condition: 'poor',
        status: 'removed',
        note: 'ไม่เปิดเครื่อง IC เสีย',
        store: 'klongyong',
        createdAt: '2025-08-25T10:30:00Z'
    }
];

// Data storage for used devices
let usedDevices = [];

// Initialize used devices database
function initializeUsedDevicesDatabase() {
    const storedData = localStorage.getItem('usedDevices');

    if (!storedData) {
        usedDevices = [...usedDevicesMockData];
        localStorage.setItem('usedDevices', JSON.stringify(usedDevices));
        console.log('✅ เริ่มต้นฐานข้อมูลเครื่องมือสองสำเร็จ');
        console.log(`📊 มีข้อมูลทั้งหมด ${usedDevices.length} รายการ`);
    } else {
        usedDevices = JSON.parse(storedData);
        console.log('✅ โหลดข้อมูลเครื่องมือสองจาก localStorage สำเร็จ');
        console.log(`📊 มีข้อมูลทั้งหมด ${usedDevices.length} รายการ`);
    }
}

let currentUsedEditId = null;

// ===== USED DEVICES CRUD FUNCTIONS =====

// Initialize used devices tabs
function initializeUsedTabs() {
    const tabButtons = document.querySelectorAll('#used-devices .tab-btn');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');

            // Remove active class from all used devices tabs and contents
            document.querySelectorAll('#used-devices .tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('#used-devices .tab-content').forEach(content => content.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(tabName + '-tab').classList.add('active');
        });
    });
}

// Open used device modal
function openUsedDeviceModal(deviceId = null) {
    const modal = document.getElementById('usedDeviceModal');
    const modalTitle = document.getElementById('usedModalTitle');
    const form = document.getElementById('usedDeviceForm');

    // Reset form
    form.reset();
    currentUsedEditId = deviceId;

    if (deviceId) {
        // Edit mode
        modalTitle.textContent = 'แก้ไขข้อมูลเครื่องมือสอง';
        const device = usedDevices.find(d => d.id === deviceId);

        if (device) {
            document.getElementById('usedDeviceId').value = device.id;
            document.getElementById('usedBrand').value = device.brand;
            document.getElementById('usedModel').value = device.model;
            document.getElementById('usedColor').value = device.color;
            document.getElementById('usedImei').value = device.imei;
            document.getElementById('usedRam').value = device.ram;
            document.getElementById('usedRom').value = device.rom;
            document.getElementById('usedPurchasePrice').value = device.purchasePrice;
            document.getElementById('usedPurchaseDate').value = device.purchaseDate;
            document.getElementById('usedSalePrice').value = device.salePrice;
            document.getElementById('usedSaleDate').value = device.saleDate || '';
            document.getElementById('usedCondition').value = device.condition;
            document.getElementById('usedStatus').value = device.status;
            document.getElementById('usedNote').value = device.note || '';

            toggleUsedSaleDateField();
        }
    } else {
        // Add mode
        modalTitle.textContent = 'เพิ่มเครื่องมือสอง';
        // Set default purchase date to today
        document.getElementById('usedPurchaseDate').value = new Date().toISOString().split('T')[0];
    }

    modal.classList.add('show');
}

// Close used device modal
function closeUsedDeviceModal() {
    const modal = document.getElementById('usedDeviceModal');
    modal.classList.remove('show');
    currentUsedEditId = null;
}

// Toggle sale date field based on status for used devices
function toggleUsedSaleDateField() {
    const status = document.getElementById('usedStatus').value;
    const noteGroup = document.getElementById('usedNoteGroup');

    if (status === 'removed') {
        noteGroup.style.display = 'flex';
    } else {
        noteGroup.style.display = 'none';
    }
}

// Save used device
function saveUsedDevice(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const device = {
        id: currentUsedEditId || ('U' + Date.now().toString()),
        brand: formData.get('brand'),
        model: formData.get('model'),
        color: formData.get('color'),
        imei: formData.get('imei'),
        ram: formData.get('ram'),
        rom: formData.get('rom'),
        purchasePrice: parseFloat(formData.get('purchasePrice')),
        purchaseDate: formData.get('purchaseDate'),
        salePrice: parseFloat(formData.get('salePrice')),
        saleDate: formData.get('saleDate') || null,
        condition: formData.get('condition'),
        status: formData.get('status'),
        note: formData.get('note') || '',
        store: currentStore,
        createdAt: currentUsedEditId ? usedDevices.find(d => d.id === currentUsedEditId).createdAt : new Date().toISOString()
    };

    if (currentUsedEditId) {
        // Update existing device
        const index = usedDevices.findIndex(d => d.id === currentUsedEditId);
        usedDevices[index] = device;
    } else {
        // Add new device
        usedDevices.push(device);
    }

    // Save to localStorage
    localStorage.setItem('usedDevices', JSON.stringify(usedDevices));

    // Reload data
    loadUsedDevicesData();

    // Close modal
    closeUsedDeviceModal();

    // Show success message
    showNotification(currentUsedEditId ? 'บันทึกข้อมูลสำเร็จ' : 'เพิ่มเครื่องมือสองสำเร็จ');
}

// Load and display used devices data
function loadUsedDevicesData() {
    // Apply current filter (which will show current month by default)
    applyUsedDevicesFilter();
    
    // Update tab counts
    updateUsedDevicesTabCounts();

    // Update dashboard stats
    updateDashboard();
}

// Update new devices tab counts
function updateNewDevicesTabCounts() {
    const storeDevices = newDevices.filter(d => d.store === currentStore);
    
    // Get current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    
    // Filter devices for current month
    const currentMonthDevices = storeDevices.filter(device => {
        const deviceDate = new Date(device.importDate);
        return deviceDate.getMonth() + 1 === currentMonth && deviceDate.getFullYear() === currentYear;
    });
    
    // Count devices by status for current month
    const stockCount = currentMonthDevices.filter(d => d.status === 'stock').length;
    const soldCount = currentMonthDevices.filter(d => d.status === 'sold').length;
    const removedCount = currentMonthDevices.filter(d => d.status === 'removed').length;
    
    // Update tab counts
    const stockCountElement = document.getElementById('newStockCount');
    const soldCountElement = document.getElementById('newSoldCount');
    const removedCountElement = document.getElementById('newRemovedCount');
    
    if (stockCountElement) stockCountElement.textContent = stockCount;
    if (soldCountElement) soldCountElement.textContent = soldCount;
    if (removedCountElement) removedCountElement.textContent = removedCount;
}

// Update used devices tab counts
function updateUsedDevicesTabCounts() {
    const storeDevices = usedDevices.filter(d => d.store === currentStore);
    
    // Get current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    
    // Filter devices for current month
    const currentMonthDevices = storeDevices.filter(device => {
        const deviceDate = new Date(device.purchaseDate);
        return deviceDate.getMonth() + 1 === currentMonth && deviceDate.getFullYear() === currentYear;
    });
    
    // Count devices by status for current month
    const stockCount = currentMonthDevices.filter(d => d.status === 'stock').length;
    const soldCount = currentMonthDevices.filter(d => d.status === 'sold').length;
    const removedCount = currentMonthDevices.filter(d => d.status === 'removed').length;
    
    // Update tab counts
    const stockCountElement = document.getElementById('usedStockCount');
    const soldCountElement = document.getElementById('usedSoldCount');
    const removedCountElement = document.getElementById('usedRemovedCount');
    
    if (stockCountElement) stockCountElement.textContent = stockCount;
    if (soldCountElement) soldCountElement.textContent = soldCount;
    if (removedCountElement) removedCountElement.textContent = removedCount;
}

// Display used devices in table
function displayUsedDevices(devices, tableBodyId, type) {
    const tbody = document.getElementById(tableBodyId);

    if (!tbody) return;

    if (devices.length === 0) {
        const colspan = type === 'stock' ? '10' : '11';
        tbody.innerHTML = `<tr><td colspan="${colspan}" class="empty-state">ไม่มีข้อมูล</td></tr>`;
        return;
    }

    // Condition labels in Thai
    const conditionLabels = {
        excellent: 'ดีมาก',
        good: 'ดี',
        fair: 'ใช้งานได้',
        poor: 'ปานกลาง'
    };

    tbody.innerHTML = devices.map(device => {
        if (type === 'stock') {
            return `
                <tr>
                    <td>${device.brand}</td>
                    <td>${device.model}</td>
                    <td>${device.color}</td>
                    <td>${device.imei}</td>
                    <td>${device.ram}/${device.rom} GB</td>
                    <td>${conditionLabels[device.condition]}</td>
                    <td>${formatCurrency(device.purchasePrice)}</td>
                    <td>${formatDate(device.purchaseDate)}</td>
                    <td>${formatCurrency(device.salePrice)}</td>
                    <td>
                        <button class="action-btn btn-edit" onclick="openUsedDeviceModal('${device.id}')">แก้ไข</button>
                        <button class="action-btn btn-sell" onclick="markUsedAsSold('${device.id}')">ขาย</button>
                        <button class="action-btn btn-remove" onclick="markUsedAsRemoved('${device.id}')">ตัด</button>
                        <button class="action-btn btn-delete" onclick="deleteUsedDevice('${device.id}')">ลบ</button>
                    </td>
                </tr>
            `;
        } else if (type === 'sold') {
            const profit = device.salePrice - device.purchasePrice;
            const profitColor = profit >= 0 ? '#10b981' : '#ef4444';
            return `
                <tr>
                    <td>${device.brand}</td>
                    <td>${device.model}</td>
                    <td>${device.color}</td>
                    <td>${device.imei}</td>
                    <td>${device.ram}/${device.rom} GB</td>
                    <td>${conditionLabels[device.condition]}</td>
                    <td>${formatCurrency(device.purchasePrice)}</td>
                    <td>${formatCurrency(device.salePrice)}</td>
                    <td>${formatDate(device.saleDate)}</td>
                    <td style="color: ${profitColor}; font-weight: 600;">${formatCurrency(profit)}</td>
                    <td>
                        <button class="action-btn btn-edit" onclick="openUsedDeviceModal('${device.id}')">แก้ไข</button>
                        <button class="action-btn btn-delete" onclick="deleteUsedDevice('${device.id}')">ลบ</button>
                    </td>
                </tr>
            `;
        } else {
            return `
                <tr>
                    <td>${device.brand}</td>
                    <td>${device.model}</td>
                    <td>${device.color}</td>
                    <td>${device.imei}</td>
                    <td>${device.ram}/${device.rom} GB</td>
                    <td>${conditionLabels[device.condition]}</td>
                    <td>${formatCurrency(device.purchasePrice)}</td>
                    <td>${formatDate(device.purchaseDate)}</td>
                    <td>${formatDate(device.saleDate)}</td>
                    <td>${device.note}</td>
                    <td>
                        <button class="action-btn btn-edit" onclick="openUsedDeviceModal('${device.id}')">แก้ไข</button>
                        <button class="action-btn btn-delete" onclick="deleteUsedDevice('${device.id}')">ลบ</button>
                    </td>
                </tr>
            `;
        }
    }).join('');
}

// Mark used device as sold
function markUsedAsSold(deviceId) {
    if (confirm('ต้องการบันทึกการขายเครื่องนี้หรือไม่?')) {
        const device = usedDevices.find(d => d.id === deviceId);
        if (device) {
            device.status = 'sold';
            device.saleDate = new Date().toISOString().split('T')[0];
            localStorage.setItem('usedDevices', JSON.stringify(usedDevices));
            loadUsedDevicesData();
            showNotification('บันทึกการขายสำเร็จ');
        }
    }
}

// Mark used device as removed
function markUsedAsRemoved(deviceId) {
    const device = usedDevices.find(d => d.id === deviceId);
    if (!device) return;

    // Ask for removal type
    const choice = confirm('กดตกลงเพื่อ "ตัดขายให้เจ้าอื่น"\nกดยกเลิกเพื่อ "ตัดสลับในร้านตัวเอง"');

    if (choice) {
        // ตัดขายให้เจ้าอื่น
        const note = prompt('กรุณาระบุเหตุผลในการตัดขายให้เจ้าอื่น:');
        if (note !== null) {
            device.status = 'removed';
            device.saleDate = new Date().toISOString().split('T')[0];
            device.note = note;
            localStorage.setItem('usedDevices', JSON.stringify(usedDevices));
            loadUsedDevicesData();
            showNotification('ตัดออกสำเร็จ');
        }
    } else {
        // ตัดสลับในร้านตัวเอง
        const otherStore = device.store === 'salaya' ? 'klongyong' : 'salaya';
        const otherStoreName = stores[otherStore];

        if (confirm(`ต้องการย้ายเครื่องนี้ไปยัง ${otherStoreName} ใช่หรือไม่?`)) {
            device.store = otherStore;
            localStorage.setItem('usedDevices', JSON.stringify(usedDevices));
            loadUsedDevicesData();
            showNotification(`ย้ายเครื่องไปยัง ${otherStoreName} สำเร็จ`);
        }
    }
}

// Delete used device
function deleteUsedDevice(deviceId) {
    if (confirm('ต้องการลบข้อมูลนี้หรือไม่? (ไม่สามารถกู้คืนได้)')) {
        usedDevices = usedDevices.filter(d => d.id !== deviceId);
        localStorage.setItem('usedDevices', JSON.stringify(usedDevices));
        loadUsedDevicesData();
        showNotification('ลบข้อมูลสำเร็จ');
    }
}

// Initialize used devices search
function initializeUsedSearch() {
    const searchInput = document.getElementById('searchUsedDevices');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            applyUsedDevicesFilter();
        });
    }
}

// Filter used devices based on search term
function filterUsedDevices(searchTerm) {
    applyUsedDevicesFilter();
}

// Close used device modal when clicking outside
window.addEventListener('click', function(event) {
    const usedModal = document.getElementById('usedDeviceModal');
    if (event.target === usedModal) {
        closeUsedDeviceModal();
    }
});

// ===== USED DEVICES DATABASE MANAGEMENT FUNCTIONS =====

// Reset used devices database to initial state
function resetUsedDevicesDatabase() {
    if (confirm('⚠️ คุณต้องการรีเซ็ตฐานข้อมูลกลับไปเป็นข้อมูลเริ่มต้นหรือไม่?\n\nข้อมูลปัจจุบันทั้งหมดจะถูกลบ')) {
        usedDevices = [...usedDevicesMockData];
        localStorage.setItem('usedDevices', JSON.stringify(usedDevices));
        loadUsedDevicesData();
        showNotification('รีเซ็ตฐานข้อมูลสำเร็จ');
        console.log('✅ รีเซ็ตฐานข้อมูลเครื่องมือสองสำเร็จ');
        console.log(`📊 มีข้อมูลทั้งหมด ${usedDevices.length} รายการ`);
    }
}

// Clear all used devices data
function clearUsedDevicesDatabase() {
    if (confirm('⚠️ คุณต้องการลบข้อมูลทั้งหมดหรือไม่?\n\nการกระทำนี้ไม่สามารถย้อนกลับได้')) {
        usedDevices = [];
        localStorage.setItem('usedDevices', JSON.stringify(usedDevices));
        loadUsedDevicesData();
        showNotification('ลบข้อมูลทั้งหมดสำเร็จ');
        console.log('🗑️ ลบข้อมูลเครื่องมือสองทั้งหมดแล้ว');
    }
}

// Export used devices database to JSON file
function exportUsedDevicesDatabase() {
    const dataStr = JSON.stringify(usedDevices, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `used-devices-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('ส่งออกข้อมูลสำเร็จ');
}

// Import used devices database from JSON file
function importUsedDevicesDatabase(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (confirm(`พบข้อมูล ${importedData.length} รายการ\n\nต้องการนำเข้าข้อมูลนี้หรือไม่?`)) {
                usedDevices = importedData;
                localStorage.setItem('usedDevices', JSON.stringify(usedDevices));
                loadUsedDevicesData();
                showNotification('นำเข้าข้อมูลสำเร็จ');
                console.log('✅ นำเข้าข้อมูลเครื่องมือสองสำเร็จ');
                console.log(`📊 มีข้อมูลทั้งหมด ${usedDevices.length} รายการ`);
            }
        } catch (error) {
            alert('❌ ไฟล์ไม่ถูกต้อง กรุณาเลือกไฟล์ JSON ที่ถูกต้อง');
            console.error('Import error:', error);
        }
    };
    reader.readAsText(file);
}

// Show used devices database statistics in console
function showUsedDatabaseStats() {
    console.log('📊 สถิติฐานข้อมูลเครื่องมือสอง');
    console.log('─────────────────────────────');

    const salayaDevices = usedDevices.filter(d => d.store === 'salaya');
    const klongyongDevices = usedDevices.filter(d => d.store === 'klongyong');

    console.log(`📍 ร้านศาลายา: ${salayaDevices.length} รายการ`);
    console.log(`   - สต๊อก: ${salayaDevices.filter(d => d.status === 'stock').length}`);
    console.log(`   - ขายแล้ว: ${salayaDevices.filter(d => d.status === 'sold').length}`);
    console.log(`   - ตัดออก: ${salayaDevices.filter(d => d.status === 'removed').length}`);

    console.log(`📍 ร้านคลองโยง: ${klongyongDevices.length} รายการ`);
    console.log(`   - สต๊อก: ${klongyongDevices.filter(d => d.status === 'stock').length}`);
    console.log(`   - ขายแล้ว: ${klongyongDevices.filter(d => d.status === 'sold').length}`);
    console.log(`   - ตัดออก: ${klongyongDevices.filter(d => d.status === 'removed').length}`);

    console.log(`\n💰 มูลค่าสต๊อกทั้งหมด: ${formatCurrency(
        usedDevices.filter(d => d.status === 'stock')
            .reduce((sum, d) => sum + d.purchasePrice, 0)
    )}`);

    console.log(`💵 ยอดขายทั้งหมด: ${formatCurrency(
        usedDevices.filter(d => d.status === 'sold')
            .reduce((sum, d) => sum + d.salePrice, 0)
    )}`);

    console.log(`📈 กำไรจากการขาย: ${formatCurrency(
        usedDevices.filter(d => d.status === 'sold')
            .reduce((sum, d) => sum + (d.salePrice - d.purchasePrice), 0)
    )}`);

    console.log('─────────────────────────────');
}

// Add to window for console access
window.resetUsedDevicesDB = resetUsedDevicesDatabase;
window.clearUsedDevicesDB = clearUsedDevicesDatabase;
window.exportUsedDevicesDB = exportUsedDevicesDatabase;
window.showUsedDevicesStats = showUsedDatabaseStats;

// ===== REPAIR DEVICES DATABASE =====

// Mock database for repair devices
const repairDevicesMockData = [
    // ร้านศาลายา - รอซ่อม
    {
        id: 'R1001',
        brand: 'Apple',
        model: 'iPhone 13 Pro',
        color: 'Graphite',
        imei: '358234567894001',
        symptom: 'จอแตก ทัชไม่ได้',
        price: 4500,
        receiveDate: '2025-10-03',
        returnDate: null,
        status: 'pending',
        store: 'salaya',
        createdAt: '2025-10-03T10:00:00Z'
    },
    {
        id: 'R1002',
        brand: 'Samsung',
        model: 'Galaxy S22',
        color: 'Phantom White',
        imei: '358234567894002',
        symptom: 'ไม่ชาร์จ พอร์ตเสีย',
        price: 2000,
        receiveDate: '2025-10-04',
        returnDate: null,
        status: 'pending',
        store: 'salaya',
        createdAt: '2025-10-04T11:30:00Z'
    },

    // ร้านศาลายา - ส่งซ่อม
    {
        id: 'R1003',
        brand: 'Xiaomi',
        model: 'Redmi Note 12',
        color: 'Midnight Black',
        imei: '358234567894003',
        symptom: 'เปิดเครื่องไม่ติด',
        price: 1800,
        receiveDate: '2025-10-02',
        returnDate: null,
        status: 'in-repair',
        store: 'salaya',
        createdAt: '2025-10-02T09:15:00Z'
    },
    {
        id: 'R1004',
        brand: 'OPPO',
        model: 'Reno8',
        color: 'Starlight Black',
        imei: '358234567894004',
        symptom: 'กล้องหลังเสีย',
        price: 2500,
        receiveDate: '2025-10-01',
        returnDate: null,
        status: 'in-repair',
        store: 'salaya',
        createdAt: '2025-10-01T14:00:00Z'
    },

    // ร้านศาลายา - ซ่อมเสร็จ
    {
        id: 'R1005',
        brand: 'Vivo',
        model: 'V25',
        color: 'Diamond Black',
        imei: '358234567894005',
        symptom: 'ลำโพงเสียง เสียงดังไม่ออก',
        price: 1500,
        receiveDate: '2025-09-30',
        returnDate: null,
        status: 'completed',
        store: 'salaya',
        createdAt: '2025-09-30T10:30:00Z'
    },

    // ร้านศาลายา - รับแล้ว
    {
        id: 'R1006',
        brand: 'Realme',
        model: '10 Pro+',
        color: 'Hyperspace',
        imei: '358234567894006',
        symptom: 'แบตเสื่อม เปลี่ยนแบต',
        price: 1200,
        receiveDate: '2025-09-25',
        returnDate: '2025-09-28',
        status: 'received',
        store: 'salaya',
        createdAt: '2025-09-25T11:00:00Z'
    },
    {
        id: 'R1007',
        brand: 'Apple',
        model: 'iPhone 12',
        color: 'Blue',
        imei: '358234567894007',
        symptom: 'กล้องหน้าพร่า',
        price: 3500,
        receiveDate: '2025-09-22',
        returnDate: '2025-09-26',
        status: 'received',
        store: 'salaya',
        createdAt: '2025-09-22T15:20:00Z'
    },

    // ร้านคลองโยง - รอซ่อม
    {
        id: 'R2001',
        brand: 'Samsung',
        model: 'Galaxy A54',
        color: 'Awesome Violet',
        imei: '358234567894101',
        symptom: 'จอเป็นเส้น',
        price: 2800,
        receiveDate: '2025-10-04',
        returnDate: null,
        status: 'pending',
        store: 'klongyong',
        createdAt: '2025-10-04T10:00:00Z'
    },

    // ร้านคลองโยง - ส่งซ่อม
    {
        id: 'R2002',
        brand: 'OPPO',
        model: 'A78',
        color: 'Glowing Blue',
        imei: '358234567894102',
        symptom: 'ไมค์เสีย คุยไม่ได้ยิน',
        price: 1500,
        receiveDate: '2025-10-02',
        returnDate: null,
        status: 'in-repair',
        store: 'klongyong',
        createdAt: '2025-10-02T13:30:00Z'
    },

    // ร้านคลองโยง - ซ่อมเสร็จ
    {
        id: 'R2003',
        brand: 'Vivo',
        model: 'Y36',
        color: 'Meteor Black',
        imei: '358234567894103',
        symptom: 'ปุ่มเพาเวอร์กด',
        price: 800,
        receiveDate: '2025-10-01',
        returnDate: null,
        status: 'completed',
        store: 'klongyong',
        createdAt: '2025-10-01T09:45:00Z'
    },

    // ร้านศาลายา - คืนเครื่อง
    {
        id: 'R1008',
        brand: 'Samsung',
        model: 'Galaxy S21',
        color: 'Phantom Gray',
        imei: '358234567894008',
        symptom: 'จอแตก',
        price: 3800,
        receiveDate: '2025-09-28',
        returnDate: null,
        note: 'ลูกค้าไม่ต้องการซ่อมแล้ว ราคาแพงเกินไป',
        status: 'returned',
        store: 'salaya',
        createdAt: '2025-09-28T10:00:00Z'
    },

    // ร้านคลองโยง - คืนเครื่อง
    {
        id: 'R2005',
        brand: 'OPPO',
        model: 'Find X5',
        color: 'White',
        imei: '358234567894105',
        symptom: 'แบตบวม',
        price: 2500,
        receiveDate: '2025-09-29',
        returnDate: null,
        note: 'ซ่อมไม่ได้ อันตราย ให้ลูกค้านำกลับไป',
        status: 'returned',
        store: 'klongyong',
        createdAt: '2025-09-29T11:30:00Z'
    },

    // ร้านคลองโยง - รับแล้ว
    {
        id: 'R2004',
        brand: 'Xiaomi',
        model: 'Redmi 12',
        color: 'Sky Blue',
        imei: '358234567894104',
        symptom: 'ไม่จับ Wifi',
        price: 1000,
        receiveDate: '2025-09-28',
        returnDate: '2025-10-02',
        status: 'received',
        store: 'klongyong',
        createdAt: '2025-09-28T14:15:00Z'
    }
];

// Data storage for repair devices
let repairDevices = [];

// Initialize repair devices database
function initializeRepairDatabase() {
    const storedData = localStorage.getItem('repairDevices');

    if (!storedData) {
        repairDevices = [...repairDevicesMockData];
        localStorage.setItem('repairDevices', JSON.stringify(repairDevices));
        console.log('✅ เริ่มต้นฐานข้อมูลเครื่องซ่อมสำเร็จ');
        console.log(`📊 มีข้อมูลทั้งหมด ${repairDevices.length} รายการ`);
    } else {
        repairDevices = JSON.parse(storedData);
        console.log('✅ โหลดข้อมูลเครื่องซ่อมจาก localStorage สำเร็จ');
        console.log(`📊 มีข้อมูลทั้งหมด ${repairDevices.length} รายการ`);
    }
}

let currentRepairEditId = null;

// ===== REPAIR DEVICES CRUD FUNCTIONS =====

// Initialize repair tabs
function initializeRepairTabs() {
    const tabButtons = document.querySelectorAll('#repair .tab-btn');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');

            // Remove active class from all repair tabs and contents
            document.querySelectorAll('#repair .tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('#repair .tab-content').forEach(content => content.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(tabName + '-tab').classList.add('active');
        });
    });
}

// Open repair modal
function openRepairModal(repairId = null) {
    const modal = document.getElementById('repairModal');
    const modalTitle = document.getElementById('repairModalTitle');
    const form = document.getElementById('repairForm');

    // Reset form
    form.reset();
    currentRepairEditId = repairId;

    if (repairId) {
        // Edit mode
        modalTitle.textContent = 'แก้ไขรายการซ่อม';
        const repair = repairDevices.find(r => r.id === repairId);

        if (repair) {
            document.getElementById('repairId').value = repair.id;
            document.getElementById('repairBrand').value = repair.brand;
            document.getElementById('repairModel').value = repair.model;
            document.getElementById('repairColor').value = repair.color;
            document.getElementById('repairImei').value = repair.imei;
            document.getElementById('repairSymptom').value = repair.symptom;
            document.getElementById('repairPrice').value = repair.price;
            document.getElementById('repairReceiveDate').value = repair.receiveDate;
            document.getElementById('repairStatus').value = repair.status;
        }
    } else {
        // Add mode
        modalTitle.textContent = 'เพิ่มรายการซ่อม';
        // Set default receive date to today
        document.getElementById('repairReceiveDate').value = new Date().toISOString().split('T')[0];
    }

    modal.classList.add('show');
}

// Close repair modal
function closeRepairModal() {
    const modal = document.getElementById('repairModal');
    modal.classList.remove('show');
    currentRepairEditId = null;
}

// Save repair
function saveRepair(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const repair = {
        id: currentRepairEditId || ('R' + Date.now().toString()),
        brand: formData.get('brand'),
        model: formData.get('model'),
        color: formData.get('color'),
        imei: formData.get('imei'),
        symptom: formData.get('symptom'),
        price: parseFloat(formData.get('price')),
        receiveDate: formData.get('receiveDate'),
        returnDate: null,
        status: formData.get('status'),
        store: currentStore,
        createdAt: currentRepairEditId ? repairDevices.find(r => r.id === currentRepairEditId).createdAt : new Date().toISOString()
    };

    if (currentRepairEditId) {
        // Update existing repair
        const index = repairDevices.findIndex(r => r.id === currentRepairEditId);
        repairDevices[index] = repair;
    } else {
        // Add new repair
        repairDevices.push(repair);
    }

    // Save to localStorage
    localStorage.setItem('repairDevices', JSON.stringify(repairDevices));

    // Reload data
    loadRepairData();

    // Close modal
    closeRepairModal();

    // Show success message
    showNotification(currentRepairEditId ? 'บันทึกข้อมูลสำเร็จ' : 'เพิ่มรายการซ่อมสำเร็จ');
}

// Load and display repair data
function loadRepairData() {
    // Pending, In-repair, Completed: Show current data always (no date filter)
    const pendingRepairs = repairDevices.filter(r => r.store === currentStore && r.status === 'pending');
    displayRepairs(pendingRepairs, 'repairPendingTableBody', 'pending');

    const inRepairRepairs = repairDevices.filter(r => r.store === currentStore && r.status === 'in-repair');
    displayRepairs(inRepairRepairs, 'repairInRepairTableBody', 'in-repair');

    const completedRepairs = repairDevices.filter(r => r.store === currentStore && r.status === 'completed');
    displayRepairs(completedRepairs, 'repairCompletedTableBody', 'completed');

    // Returned: Filter by returnDate (current month by default)
    let returnedRepairs = repairDevices.filter(r => r.store === currentStore && r.status === 'returned');

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    returnedRepairs = returnedRepairs.filter(repair => {
        if (!repair.returnDate) return false;
        const date = new Date(repair.returnDate);
        return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
    });

    displayRepairs(returnedRepairs, 'repairReturnedTableBody', 'returned');

    // Received: Filter by returnDate (current month by default)
    let receivedRepairs = repairDevices.filter(r => r.store === currentStore && r.status === 'received');

    receivedRepairs = receivedRepairs.filter(repair => {
        if (!repair.returnDate) return false;
        const date = new Date(repair.returnDate);
        return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
    });

    displayRepairs(receivedRepairs, 'repairReceivedTableBody', 'received');

    // Update tab counts
    updateRepairTabCounts();

    // Update dashboard stats
    updateDashboard();
}

// Display repairs in table
function displayRepairs(repairs, tableBodyId, type) {
    const tbody = document.getElementById(tableBodyId);

    if (!tbody) return;

    if (repairs.length === 0) {
        const colspan = (type === 'received' || type === 'returned') ? '9' : '8';
        tbody.innerHTML = `<tr><td colspan="${colspan}" class="empty-state">ไม่มีข้อมูล</td></tr>`;
        return;
    }

    tbody.innerHTML = repairs.map(repair => {
        if (type === 'received') {
            return `
                <tr>
                    <td>${repair.brand}</td>
                    <td>${repair.model}</td>
                    <td>${repair.color}</td>
                    <td>${repair.imei}</td>
                    <td>${repair.symptom}</td>
                    <td>${formatCurrency(repair.price)}</td>
                    <td>${formatDate(repair.receiveDate)}</td>
                    <td>${formatDate(repair.returnDate)}</td>
                    <td>
                        <button class="action-btn btn-edit" onclick="openRepairModal('${repair.id}')">แก้ไข</button>
                        <button class="action-btn btn-delete" onclick="deleteRepair('${repair.id}')">ลบ</button>
                    </td>
                </tr>
            `;
        } else if (type === 'returned') {
            return `
                <tr>
                    <td>${repair.brand}</td>
                    <td>${repair.model}</td>
                    <td>${repair.color}</td>
                    <td>${repair.imei}</td>
                    <td>${repair.symptom}</td>
                    <td>${formatCurrency(repair.price)}</td>
                    <td>${formatDate(repair.receiveDate)}</td>
                    <td>${repair.note || '-'}</td>
                    <td>
                        <button class="action-btn btn-edit" onclick="openRepairModal('${repair.id}')">แก้ไข</button>
                        <button class="action-btn btn-success" onclick="markAsReceived('${repair.id}')">รับเครื่อง</button>
                        <button class="action-btn btn-delete" onclick="deleteRepair('${repair.id}')">ลบ</button>
                    </td>
                </tr>
            `;
        } else {
            const actionButtons = type === 'completed'
                ? `<button class="action-btn btn-warning" onclick="markAsReturned('${repair.id}')">คืนเครื่อง</button>
                   <button class="action-btn btn-success" onclick="markAsReceived('${repair.id}')">รับเครื่อง</button>`
                : '';

            return `
                <tr>
                    <td>${repair.brand}</td>
                    <td>${repair.model}</td>
                    <td>${repair.color}</td>
                    <td>${repair.imei}</td>
                    <td>${repair.symptom}</td>
                    <td>${formatCurrency(repair.price)}</td>
                    <td>${formatDate(repair.receiveDate)}</td>
                    <td>
                        <button class="action-btn btn-edit" onclick="openRepairModal('${repair.id}')">แก้ไข</button>
                        ${actionButtons}
                        <button class="action-btn btn-delete" onclick="deleteRepair('${repair.id}')">ลบ</button>
                    </td>
                </tr>
            `;
        }
    }).join('');
}

// Mark repair as received
function markAsReceived(repairId) {
    if (confirm('ลูกค้ามารับเครื่องแล้วใช่หรือไม่?')) {
        const repair = repairDevices.find(r => r.id === repairId);
        if (repair) {
            repair.status = 'received';
            repair.returnDate = new Date().toISOString().split('T')[0];
            localStorage.setItem('repairDevices', JSON.stringify(repairDevices));
            loadRepairData();
            showNotification('บันทึกรับเครื่องสำเร็จ');
        }
    }
}

// Mark repair as returned
function markAsReturned(repairId) {
    const note = prompt('กรุณาระบุเหตุผลที่คืนเครื่อง:');
    if (note !== null && note.trim() !== '') {
        const repair = repairDevices.find(r => r.id === repairId);
        if (repair) {
            repair.status = 'returned';
            repair.note = note.trim();
            localStorage.setItem('repairDevices', JSON.stringify(repairDevices));
            loadRepairData();
            showNotification('บันทึกคืนเครื่องสำเร็จ');
        }
    } else if (note !== null) {
        alert('กรุณาระบุเหตุผลที่คืนเครื่อง');
    }
}

// Delete repair
function deleteRepair(repairId) {
    if (confirm('ต้องการลบข้อมูลนี้หรือไม่? (ไม่สามารถกู้คืนได้)')) {
        repairDevices = repairDevices.filter(r => r.id !== repairId);
        localStorage.setItem('repairDevices', JSON.stringify(repairDevices));
        loadRepairData();
        showNotification('ลบข้อมูลสำเร็จ');
    }
}

// Update repair tab counts
function updateRepairTabCounts() {
    const storeRepairs = repairDevices.filter(r => r.store === currentStore);

    // Count repairs by status
    const pendingCount = storeRepairs.filter(r => r.status === 'pending').length;
    const inRepairCount = storeRepairs.filter(r => r.status === 'in-repair').length;
    const completedCount = storeRepairs.filter(r => r.status === 'completed').length;
    const returnedCount = storeRepairs.filter(r => r.status === 'returned').length;
    const receivedCount = storeRepairs.filter(r => r.status === 'received').length;

    // Update tab counts
    const pendingCountElement = document.getElementById('repairPendingCount');
    const inRepairCountElement = document.getElementById('repairInRepairCount');
    const completedCountElement = document.getElementById('repairCompletedCount');
    const returnedCountElement = document.getElementById('repairReturnedCount');
    const receivedCountElement = document.getElementById('repairReceivedCount');

    if (pendingCountElement) pendingCountElement.textContent = pendingCount;
    if (inRepairCountElement) inRepairCountElement.textContent = inRepairCount;
    if (completedCountElement) completedCountElement.textContent = completedCount;
    if (returnedCountElement) returnedCountElement.textContent = returnedCount;
    if (receivedCountElement) receivedCountElement.textContent = receivedCount;
}

// Initialize repair search
function initializeRepairSearch() {
    const searchInput = document.getElementById('searchRepair');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filterRepairs(searchTerm);
        });
    }
}

// Filter repairs based on search term
function filterRepairs(searchTerm) {
    // Pending, In-repair, Completed: Show current data always (no date filter)
    let pendingRepairs = repairDevices.filter(r => r.store === currentStore && r.status === 'pending');

    // Apply search filter
    if (searchTerm) {
        pendingRepairs = pendingRepairs.filter(repair => {
            return repair.brand.toLowerCase().includes(searchTerm) ||
                   repair.model.toLowerCase().includes(searchTerm) ||
                   repair.color.toLowerCase().includes(searchTerm) ||
                   repair.imei.toLowerCase().includes(searchTerm) ||
                   repair.symptom.toLowerCase().includes(searchTerm);
        });
    }

    displayRepairs(pendingRepairs, 'repairPendingTableBody', 'pending');

    let inRepairRepairs = repairDevices.filter(r => r.store === currentStore && r.status === 'in-repair');

    // Apply search filter
    if (searchTerm) {
        inRepairRepairs = inRepairRepairs.filter(repair => {
            return repair.brand.toLowerCase().includes(searchTerm) ||
                   repair.model.toLowerCase().includes(searchTerm) ||
                   repair.color.toLowerCase().includes(searchTerm) ||
                   repair.imei.toLowerCase().includes(searchTerm) ||
                   repair.symptom.toLowerCase().includes(searchTerm);
        });
    }

    displayRepairs(inRepairRepairs, 'repairInRepairTableBody', 'in-repair');

    let completedRepairs = repairDevices.filter(r => r.store === currentStore && r.status === 'completed');

    // Apply search filter
    if (searchTerm) {
        completedRepairs = completedRepairs.filter(repair => {
            return repair.brand.toLowerCase().includes(searchTerm) ||
                   repair.model.toLowerCase().includes(searchTerm) ||
                   repair.color.toLowerCase().includes(searchTerm) ||
                   repair.imei.toLowerCase().includes(searchTerm) ||
                   repair.symptom.toLowerCase().includes(searchTerm);
        });
    }

    displayRepairs(completedRepairs, 'repairCompletedTableBody', 'completed');

    // Returned: Filter by date and search
    let returnedRepairs = repairDevices.filter(r => r.store === currentStore && r.status === 'returned');

    // Apply date filter
    if (currentRepairFilter.month || currentRepairFilter.year) {
        returnedRepairs = returnedRepairs.filter(repair => {
            if (!repair.returnDate) return false;
            const date = new Date(repair.returnDate);
            const repairMonth = date.getMonth() + 1;
            const repairYear = date.getFullYear();

            const monthMatch = !currentRepairFilter.month || repairMonth == currentRepairFilter.month;
            const yearMatch = !currentRepairFilter.year || repairYear == currentRepairFilter.year;

            return monthMatch && yearMatch;
        });
    } else {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        returnedRepairs = returnedRepairs.filter(repair => {
            if (!repair.returnDate) return false;
            const date = new Date(repair.returnDate);
            return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        });
    }

    // Apply search filter
    if (searchTerm) {
        returnedRepairs = returnedRepairs.filter(repair => {
            return repair.brand.toLowerCase().includes(searchTerm) ||
                   repair.model.toLowerCase().includes(searchTerm) ||
                   repair.color.toLowerCase().includes(searchTerm) ||
                   repair.imei.toLowerCase().includes(searchTerm) ||
                   repair.symptom.toLowerCase().includes(searchTerm);
        });
    }

    displayRepairs(returnedRepairs, 'repairReturnedTableBody', 'returned');

    // Received: Filter by date and search
    let receivedRepairs = repairDevices.filter(r => r.store === currentStore && r.status === 'received');

    // Apply date filter
    if (currentRepairFilter.month || currentRepairFilter.year) {
        receivedRepairs = receivedRepairs.filter(repair => {
            if (!repair.returnDate) return false;
            const date = new Date(repair.returnDate);
            const repairMonth = date.getMonth() + 1;
            const repairYear = date.getFullYear();

            const monthMatch = !currentRepairFilter.month || repairMonth == currentRepairFilter.month;
            const yearMatch = !currentRepairFilter.year || repairYear == currentRepairFilter.year;

            return monthMatch && yearMatch;
        });
    } else {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        receivedRepairs = receivedRepairs.filter(repair => {
            if (!repair.returnDate) return false;
            const date = new Date(repair.returnDate);
            return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        });
    }

    // Apply search filter
    if (searchTerm) {
        receivedRepairs = receivedRepairs.filter(repair => {
            return repair.brand.toLowerCase().includes(searchTerm) ||
                   repair.model.toLowerCase().includes(searchTerm) ||
                   repair.color.toLowerCase().includes(searchTerm) ||
                   repair.imei.toLowerCase().includes(searchTerm) ||
                   repair.symptom.toLowerCase().includes(searchTerm);
        });
    }

    displayRepairs(receivedRepairs, 'repairReceivedTableBody', 'received');
}

// Initialize date filter for repair
function initializeRepairDateFilter() {
    const monthSelect = document.getElementById('filterRepairMonth');
    const yearSelect = document.getElementById('filterRepairYear');

    if (!monthSelect || !yearSelect) return;

    // Populate months
    const thaiMonthsShort = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    for (let i = 0; i < 12; i++) {
        const option = document.createElement('option');
        option.value = i + 1;
        option.textContent = thaiMonthsShort[i];
        monthSelect.appendChild(option);
    }

    // Populate years
    const currentYear = new Date().getFullYear();
    for (let year = currentYear + 543 + 1; year >= currentYear + 543 - 3; year--) {
        const option = document.createElement('option');
        option.value = year - 543;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

let currentRepairFilter = { month: '', year: '' };

// Filter repair by date
function filterRepairByDate() {
    const monthSelect = document.getElementById('filterRepairMonth');
    const yearSelect = document.getElementById('filterRepairYear');

    currentRepairFilter.month = monthSelect.value;
    currentRepairFilter.year = yearSelect.value;

    // Pending, In-repair, Completed: Show current data always (no date filter)
    const pendingRepairs = repairDevices.filter(r => r.store === currentStore && r.status === 'pending');
    displayRepairs(pendingRepairs, 'repairPendingTableBody', 'pending');

    const inRepairRepairs = repairDevices.filter(r => r.store === currentStore && r.status === 'in-repair');
    displayRepairs(inRepairRepairs, 'repairInRepairTableBody', 'in-repair');

    const completedRepairs = repairDevices.filter(r => r.store === currentStore && r.status === 'completed');
    displayRepairs(completedRepairs, 'repairCompletedTableBody', 'completed');

    // Returned: Filter by returnDate
    let returnedRepairs = repairDevices.filter(r => r.store === currentStore && r.status === 'returned');

    if (currentRepairFilter.month || currentRepairFilter.year) {
        returnedRepairs = returnedRepairs.filter(repair => {
            if (!repair.returnDate) return false;
            const date = new Date(repair.returnDate);
            const repairMonth = date.getMonth() + 1;
            const repairYear = date.getFullYear();

            const monthMatch = !currentRepairFilter.month || repairMonth == currentRepairFilter.month;
            const yearMatch = !currentRepairFilter.year || repairYear == currentRepairFilter.year;

            return monthMatch && yearMatch;
        });
    } else {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        returnedRepairs = returnedRepairs.filter(repair => {
            if (!repair.returnDate) return false;
            const date = new Date(repair.returnDate);
            return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        });
    }

    displayRepairs(returnedRepairs, 'repairReturnedTableBody', 'returned');

    // Received: Filter by returnDate
    let receivedRepairs = repairDevices.filter(r => r.store === currentStore && r.status === 'received');

    if (currentRepairFilter.month || currentRepairFilter.year) {
        receivedRepairs = receivedRepairs.filter(repair => {
            if (!repair.returnDate) return false;
            const date = new Date(repair.returnDate);
            const repairMonth = date.getMonth() + 1;
            const repairYear = date.getFullYear();

            const monthMatch = !currentRepairFilter.month || repairMonth == currentRepairFilter.month;
            const yearMatch = !currentRepairFilter.year || repairYear == currentRepairFilter.year;

            return monthMatch && yearMatch;
        });
    } else {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        receivedRepairs = receivedRepairs.filter(repair => {
            if (!repair.returnDate) return false;
            const date = new Date(repair.returnDate);
            return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        });
    }

    displayRepairs(receivedRepairs, 'repairReceivedTableBody', 'received');
}

// Clear repair filter
function clearRepairFilter() {
    document.getElementById('filterRepairMonth').value = '';
    document.getElementById('filterRepairYear').value = '';
    currentRepairFilter = { month: '', year: '' };
    loadRepairData();
}

// Close repair modal when clicking outside
window.addEventListener('click', function(event) {
    const repairModal = document.getElementById('repairModal');
    if (event.target === repairModal) {
        closeRepairModal();
    }
});

// ===== INSTALLMENT DEVICES (เครื่องผ่อน) =====

// Mock data for installment devices
const installmentDevicesMockData = [
    // ร้านศาลายา - ผ่อนอยู่
    {
        id: 'I1001',
        brand: 'Apple',
        model: 'iPhone 14',
        color: 'Blue',
        imei: '358234567896001',
        ram: '6',
        rom: '128',
        customerName: 'สมชาย ใจดี',
        customerPhone: '0812345678',
        costPrice: 28000,
        salePrice: 35000,
        downPayment: 5000,
        totalInstallments: 10,
        installmentAmount: 3000,
        paidInstallments: 3,
        downPaymentDate: '2025-09-01',
        completedDate: null,
        seizedDate: null,
        paymentHistory: [
            { installmentNumber: 1, paymentDate: '2025-10-01', amount: 3000 },
            { installmentNumber: 2, paymentDate: '2025-10-31', amount: 3000 },
            { installmentNumber: 3, paymentDate: '2025-11-30', amount: 3000 }
        ],
        note: '',
        status: 'active',
        store: 'salaya',
        createdAt: '2025-09-01T10:00:00Z'
    },
    {
        id: 'I1002',
        brand: 'Samsung',
        model: 'Galaxy S23',
        color: 'Phantom Black',
        imei: '358234567896002',
        ram: '8',
        rom: '256',
        customerName: 'สมหญิง สุขใจ',
        customerPhone: '0823456789',
        costPrice: 22000,
        salePrice: 28000,
        downPayment: 4000,
        totalInstallments: 6,
        installmentAmount: 4000,
        paidInstallments: 2,
        downPaymentDate: '2025-09-10',
        completedDate: null,
        seizedDate: null,
        paymentHistory: [
            { installmentNumber: 1, paymentDate: '2025-10-10', amount: 4000 },
            { installmentNumber: 2, paymentDate: '2025-11-09', amount: 4000 }
        ],
        note: 'ลูกค้าประจำ',
        status: 'active',
        store: 'salaya',
        createdAt: '2025-09-10T11:00:00Z'
    },

    // ร้านศาลายา - ผ่อนครบ
    {
        id: 'I1003',
        brand: 'OPPO',
        model: 'Reno10',
        color: 'Silver',
        imei: '358234567896003',
        ram: '8',
        rom: '256',
        customerName: 'สมศักดิ์ มั่งมี',
        customerPhone: '0834567890',
        costPrice: 12000,
        salePrice: 15000,
        downPayment: 3000,
        totalInstallments: 6,
        installmentAmount: 2000,
        paidInstallments: 6,
        downPaymentDate: '2025-04-01',
        completedDate: '2025-09-29',
        seizedDate: null,
        paymentHistory: [
            { installmentNumber: 1, paymentDate: '2025-05-01', amount: 2000 },
            { installmentNumber: 2, paymentDate: '2025-05-31', amount: 2000 },
            { installmentNumber: 3, paymentDate: '2025-06-30', amount: 2000 },
            { installmentNumber: 4, paymentDate: '2025-07-30', amount: 2000 },
            { installmentNumber: 5, paymentDate: '2025-08-29', amount: 2000 },
            { installmentNumber: 6, paymentDate: '2025-09-28', amount: 2000 }
        ],
        note: 'จ่ายตรงเวลาทุกงวด',
        status: 'completed',
        store: 'salaya',
        createdAt: '2025-04-01T09:00:00Z'
    },

    // ร้านศาลายา - ยึดเครื่อง
    {
        id: 'I1004',
        brand: 'Xiaomi',
        model: 'Redmi Note 12',
        color: 'Black',
        imei: '358234567896004',
        ram: '6',
        rom: '128',
        customerName: 'สมปอง เหนื่อยจน',
        customerPhone: '0845678901',
        costPrice: 7000,
        salePrice: 9000,
        downPayment: 1000,
        totalInstallments: 10,
        installmentAmount: 800,
        paidInstallments: 3,
        downPaymentDate: '2025-06-01',
        completedDate: null,
        seizedDate: '2025-09-25',
        paymentHistory: [
            { installmentNumber: 1, paymentDate: '2025-07-01', amount: 800 },
            { installmentNumber: 2, paymentDate: '2025-07-31', amount: 800 },
            { installmentNumber: 3, paymentDate: '2025-08-30', amount: 800 }
        ],
        note: 'เกินกำหนด 2 งวด ติดต่อไม่ได้',
        status: 'seized',
        store: 'salaya',
        createdAt: '2025-06-01T10:00:00Z'
    },

    // ร้านคลองโยง - ผ่อนอยู่
    {
        id: 'I2001',
        brand: 'Vivo',
        model: 'V29',
        color: 'Purple',
        imei: '358234567896101',
        ram: '12',
        rom: '256',
        customerName: 'สมพร รวยเงิน',
        customerPhone: '0856789012',
        costPrice: 14000,
        salePrice: 18000,
        downPayment: 3000,
        totalInstallments: 10,
        installmentAmount: 1500,
        paidInstallments: 5,
        downPaymentDate: '2025-05-01',
        completedDate: null,
        seizedDate: null,
        paymentHistory: [
            { installmentNumber: 1, paymentDate: '2025-05-31', amount: 1500 },
            { installmentNumber: 2, paymentDate: '2025-06-30', amount: 1500 },
            { installmentNumber: 3, paymentDate: '2025-07-30', amount: 1500 },
            { installmentNumber: 4, paymentDate: '2025-08-29', amount: 1500 },
            { installmentNumber: 5, paymentDate: '2025-09-28', amount: 1500 }
        ],
        note: '',
        status: 'active',
        store: 'klongyong',
        createdAt: '2025-05-01T10:00:00Z'
    },

    // ร้านคลองโยง - ผ่อนครบ
    {
        id: 'I2002',
        brand: 'Realme',
        model: '11 Pro',
        color: 'Green',
        imei: '358234567896102',
        ram: '8',
        rom: '128',
        customerName: 'สมหมาย ซื่อตรง',
        customerPhone: '0867890123',
        costPrice: 8000,
        salePrice: 10000,
        downPayment: 2000,
        totalInstallments: 4,
        installmentAmount: 2000,
        paidInstallments: 4,
        downPaymentDate: '2025-06-01',
        completedDate: '2025-09-29',
        seizedDate: null,
        paymentHistory: [
            { installmentNumber: 1, paymentDate: '2025-07-01', amount: 2000 },
            { installmentNumber: 2, paymentDate: '2025-07-31', amount: 2000 },
            { installmentNumber: 3, paymentDate: '2025-08-30', amount: 2000 },
            { installmentNumber: 4, paymentDate: '2025-09-29', amount: 2000 }
        ],
        note: '',
        status: 'completed',
        store: 'klongyong',
        createdAt: '2025-06-01T11:00:00Z'
    }
];

// Data storage for installment devices
let installmentDevices = [];

// Initialize installment devices database
function initializeInstallmentDatabase() {
    const storedData = localStorage.getItem('installmentDevices');
    if (!storedData) {
        installmentDevices = [...installmentDevicesMockData];
        localStorage.setItem('installmentDevices', JSON.stringify(installmentDevices));
        console.log('✅ เริ่มต้นฐานข้อมูลเครื่องผ่อนสำเร็จ');
        console.log(`📊 มีข้อมูลทั้งหมด ${installmentDevices.length} รายการ`);
    } else {
        installmentDevices = JSON.parse(storedData);
        console.log('✅ โหลดข้อมูลเครื่องผ่อนจาก localStorage สำเร็จ');
        console.log(`📊 มีข้อมูลทั้งหมด ${installmentDevices.length} รายการ`);
    }
}

let currentInstallmentEditId = null;

// ===== INSTALLMENT DEVICES CRUD FUNCTIONS =====

// Initialize installment tabs
function initializeInstallmentTabs() {
    const tabButtons = document.querySelectorAll('#installment .tab-btn');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');

            // Remove active class from all installment tabs and contents
            document.querySelectorAll('#installment .tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('#installment .tab-content').forEach(content => content.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(tabName + '-tab').classList.add('active');
        });
    });
}

// Calculate installment amount (optional helper - user can override)
function calculateInstallment() {
    // This function is no longer called automatically
    // User can manually input the installment amount
    // Keep this function for future use if needed
}

// Open installment modal for adding/editing
function openInstallmentModal(installmentId = null) {
    const modal = document.getElementById('installmentModal');
    const modalTitle = document.getElementById('installmentModalTitle');
    const form = document.getElementById('installmentForm');

    form.reset();
    currentInstallmentEditId = installmentId;

    if (installmentId) {
        // Edit mode
        modalTitle.textContent = 'แก้ไขรายการผ่อน';
        const installment = installmentDevices.find(i => i.id === installmentId);
        if (installment) {
            document.getElementById('installmentBrand').value = installment.brand;
            document.getElementById('installmentModel').value = installment.model;
            document.getElementById('installmentColor').value = installment.color;
            document.getElementById('installmentImei').value = installment.imei;
            document.getElementById('installmentRam').value = installment.ram;
            document.getElementById('installmentRom').value = installment.rom;
            document.getElementById('customerName').value = installment.customerName;
            document.getElementById('customerPhone').value = installment.customerPhone;
            document.getElementById('costPrice').value = installment.costPrice;
            document.getElementById('salePrice').value = installment.salePrice;
            document.getElementById('downPayment').value = installment.downPayment;
            document.getElementById('totalInstallments').value = installment.totalInstallments;
            document.getElementById('installmentAmount').value = installment.installmentAmount;
            document.getElementById('downPaymentDate').value = installment.downPaymentDate;
            document.getElementById('nextDueDate').value = getNextDueDate(installment);
            document.getElementById('installmentNote').value = installment.note || '';
        }
    } else {
        // Add mode
        modalTitle.textContent = 'เพิ่มรายการผ่อน';
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('downPaymentDate').value = today;
    }

    modal.classList.add('show');
}

// Close installment modal
function closeInstallmentModal() {
    const modal = document.getElementById('installmentModal');
    modal.classList.remove('show');
    currentInstallmentEditId = null;
    transferSourceDeviceId = null;
}

// Transfer new device to installment
let transferSourceDeviceId = null;

function transferToInstallment(deviceId) {
    const device = newDevices.find(d => d.id === deviceId);
    if (!device) {
        showNotification('ไม่พบข้อมูลเครื่อง', 'error');
        return;
    }

    // Store the source device ID for later use
    transferSourceDeviceId = deviceId;

    // Open installment modal
    const modal = document.getElementById('installmentModal');
    const modalTitle = document.getElementById('installmentModalTitle');
    const form = document.getElementById('installmentForm');

    form.reset();
    currentInstallmentEditId = null;
    modalTitle.textContent = 'เพิ่มรายการผ่อน (จากเครื่องใหม่)';

    // Fill device data
    document.getElementById('installmentBrand').value = device.brand;
    document.getElementById('installmentModel').value = device.model;
    document.getElementById('installmentColor').value = device.color;
    document.getElementById('installmentImei').value = device.imei;
    document.getElementById('installmentRam').value = device.ram;
    document.getElementById('installmentRom').value = device.rom;
    document.getElementById('costPrice').value = device.purchasePrice;

    // Set today as down payment date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('downPaymentDate').value = today;

    modal.classList.add('show');
}

// Save installment (add or update)
function saveInstallment(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const installment = {
        id: currentInstallmentEditId || ('I' + Date.now().toString()),
        brand: formData.get('brand'),
        model: formData.get('model'),
        color: formData.get('color'),
        imei: formData.get('imei'),
        ram: formData.get('ram'),
        rom: formData.get('rom'),
        customerName: formData.get('customerName'),
        customerPhone: formData.get('customerPhone'),
        costPrice: parseInt(formData.get('costPrice')),
        salePrice: parseInt(formData.get('salePrice')),
        downPayment: parseInt(formData.get('downPayment')),
        totalInstallments: parseInt(formData.get('totalInstallments')),
        installmentAmount: parseInt(formData.get('installmentAmount')),
        paidInstallments: currentInstallmentEditId ? installmentDevices.find(i => i.id === currentInstallmentEditId).paidInstallments : 0,
        downPaymentDate: formData.get('downPaymentDate'),
        completedDate: currentInstallmentEditId ? installmentDevices.find(i => i.id === currentInstallmentEditId).completedDate : null,
        seizedDate: currentInstallmentEditId ? installmentDevices.find(i => i.id === currentInstallmentEditId).seizedDate : null,
        paymentHistory: currentInstallmentEditId ? installmentDevices.find(i => i.id === currentInstallmentEditId).paymentHistory : [],
        note: formData.get('note') || '',
        status: currentInstallmentEditId ? installmentDevices.find(i => i.id === currentInstallmentEditId).status : 'active',
        store: currentStore,
        createdAt: currentInstallmentEditId ? installmentDevices.find(i => i.id === currentInstallmentEditId).createdAt : new Date().toISOString()
    };

    if (currentInstallmentEditId) {
        // Update existing installment
        const index = installmentDevices.findIndex(i => i.id === currentInstallmentEditId);
        installmentDevices[index] = installment;
    } else {
        // Add new installment
        installmentDevices.push(installment);
    }

    // Save to localStorage
    localStorage.setItem('installmentDevices', JSON.stringify(installmentDevices));

    // If this installment came from a new device transfer, mark the device as sold
    if (transferSourceDeviceId && !currentInstallmentEditId) {
        const device = newDevices.find(d => d.id === transferSourceDeviceId);
        if (device) {
            device.status = 'sold';
            device.saleDate = formData.get('downPaymentDate');
            device.salePrice = parseInt(formData.get('salePrice'));
            localStorage.setItem('newDevices', JSON.stringify(newDevices));
            loadNewDevicesData();
        }
    }

    // Reload data
    loadInstallmentData();

    // Close modal
    closeInstallmentModal();

    // Show success message
    showNotification(currentInstallmentEditId ? 'บันทึกข้อมูลสำเร็จ' : 'เพิ่มรายการผ่อนสำเร็จ');
}

// Load and display installment data
function loadInstallmentData() {
    // Active: Show current data always (no date filter)
    const activeInstallments = installmentDevices.filter(i => i.store === currentStore && i.status === 'active');
    displayInstallments(activeInstallments, 'installmentActiveTableBody', 'active');

    // Completed: Filter by completedDate (current month by default)
    let completedInstallments = installmentDevices.filter(i => i.store === currentStore && i.status === 'completed');

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    completedInstallments = completedInstallments.filter(inst => {
        if (!inst.completedDate) return false;
        const date = new Date(inst.completedDate);
        return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
    });

    displayInstallments(completedInstallments, 'installmentCompletedTableBody', 'completed');

    // Seized: Filter by seizedDate (current month by default)
    let seizedInstallments = installmentDevices.filter(i => i.store === currentStore && i.status === 'seized');

    seizedInstallments = seizedInstallments.filter(inst => {
        if (!inst.seizedDate) return false;
        const date = new Date(inst.seizedDate);
        return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
    });

    displayInstallments(seizedInstallments, 'installmentSeizedTableBody', 'seized');

    // Update tab counts
    updateInstallmentTabCounts();

    // Update dashboard stats
    updateDashboard();
}

// Display installments in table
function displayInstallments(installments, tableBodyId, type) {
    const tbody = document.getElementById(tableBodyId);

    if (!tbody) return;

    if (installments.length === 0) {
        const colspan = type === 'active' ? '9' : '8';
        tbody.innerHTML = `<tr><td colspan="${colspan}" class="empty-state">ไม่มีข้อมูล</td></tr>`;
        return;
    }

    tbody.innerHTML = installments.map(inst => {
        const deviceInfo = `${inst.brand} ${inst.model} (${inst.color})`;
        const customerInfo = `${inst.customerName}<br/>${inst.customerPhone}`;
        const remainingAmount = (inst.totalInstallments - inst.paidInstallments) * inst.installmentAmount;
        const nextDueDate = getNextDueDate(inst);

        if (type === 'active') {
            return `
                <tr>
                    <td>${deviceInfo}</td>
                    <td>${customerInfo}</td>
                    <td>${formatCurrency(inst.salePrice)}</td>
                    <td>${formatCurrency(inst.downPayment)}</td>
                    <td>${inst.paidInstallments}/${inst.totalInstallments}</td>
                    <td>${formatCurrency(inst.installmentAmount)}</td>
                    <td style="color: ${remainingAmount > 0 ? '#dc2626' : '#16a34a'}">${formatCurrency(remainingAmount)}</td>
                    <td>${nextDueDate}</td>
                    <td>
                        <button class="action-btn btn-edit" onclick="openInstallmentModal('${inst.id}')">แก้ไข</button>
                        <button class="action-btn btn-success" onclick="openPaymentModal('${inst.id}')">บันทึกการผ่อน</button>
                        <button class="action-btn btn-info" onclick="openHistoryModal('${inst.id}')">ประวัติ</button>
                        <button class="action-btn btn-remove" onclick="seizeInstallment('${inst.id}')">ยึดเครื่อง</button>
                        <button class="action-btn btn-delete" onclick="deleteInstallment('${inst.id}')">ลบ</button>
                    </td>
                </tr>
            `;
        } else if (type === 'completed') {
            return `
                <tr>
                    <td>${deviceInfo}</td>
                    <td>${customerInfo}</td>
                    <td>${formatCurrency(inst.salePrice)}</td>
                    <td>${formatCurrency(inst.downPayment)}</td>
                    <td>${inst.paidInstallments}/${inst.totalInstallments}</td>
                    <td>${formatCurrency(inst.installmentAmount)}</td>
                    <td>${formatDate(inst.completedDate)}</td>
                    <td>
                        <button class="action-btn btn-edit" onclick="openInstallmentModal('${inst.id}')">แก้ไข</button>
                        <button class="action-btn btn-info" onclick="openHistoryModal('${inst.id}')">ประวัติ</button>
                        <button class="action-btn btn-delete" onclick="deleteInstallment('${inst.id}')">ลบ</button>
                    </td>
                </tr>
            `;
        } else if (type === 'seized') {
            return `
                <tr>
                    <td>${deviceInfo}</td>
                    <td>${customerInfo}</td>
                    <td>${formatCurrency(inst.salePrice)}</td>
                    <td>${formatCurrency(inst.downPayment)}</td>
                    <td>${inst.paidInstallments}/${inst.totalInstallments}</td>
                    <td>${formatCurrency(remainingAmount)}</td>
                    <td>${formatDate(inst.seizedDate)}</td>
                    <td>
                        <button class="action-btn btn-edit" onclick="openInstallmentModal('${inst.id}')">แก้ไข</button>
                        <button class="action-btn btn-info" onclick="openHistoryModal('${inst.id}')">ประวัติ</button>
                        <button class="action-btn btn-delete" onclick="deleteInstallment('${inst.id}')">ลบ</button>
                    </td>
                </tr>
            `;
        }
    }).join('');
}

// Get next due date for installment
function getNextDueDate(installment) {
    if (installment.paidInstallments >= installment.totalInstallments) {
        return 'ผ่อนครบแล้ว';
    }

    const downPaymentDate = new Date(installment.downPaymentDate);
    // คำนวณวันครบกำหนดงวดถัดไป: วันวางเงินดาวน์ + (งวดที่จ่ายไปแล้ว + 1) * 30 วัน
    const daysToAdd = (installment.paidInstallments + 1) * 30;
    const nextDate = new Date(downPaymentDate);
    nextDate.setDate(downPaymentDate.getDate() + daysToAdd);

    return formatDate(nextDate.toISOString().split('T')[0]);
}

// Open payment modal
function openPaymentModal(installmentId) {
    const installment = installmentDevices.find(i => i.id === installmentId);
    if (!installment) return;

    // Check if already completed
    if (installment.paidInstallments >= installment.totalInstallments) {
        alert('รายการนี้ผ่อนครบแล้ว');
        return;
    }

    const modal = document.getElementById('paymentModal');
    const nextInstallmentNumber = installment.paidInstallments + 1;

    document.getElementById('paymentCustomerName').textContent = installment.customerName;
    document.getElementById('paymentDeviceInfo').textContent = `${installment.brand} ${installment.model}`;
    document.getElementById('paymentInstallmentNumber').textContent = `งวดที่ ${nextInstallmentNumber}/${installment.totalInstallments}`;
    document.getElementById('paymentAmount').textContent = formatCurrency(installment.installmentAmount);
    document.getElementById('paymentInstallmentId').value = installmentId;
    document.getElementById('paymentDate').value = new Date().toISOString().split('T')[0];

    modal.classList.add('show');
}

// Close payment modal
function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    modal.classList.remove('show');
}

// Save payment
function savePayment(event) {
    event.preventDefault();

    const installmentId = document.getElementById('paymentInstallmentId').value;
    const paymentDate = document.getElementById('paymentDate').value;

    const installment = installmentDevices.find(i => i.id === installmentId);
    if (!installment) return;

    const nextInstallmentNumber = installment.paidInstallments + 1;

    // Add to payment history
    installment.paymentHistory.push({
        installmentNumber: nextInstallmentNumber,
        paymentDate: paymentDate,
        amount: installment.installmentAmount
    });

    // Update paid installments
    installment.paidInstallments += 1;

    // Check if completed
    if (installment.paidInstallments >= installment.totalInstallments) {
        installment.status = 'completed';
        installment.completedDate = paymentDate;
    }

    // Save to localStorage
    localStorage.setItem('installmentDevices', JSON.stringify(installmentDevices));

    // Reload data
    loadInstallmentData();

    // Close modal
    closePaymentModal();

    // Show success message
    const message = installment.status === 'completed'
        ? 'บันทึกการชำระสำเร็จ - ผ่อนครบแล้ว!'
        : `บันทึกการชำระงวดที่ ${nextInstallmentNumber} สำเร็จ`;
    showNotification(message);
}

// Open history modal
function openHistoryModal(installmentId) {
    const installment = installmentDevices.find(i => i.id === installmentId);
    if (!installment) return;

    const modal = document.getElementById('historyModal');

    document.getElementById('historyCustomerName').textContent = installment.customerName;
    document.getElementById('historyDeviceInfo').textContent = `${installment.brand} ${installment.model}`;
    document.getElementById('historySalePrice').textContent = formatCurrency(installment.salePrice);
    document.getElementById('historyDownPayment').textContent = formatCurrency(installment.downPayment);

    const tbody = document.getElementById('historyTableBody');

    if (installment.paymentHistory.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="empty-state">ยังไม่มีประวัติการผ่อน</td></tr>';
    } else {
        tbody.innerHTML = installment.paymentHistory.map(payment => `
            <tr>
                <td>งวดที่ ${payment.installmentNumber}</td>
                <td>${formatDate(payment.paymentDate)}</td>
                <td>${formatCurrency(payment.amount)}</td>
            </tr>
        `).join('');
    }

    modal.classList.add('show');
}

// Close history modal
function closeHistoryModal() {
    const modal = document.getElementById('historyModal');
    modal.classList.remove('show');
}

// Seize installment
function seizeInstallment(installmentId) {
    if (confirm('ต้องการยึดเครื่องใช่หรือไม่?')) {
        const installment = installmentDevices.find(i => i.id === installmentId);
        if (installment) {
            installment.status = 'seized';
            installment.seizedDate = new Date().toISOString().split('T')[0];

            localStorage.setItem('installmentDevices', JSON.stringify(installmentDevices));
            loadInstallmentData();
            showNotification('บันทึกยึดเครื่องสำเร็จ');
        }
    }
}

// Delete installment
function deleteInstallment(installmentId) {
    if (confirm('ต้องการลบข้อมูลนี้หรือไม่? (ไม่สามารถกู้คืนได้)')) {
        installmentDevices = installmentDevices.filter(i => i.id !== installmentId);
        localStorage.setItem('installmentDevices', JSON.stringify(installmentDevices));
        loadInstallmentData();
        showNotification('ลบข้อมูลสำเร็จ');
    }
}

// Update installment tab counts
function updateInstallmentTabCounts() {
    const storeInstallments = installmentDevices.filter(i => i.store === currentStore);

    // Count installments by status
    const activeCount = storeInstallments.filter(i => i.status === 'active').length;
    const completedCount = storeInstallments.filter(i => i.status === 'completed').length;
    const seizedCount = storeInstallments.filter(i => i.status === 'seized').length;

    // Update tab counts
    const activeCountElement = document.getElementById('installmentActiveCount');
    const completedCountElement = document.getElementById('installmentCompletedCount');
    const seizedCountElement = document.getElementById('installmentSeizedCount');

    if (activeCountElement) activeCountElement.textContent = activeCount;
    if (completedCountElement) completedCountElement.textContent = completedCount;
    if (seizedCountElement) seizedCountElement.textContent = seizedCount;
}

// Initialize installment search
function initializeInstallmentSearch() {
    const searchInput = document.getElementById('searchInstallment');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filterInstallments(searchTerm);
        });
    }
}

// Filter installments based on search term
function filterInstallments(searchTerm) {
    // Active: Show current data always with search
    let activeInstallments = installmentDevices.filter(i => i.store === currentStore && i.status === 'active');

    if (searchTerm) {
        activeInstallments = activeInstallments.filter(inst => {
            return inst.brand.toLowerCase().includes(searchTerm) ||
                   inst.model.toLowerCase().includes(searchTerm) ||
                   inst.customerName.toLowerCase().includes(searchTerm) ||
                   inst.customerPhone.includes(searchTerm) ||
                   inst.imei.toLowerCase().includes(searchTerm);
        });
    }

    displayInstallments(activeInstallments, 'installmentActiveTableBody', 'active');

    // Completed: Filter by date and search
    let completedInstallments = installmentDevices.filter(i => i.store === currentStore && i.status === 'completed');

    // Apply date filter
    if (currentInstallmentFilter.month || currentInstallmentFilter.year) {
        completedInstallments = completedInstallments.filter(inst => {
            if (!inst.completedDate) return false;
            const date = new Date(inst.completedDate);
            const instMonth = date.getMonth() + 1;
            const instYear = date.getFullYear();

            const monthMatch = !currentInstallmentFilter.month || instMonth == currentInstallmentFilter.month;
            const yearMatch = !currentInstallmentFilter.year || instYear == currentInstallmentFilter.year;

            return monthMatch && yearMatch;
        });
    } else {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        completedInstallments = completedInstallments.filter(inst => {
            if (!inst.completedDate) return false;
            const date = new Date(inst.completedDate);
            return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        });
    }

    // Apply search filter
    if (searchTerm) {
        completedInstallments = completedInstallments.filter(inst => {
            return inst.brand.toLowerCase().includes(searchTerm) ||
                   inst.model.toLowerCase().includes(searchTerm) ||
                   inst.customerName.toLowerCase().includes(searchTerm) ||
                   inst.customerPhone.includes(searchTerm) ||
                   inst.imei.toLowerCase().includes(searchTerm);
        });
    }

    displayInstallments(completedInstallments, 'installmentCompletedTableBody', 'completed');

    // Seized: Filter by date and search
    let seizedInstallments = installmentDevices.filter(i => i.store === currentStore && i.status === 'seized');

    // Apply date filter
    if (currentInstallmentFilter.month || currentInstallmentFilter.year) {
        seizedInstallments = seizedInstallments.filter(inst => {
            if (!inst.seizedDate) return false;
            const date = new Date(inst.seizedDate);
            const instMonth = date.getMonth() + 1;
            const instYear = date.getFullYear();

            const monthMatch = !currentInstallmentFilter.month || instMonth == currentInstallmentFilter.month;
            const yearMatch = !currentInstallmentFilter.year || instYear == currentInstallmentFilter.year;

            return monthMatch && yearMatch;
        });
    } else {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        seizedInstallments = seizedInstallments.filter(inst => {
            if (!inst.seizedDate) return false;
            const date = new Date(inst.seizedDate);
            return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        });
    }

    // Apply search filter
    if (searchTerm) {
        seizedInstallments = seizedInstallments.filter(inst => {
            return inst.brand.toLowerCase().includes(searchTerm) ||
                   inst.model.toLowerCase().includes(searchTerm) ||
                   inst.customerName.toLowerCase().includes(searchTerm) ||
                   inst.customerPhone.includes(searchTerm) ||
                   inst.imei.toLowerCase().includes(searchTerm);
        });
    }

    displayInstallments(seizedInstallments, 'installmentSeizedTableBody', 'seized');
}

// Initialize date filter for installment
function initializeInstallmentDateFilter() {
    const monthSelect = document.getElementById('filterInstallmentMonth');
    const yearSelect = document.getElementById('filterInstallmentYear');

    if (!monthSelect || !yearSelect) return;

    // Populate months
    const thaiMonthsShort = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    for (let i = 0; i < 12; i++) {
        const option = document.createElement('option');
        option.value = i + 1;
        option.textContent = thaiMonthsShort[i];
        monthSelect.appendChild(option);
    }

    // Populate years
    const currentYear = new Date().getFullYear();
    for (let year = currentYear + 543 + 1; year >= currentYear + 543 - 3; year--) {
        const option = document.createElement('option');
        option.value = year - 543;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

let currentInstallmentFilter = { month: '', year: '' };

// Filter installment by date
function filterInstallmentByDate() {
    const monthSelect = document.getElementById('filterInstallmentMonth');
    const yearSelect = document.getElementById('filterInstallmentYear');

    currentInstallmentFilter.month = monthSelect.value;
    currentInstallmentFilter.year = yearSelect.value;

    // Active: Show current data always (no date filter)
    const activeInstallments = installmentDevices.filter(i => i.store === currentStore && i.status === 'active');
    displayInstallments(activeInstallments, 'installmentActiveTableBody', 'active');

    // Completed: Filter by completedDate
    let completedInstallments = installmentDevices.filter(i => i.store === currentStore && i.status === 'completed');

    if (currentInstallmentFilter.month || currentInstallmentFilter.year) {
        completedInstallments = completedInstallments.filter(inst => {
            if (!inst.completedDate) return false;
            const date = new Date(inst.completedDate);
            const instMonth = date.getMonth() + 1;
            const instYear = date.getFullYear();

            const monthMatch = !currentInstallmentFilter.month || instMonth == currentInstallmentFilter.month;
            const yearMatch = !currentInstallmentFilter.year || instYear == currentInstallmentFilter.year;

            return monthMatch && yearMatch;
        });
    } else {
        // Show only current month if no filter is applied
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        completedInstallments = completedInstallments.filter(inst => {
            if (!inst.completedDate) return false;
            const date = new Date(inst.completedDate);
            return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        });
    }

    displayInstallments(completedInstallments, 'installmentCompletedTableBody', 'completed');

    // Seized: Filter by seizedDate
    let seizedInstallments = installmentDevices.filter(i => i.store === currentStore && i.status === 'seized');

    if (currentInstallmentFilter.month || currentInstallmentFilter.year) {
        seizedInstallments = seizedInstallments.filter(inst => {
            if (!inst.seizedDate) return false;
            const date = new Date(inst.seizedDate);
            const instMonth = date.getMonth() + 1;
            const instYear = date.getFullYear();

            const monthMatch = !currentInstallmentFilter.month || instMonth == currentInstallmentFilter.month;
            const yearMatch = !currentInstallmentFilter.year || instYear == currentInstallmentFilter.year;

            return monthMatch && yearMatch;
        });
    } else {
        // Show only current month if no filter is applied
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        seizedInstallments = seizedInstallments.filter(inst => {
            if (!inst.seizedDate) return false;
            const date = new Date(inst.seizedDate);
            return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        });
    }

    displayInstallments(seizedInstallments, 'installmentSeizedTableBody', 'seized');
}

// Clear installment filter
function clearInstallmentFilter() {
    document.getElementById('filterInstallmentMonth').value = '';
    document.getElementById('filterInstallmentYear').value = '';
    currentInstallmentFilter = { month: '', year: '' };
    loadInstallmentData();
}

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const installmentModal = document.getElementById('installmentModal');
    const paymentModal = document.getElementById('paymentModal');
    const historyModal = document.getElementById('historyModal');

    if (event.target === installmentModal) {
        closeInstallmentModal();
    }
    if (event.target === paymentModal) {
        closePaymentModal();
    }
    if (event.target === historyModal) {
        closeHistoryModal();
    }
});

// ===== PAWN DEVICES (ขายฝาก) =====

// Mock data for pawn devices
const pawnDevicesMockData = [
    // ร้านศาลายา - ขายฝากอยู่
    {
        id: 'P1001',
        brand: 'Apple',
        model: 'iPhone 14 Pro',
        color: 'Deep Purple',
        imei: '358234567895001',
        ram: '6',
        rom: '256',
        pawnAmount: 25000,
        interest: 500,
        receiveDate: '2025-09-25',
        dueDate: '2025-10-10',
        returnDate: null,
        seizedDate: null,
        note: '',
        status: 'active',
        store: 'salaya',
        createdAt: '2025-09-25T09:00:00Z'
    },
    {
        id: 'P1002',
        brand: 'Samsung',
        model: 'Galaxy S23 Ultra',
        color: 'Phantom Black',
        imei: '358234567895002',
        ram: '12',
        rom: '512',
        pawnAmount: 28000,
        interest: 600,
        receiveDate: '2025-09-28',
        dueDate: '2025-10-13',
        returnDate: null,
        seizedDate: null,
        note: 'ลูกค้าประจำ',
        status: 'active',
        store: 'salaya',
        createdAt: '2025-09-28T10:30:00Z'
    },
    {
        id: 'P1003',
        brand: 'Xiaomi',
        model: '13 Pro',
        color: 'Ceramic White',
        imei: '358234567895003',
        ram: '12',
        rom: '256',
        pawnAmount: 18000,
        interest: 400,
        receiveDate: '2025-10-01',
        dueDate: '2025-10-16',
        returnDate: null,
        seizedDate: null,
        note: '',
        status: 'active',
        store: 'salaya',
        createdAt: '2025-10-01T14:00:00Z'
    },

    // ร้านศาลายา - รับเครื่องคืน
    {
        id: 'P1004',
        brand: 'OPPO',
        model: 'Find X6 Pro',
        color: 'Black',
        imei: '358234567895004',
        ram: '16',
        rom: '512',
        pawnAmount: 22000,
        interest: 500,
        receiveDate: '2025-09-15',
        dueDate: '2025-09-30',
        returnDate: '2025-09-29',
        seizedDate: null,
        note: 'รับคืนตรงเวลา',
        status: 'returned',
        store: 'salaya',
        createdAt: '2025-09-15T11:00:00Z'
    },
    {
        id: 'P1005',
        brand: 'Vivo',
        model: 'X90 Pro',
        color: 'Legend Black',
        imei: '358234567895005',
        ram: '12',
        rom: '256',
        pawnAmount: 20000,
        interest: 450,
        receiveDate: '2025-09-18',
        dueDate: '2025-10-03',
        returnDate: '2025-10-02',
        seizedDate: null,
        note: '',
        status: 'returned',
        store: 'salaya',
        createdAt: '2025-09-18T13:30:00Z'
    },

    // ร้านศาลายา - ยึดเครื่อง
    {
        id: 'P1006',
        brand: 'Apple',
        model: 'iPhone 13',
        color: 'Midnight',
        imei: '358234567895006',
        ram: '4',
        rom: '128',
        pawnAmount: 18000,
        interest: 400,
        receiveDate: '2025-08-20',
        dueDate: '2025-09-04',
        returnDate: null,
        seizedDate: '2025-09-15',
        note: 'เกินกำหนด 11 วัน ติดต่อไม่ได้',
        status: 'seized',
        store: 'salaya',
        createdAt: '2025-08-20T10:00:00Z'
    },

    // ร้านคลองโยง - ขายฝากอยู่
    {
        id: 'P2001',
        brand: 'Samsung',
        model: 'Galaxy A54',
        color: 'Awesome Violet',
        imei: '358234567895101',
        ram: '8',
        rom: '256',
        pawnAmount: 12000,
        interest: 300,
        receiveDate: '2025-09-30',
        dueDate: '2025-10-15',
        returnDate: null,
        seizedDate: null,
        note: '',
        status: 'active',
        store: 'klongyong',
        createdAt: '2025-09-30T11:00:00Z'
    },
    {
        id: 'P2002',
        brand: 'Realme',
        model: 'GT Neo 5',
        color: 'Electric Purple',
        imei: '358234567895102',
        ram: '12',
        rom: '256',
        pawnAmount: 10000,
        interest: 250,
        receiveDate: '2025-10-02',
        dueDate: '2025-10-17',
        returnDate: null,
        seizedDate: null,
        note: '',
        status: 'active',
        store: 'klongyong',
        createdAt: '2025-10-02T09:30:00Z'
    },

    // ร้านคลองโยง - รับเครื่องคืน
    {
        id: 'P2003',
        brand: 'OPPO',
        model: 'Reno10 Pro',
        color: 'Silvery Grey',
        imei: '358234567895103',
        ram: '12',
        rom: '256',
        pawnAmount: 14000,
        interest: 350,
        receiveDate: '2025-09-20',
        dueDate: '2025-10-05',
        returnDate: '2025-10-04',
        seizedDate: null,
        note: 'ต่อดอก 1 ครั้งแล้ว',
        status: 'returned',
        store: 'klongyong',
        createdAt: '2025-09-20T14:00:00Z'
    },

    // ร้านคลองโยง - ยึดเครื่อง
    {
        id: 'P2004',
        brand: 'Xiaomi',
        model: 'Redmi Note 12 Pro',
        color: 'Midnight Black',
        imei: '358234567895104',
        ram: '8',
        rom: '256',
        pawnAmount: 8000,
        interest: 200,
        receiveDate: '2025-08-25',
        dueDate: '2025-09-09',
        returnDate: null,
        seizedDate: '2025-09-20',
        note: 'ติดต่อไม่ได้',
        status: 'seized',
        store: 'klongyong',
        createdAt: '2025-08-25T10:15:00Z'
    }
];

// Data storage for pawn devices
let pawnDevices = [];

// Initialize pawn devices database
function initializePawnDatabase() {
    const storedData = localStorage.getItem('pawnDevices');
    if (!storedData) {
        pawnDevices = [...pawnDevicesMockData];
        localStorage.setItem('pawnDevices', JSON.stringify(pawnDevices));
        console.log('✅ เริ่มต้นฐานข้อมูลขายฝากสำเร็จ');
        console.log(`📊 มีข้อมูลทั้งหมด ${pawnDevices.length} รายการ`);
    } else {
        pawnDevices = JSON.parse(storedData);
        console.log('✅ โหลดข้อมูลขายฝากจาก localStorage สำเร็จ');
        console.log(`📊 มีข้อมูลทั้งหมด ${pawnDevices.length} รายการ`);
    }
}

let currentPawnEditId = null;

// ===== PAWN DEVICES CRUD FUNCTIONS =====

// Initialize pawn tabs
function initializePawnTabs() {
    const tabButtons = document.querySelectorAll('#pawn .tab-btn');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');

            // Remove active class from all pawn tabs and contents
            document.querySelectorAll('#pawn .tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('#pawn .tab-content').forEach(content => content.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(tabName + '-tab').classList.add('active');
        });
    });
}

// Open pawn modal for adding/editing
function openPawnModal(pawnId = null) {
    const modal = document.getElementById('pawnModal');
    const modalTitle = document.getElementById('pawnModalTitle');
    const form = document.getElementById('pawnForm');

    form.reset();
    currentPawnEditId = pawnId;

    if (pawnId) {
        // Edit mode
        modalTitle.textContent = 'แก้ไขรายการขายฝาก';
        const pawn = pawnDevices.find(p => p.id === pawnId);
        if (pawn) {
            document.getElementById('pawnBrand').value = pawn.brand;
            document.getElementById('pawnModel').value = pawn.model;
            document.getElementById('pawnColor').value = pawn.color;
            document.getElementById('pawnImei').value = pawn.imei;
            document.getElementById('pawnRam').value = pawn.ram;
            document.getElementById('pawnRom').value = pawn.rom;
            document.getElementById('pawnAmount').value = pawn.pawnAmount;
            document.getElementById('pawnInterest').value = pawn.interest;
            document.getElementById('pawnReceiveDate').value = pawn.receiveDate;
            document.getElementById('pawnDueDate').value = pawn.dueDate;
            document.getElementById('pawnNote').value = pawn.note || '';
        }
    } else {
        // Add mode
        modalTitle.textContent = 'เพิ่มรายการขายฝาก';
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('pawnReceiveDate').value = today;
        updatePawnDueDate();
    }

    modal.classList.add('show');
}

// Close pawn modal
function closePawnModal() {
    const modal = document.getElementById('pawnModal');
    modal.classList.remove('show');
    currentPawnEditId = null;
}

// Update pawn due date (+15 days from receive date)
function updatePawnDueDate() {
    const receiveDateInput = document.getElementById('pawnReceiveDate');
    const dueDateInput = document.getElementById('pawnDueDate');

    if (receiveDateInput.value) {
        const receiveDate = new Date(receiveDateInput.value);
        receiveDate.setDate(receiveDate.getDate() + 15);
        dueDateInput.value = receiveDate.toISOString().split('T')[0];
    }
}

// Save pawn (add or update)
function savePawn(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const pawn = {
        id: currentPawnEditId || ('P' + Date.now().toString()),
        brand: formData.get('brand'),
        model: formData.get('model'),
        color: formData.get('color'),
        imei: formData.get('imei'),
        ram: formData.get('ram'),
        rom: formData.get('rom'),
        pawnAmount: parseInt(formData.get('pawnAmount')),
        interest: parseInt(formData.get('interest')),
        receiveDate: formData.get('receiveDate'),
        dueDate: formData.get('dueDate'),
        returnDate: currentPawnEditId ? pawnDevices.find(p => p.id === currentPawnEditId).returnDate : null,
        seizedDate: currentPawnEditId ? pawnDevices.find(p => p.id === currentPawnEditId).seizedDate : null,
        note: formData.get('note') || '',
        status: currentPawnEditId ? pawnDevices.find(p => p.id === currentPawnEditId).status : 'active',
        store: currentStore,
        createdAt: currentPawnEditId ? pawnDevices.find(p => p.id === currentPawnEditId).createdAt : new Date().toISOString()
    };

    if (currentPawnEditId) {
        // Update existing pawn
        const index = pawnDevices.findIndex(p => p.id === currentPawnEditId);
        pawnDevices[index] = pawn;
    } else {
        // Add new pawn
        pawnDevices.push(pawn);
    }

    // Save to localStorage
    localStorage.setItem('pawnDevices', JSON.stringify(pawnDevices));

    // Reload data
    loadPawnData();

    // Close modal
    closePawnModal();

    // Show success message
    showNotification(currentPawnEditId ? 'บันทึกข้อมูลสำเร็จ' : 'เพิ่มรายการขายฝากสำเร็จ');
}

// Load and display pawn data
function loadPawnData() {
    // Active: Show current data always (no date filter)
    const activePawns = pawnDevices.filter(p => p.store === currentStore && p.status === 'active');
    displayPawns(activePawns, 'pawnActiveTableBody', 'active');

    // Returned: Filter by returnDate (current month by default)
    let returnedPawns = pawnDevices.filter(p => p.store === currentStore && p.status === 'returned');

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    returnedPawns = returnedPawns.filter(pawn => {
        if (!pawn.returnDate) return false;
        const date = new Date(pawn.returnDate);
        return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
    });

    displayPawns(returnedPawns, 'pawnReturnedTableBody', 'returned');

    // Seized: Filter by seizedDate (current month by default)
    let seizedPawns = pawnDevices.filter(p => p.store === currentStore && p.status === 'seized');

    seizedPawns = seizedPawns.filter(pawn => {
        if (!pawn.seizedDate) return false;
        const date = new Date(pawn.seizedDate);
        return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
    });

    displayPawns(seizedPawns, 'pawnSeizedTableBody', 'seized');

    // Update tab counts
    updatePawnTabCounts();

    // Update dashboard stats
    updateDashboard();
}

// Display pawns in table
function displayPawns(pawns, tableBodyId, type) {
    const tbody = document.getElementById(tableBodyId);

    if (!tbody) return;

    if (pawns.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" class="empty-state">ไม่มีข้อมูล</td></tr>`;
        return;
    }

    tbody.innerHTML = pawns.map(pawn => {
        const ramRom = `${pawn.ram}/${pawn.rom} GB`;

        if (type === 'active') {
            return `
                <tr>
                    <td>${pawn.brand}</td>
                    <td>${pawn.model}</td>
                    <td>${pawn.color}</td>
                    <td>${pawn.imei}</td>
                    <td>${ramRom}</td>
                    <td>${formatCurrency(pawn.pawnAmount)}</td>
                    <td>${formatCurrency(pawn.interest)}</td>
                    <td>${formatDate(pawn.receiveDate)}</td>
                    <td>${formatDate(pawn.dueDate)}</td>
                    <td>
                        <button class="action-btn btn-edit" onclick="openPawnModal('${pawn.id}')">แก้ไข</button>
                        <button class="action-btn btn-warning" onclick="renewPawn('${pawn.id}')">ต่อดอก</button>
                        <button class="action-btn btn-success" onclick="returnPawn('${pawn.id}')">รับเครื่อง</button>
                        <button class="action-btn btn-remove" onclick="seizePawn('${pawn.id}')">ยึดเครื่อง</button>
                        <button class="action-btn btn-delete" onclick="deletePawn('${pawn.id}')">ลบ</button>
                    </td>
                </tr>
            `;
        } else if (type === 'returned') {
            return `
                <tr>
                    <td>${pawn.brand}</td>
                    <td>${pawn.model}</td>
                    <td>${pawn.color}</td>
                    <td>${pawn.imei}</td>
                    <td>${ramRom}</td>
                    <td>${formatCurrency(pawn.pawnAmount)}</td>
                    <td>${formatCurrency(pawn.interest)}</td>
                    <td>${formatDate(pawn.receiveDate)}</td>
                    <td>${formatDate(pawn.returnDate)}</td>
                    <td>
                        <button class="action-btn btn-edit" onclick="openPawnModal('${pawn.id}')">แก้ไข</button>
                        <button class="action-btn btn-delete" onclick="deletePawn('${pawn.id}')">ลบ</button>
                    </td>
                </tr>
            `;
        } else if (type === 'seized') {
            return `
                <tr>
                    <td>${pawn.brand}</td>
                    <td>${pawn.model}</td>
                    <td>${pawn.color}</td>
                    <td>${pawn.imei}</td>
                    <td>${ramRom}</td>
                    <td>${formatCurrency(pawn.pawnAmount)}</td>
                    <td>${formatCurrency(pawn.interest)}</td>
                    <td>${formatDate(pawn.receiveDate)}</td>
                    <td>${formatDate(pawn.seizedDate)}</td>
                    <td>
                        <button class="action-btn btn-edit" onclick="openPawnModal('${pawn.id}')">แก้ไข</button>
                        <button class="action-btn btn-delete" onclick="deletePawn('${pawn.id}')">ลบ</button>
                    </td>
                </tr>
            `;
        }
    }).join('');
}

// Renew pawn (extend due date by 15 days)
function renewPawn(pawnId) {
    if (confirm('ต้องการต่อดอกใช่หรือไม่? (วันครบกำหนดจะเพิ่มอีก 15 วัน)')) {
        const pawn = pawnDevices.find(p => p.id === pawnId);
        if (pawn) {
            const currentDueDate = new Date(pawn.dueDate);
            currentDueDate.setDate(currentDueDate.getDate() + 15);
            pawn.dueDate = currentDueDate.toISOString().split('T')[0];

            localStorage.setItem('pawnDevices', JSON.stringify(pawnDevices));
            loadPawnData();
            showNotification('ต่อดอกสำเร็จ วันครบกำหนดใหม่: ' + formatDate(pawn.dueDate));
        }
    }
}

// Return pawn (customer picks up device)
function returnPawn(pawnId) {
    if (confirm('ลูกค้ามารับเครื่องคืนใช่หรือไม่?')) {
        const pawn = pawnDevices.find(p => p.id === pawnId);
        if (pawn) {
            pawn.status = 'returned';
            pawn.returnDate = new Date().toISOString().split('T')[0];

            localStorage.setItem('pawnDevices', JSON.stringify(pawnDevices));
            loadPawnData();
            showNotification('บันทึกรับเครื่องคืนสำเร็จ');
        }
    }
}

// Seize pawn (confiscate device)
function seizePawn(pawnId) {
    if (confirm('ต้องการยึดเครื่องใช่หรือไม่?')) {
        const pawn = pawnDevices.find(p => p.id === pawnId);
        if (pawn) {
            pawn.status = 'seized';
            pawn.seizedDate = new Date().toISOString().split('T')[0];

            localStorage.setItem('pawnDevices', JSON.stringify(pawnDevices));
            loadPawnData();
            showNotification('บันทึกยึดเครื่องสำเร็จ');
        }
    }
}

// Delete pawn
function deletePawn(pawnId) {
    if (confirm('ต้องการลบข้อมูลนี้หรือไม่? (ไม่สามารถกู้คืนได้)')) {
        pawnDevices = pawnDevices.filter(p => p.id !== pawnId);
        localStorage.setItem('pawnDevices', JSON.stringify(pawnDevices));
        loadPawnData();
        showNotification('ลบข้อมูลสำเร็จ');
    }
}

// Update pawn tab counts
function updatePawnTabCounts() {
    const storePawns = pawnDevices.filter(p => p.store === currentStore);

    // Count pawns by status
    const activeCount = storePawns.filter(p => p.status === 'active').length;
    const returnedCount = storePawns.filter(p => p.status === 'returned').length;
    const seizedCount = storePawns.filter(p => p.status === 'seized').length;

    // Update tab counts
    const activeCountElement = document.getElementById('pawnActiveCount');
    const returnedCountElement = document.getElementById('pawnReturnedCount');
    const seizedCountElement = document.getElementById('pawnSeizedCount');

    if (activeCountElement) activeCountElement.textContent = activeCount;
    if (returnedCountElement) returnedCountElement.textContent = returnedCount;
    if (seizedCountElement) seizedCountElement.textContent = seizedCount;
}

// Initialize pawn search
function initializePawnSearch() {
    const searchInput = document.getElementById('searchPawn');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filterPawns(searchTerm);
        });
    }
}

// Filter pawns based on search term
function filterPawns(searchTerm) {
    // Active: Show current data always (no date filter)
    let activePawns = pawnDevices.filter(p => p.store === currentStore && p.status === 'active');

    // Apply search filter
    if (searchTerm) {
        activePawns = activePawns.filter(pawn => {
            return pawn.brand.toLowerCase().includes(searchTerm) ||
                   pawn.model.toLowerCase().includes(searchTerm) ||
                   pawn.color.toLowerCase().includes(searchTerm) ||
                   pawn.imei.toLowerCase().includes(searchTerm) ||
                   `${pawn.ram}/${pawn.rom}`.includes(searchTerm);
        });
    }

    displayPawns(activePawns, 'pawnActiveTableBody', 'active');

    // Returned: Filter by date and search
    let returnedPawns = pawnDevices.filter(p => p.store === currentStore && p.status === 'returned');

    // Apply date filter
    if (currentPawnFilter.month || currentPawnFilter.year) {
        returnedPawns = returnedPawns.filter(pawn => {
            if (!pawn.returnDate) return false;
            const date = new Date(pawn.returnDate);
            const pawnMonth = date.getMonth() + 1;
            const pawnYear = date.getFullYear();

            const monthMatch = !currentPawnFilter.month || pawnMonth == currentPawnFilter.month;
            const yearMatch = !currentPawnFilter.year || pawnYear == currentPawnFilter.year;

            return monthMatch && yearMatch;
        });
    } else {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        returnedPawns = returnedPawns.filter(pawn => {
            if (!pawn.returnDate) return false;
            const date = new Date(pawn.returnDate);
            return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        });
    }

    // Apply search filter
    if (searchTerm) {
        returnedPawns = returnedPawns.filter(pawn => {
            return pawn.brand.toLowerCase().includes(searchTerm) ||
                   pawn.model.toLowerCase().includes(searchTerm) ||
                   pawn.color.toLowerCase().includes(searchTerm) ||
                   pawn.imei.toLowerCase().includes(searchTerm) ||
                   `${pawn.ram}/${pawn.rom}`.includes(searchTerm);
        });
    }

    displayPawns(returnedPawns, 'pawnReturnedTableBody', 'returned');

    // Seized: Filter by date and search
    let seizedPawns = pawnDevices.filter(p => p.store === currentStore && p.status === 'seized');

    // Apply date filter
    if (currentPawnFilter.month || currentPawnFilter.year) {
        seizedPawns = seizedPawns.filter(pawn => {
            if (!pawn.seizedDate) return false;
            const date = new Date(pawn.seizedDate);
            const pawnMonth = date.getMonth() + 1;
            const pawnYear = date.getFullYear();

            const monthMatch = !currentPawnFilter.month || pawnMonth == currentPawnFilter.month;
            const yearMatch = !currentPawnFilter.year || pawnYear == currentPawnFilter.year;

            return monthMatch && yearMatch;
        });
    } else {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        seizedPawns = seizedPawns.filter(pawn => {
            if (!pawn.seizedDate) return false;
            const date = new Date(pawn.seizedDate);
            return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        });
    }

    // Apply search filter
    if (searchTerm) {
        seizedPawns = seizedPawns.filter(pawn => {
            return pawn.brand.toLowerCase().includes(searchTerm) ||
                   pawn.model.toLowerCase().includes(searchTerm) ||
                   pawn.color.toLowerCase().includes(searchTerm) ||
                   pawn.imei.toLowerCase().includes(searchTerm) ||
                   `${pawn.ram}/${pawn.rom}`.includes(searchTerm);
        });
    }

    displayPawns(seizedPawns, 'pawnSeizedTableBody', 'seized');
}

// Initialize date filter for pawn
function initializePawnDateFilter() {
    const monthSelect = document.getElementById('filterPawnMonth');
    const yearSelect = document.getElementById('filterPawnYear');

    if (!monthSelect || !yearSelect) return;

    // Populate months
    const thaiMonthsShort = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    for (let i = 0; i < 12; i++) {
        const option = document.createElement('option');
        option.value = i + 1;
        option.textContent = thaiMonthsShort[i];
        monthSelect.appendChild(option);
    }

    // Populate years
    const currentYear = new Date().getFullYear();
    for (let year = currentYear + 543 + 1; year >= currentYear + 543 - 3; year--) {
        const option = document.createElement('option');
        option.value = year - 543;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

let currentPawnFilter = { month: '', year: '' };

// Filter pawn by date
function filterPawnByDate() {
    const monthSelect = document.getElementById('filterPawnMonth');
    const yearSelect = document.getElementById('filterPawnYear');

    currentPawnFilter.month = monthSelect.value;
    currentPawnFilter.year = yearSelect.value;

    // Active: Show current data always (no date filter)
    const activePawns = pawnDevices.filter(p => p.store === currentStore && p.status === 'active');
    displayPawns(activePawns, 'pawnActiveTableBody', 'active');

    // Returned: Filter by returnDate
    let returnedPawns = pawnDevices.filter(p => p.store === currentStore && p.status === 'returned');

    if (currentPawnFilter.month || currentPawnFilter.year) {
        returnedPawns = returnedPawns.filter(pawn => {
            if (!pawn.returnDate) return false;
            const date = new Date(pawn.returnDate);
            const pawnMonth = date.getMonth() + 1;
            const pawnYear = date.getFullYear();

            const monthMatch = !currentPawnFilter.month || pawnMonth == currentPawnFilter.month;
            const yearMatch = !currentPawnFilter.year || pawnYear == currentPawnFilter.year;

            return monthMatch && yearMatch;
        });
    } else {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        returnedPawns = returnedPawns.filter(pawn => {
            if (!pawn.returnDate) return false;
            const date = new Date(pawn.returnDate);
            return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        });
    }

    displayPawns(returnedPawns, 'pawnReturnedTableBody', 'returned');

    // Seized: Filter by seizedDate
    let seizedPawns = pawnDevices.filter(p => p.store === currentStore && p.status === 'seized');

    if (currentPawnFilter.month || currentPawnFilter.year) {
        seizedPawns = seizedPawns.filter(pawn => {
            if (!pawn.seizedDate) return false;
            const date = new Date(pawn.seizedDate);
            const pawnMonth = date.getMonth() + 1;
            const pawnYear = date.getFullYear();

            const monthMatch = !currentPawnFilter.month || pawnMonth == currentPawnFilter.month;
            const yearMatch = !currentPawnFilter.year || pawnYear == currentPawnFilter.year;

            return monthMatch && yearMatch;
        });
    } else {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        seizedPawns = seizedPawns.filter(pawn => {
            if (!pawn.seizedDate) return false;
            const date = new Date(pawn.seizedDate);
            return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        });
    }

    displayPawns(seizedPawns, 'pawnSeizedTableBody', 'seized');
}

// Clear pawn filter
function clearPawnFilter() {
    document.getElementById('filterPawnMonth').value = '';
    document.getElementById('filterPawnYear').value = '';
    currentPawnFilter = { month: '', year: '' };
    loadPawnData();
}

// Close pawn modal when clicking outside
window.addEventListener('click', function(event) {
    const pawnModal = document.getElementById('pawnModal');
    if (event.target === pawnModal) {
        closePawnModal();
    }
});

// ===== DATE FILTER FUNCTIONS =====

let currentNewDevicesFilter = { month: '', year: '' };
let currentUsedDevicesFilter = { month: '', year: '' };

// Initialize date filter dropdowns for new devices
function initializeNewDevicesDateFilter() {
    const monthSelect = document.getElementById('filterNewDevicesMonth');
    const yearSelect = document.getElementById('filterNewDevicesYear');

    if (!monthSelect || !yearSelect) return;

    // Populate months
    const thaiMonthsShort = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    for (let i = 0; i < 12; i++) {
        const option = document.createElement('option');
        option.value = i + 1;
        option.textContent = thaiMonthsShort[i];
        monthSelect.appendChild(option);
    }

    // Populate years (last 3 years + current year + next year)
    const currentYear = new Date().getFullYear();
    for (let year = currentYear + 543 + 1; year >= currentYear + 543 - 3; year--) {
        const option = document.createElement('option');
        option.value = year - 543;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

// Filter new devices by date
function filterNewDevicesByDate() {
    const monthSelect = document.getElementById('filterNewDevicesMonth');
    const yearSelect = document.getElementById('filterNewDevicesYear');

    currentNewDevicesFilter.month = monthSelect.value;
    currentNewDevicesFilter.year = yearSelect.value;

    applyNewDevicesFilter();
}

// Apply filter to new devices
function applyNewDevicesFilter() {
    const searchTerm = document.getElementById('searchNewDevices').value.toLowerCase();

    // Stock: Show current data always (no date filter)
    let stockDevices = newDevices.filter(d => d.store === currentStore && d.status === 'stock');

    // Apply search filter for stock
    if (searchTerm) {
        stockDevices = stockDevices.filter(device => {
            return device.brand.toLowerCase().includes(searchTerm) ||
                   device.model.toLowerCase().includes(searchTerm) ||
                   device.color.toLowerCase().includes(searchTerm) ||
                   device.imei.toLowerCase().includes(searchTerm) ||
                   (device.ram + '/' + device.rom).includes(searchTerm);
        });
    }

    // Sold: Filter by saleDate based on selected month/year
    let soldDevices = newDevices.filter(d => d.store === currentStore && d.status === 'sold');

    // Apply date filter for sold devices
    if (currentNewDevicesFilter.month || currentNewDevicesFilter.year) {
        soldDevices = soldDevices.filter(device => {
            if (!device.saleDate) return false;
            const date = new Date(device.saleDate);
            const deviceMonth = date.getMonth() + 1;
            const deviceYear = date.getFullYear();

            const monthMatch = !currentNewDevicesFilter.month || deviceMonth == currentNewDevicesFilter.month;
            const yearMatch = !currentNewDevicesFilter.year || deviceYear == currentNewDevicesFilter.year;

            return monthMatch && yearMatch;
        });
    } else {
        // Show only current month if no filter is applied
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        soldDevices = soldDevices.filter(device => {
            if (!device.saleDate) return false;
            const date = new Date(device.saleDate);
            return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        });
    }

    // Apply search filter for sold
    if (searchTerm) {
        soldDevices = soldDevices.filter(device => {
            return device.brand.toLowerCase().includes(searchTerm) ||
                   device.model.toLowerCase().includes(searchTerm) ||
                   device.color.toLowerCase().includes(searchTerm) ||
                   device.imei.toLowerCase().includes(searchTerm) ||
                   (device.ram + '/' + device.rom).includes(searchTerm);
        });
    }

    // Removed: Filter by saleDate based on selected month/year
    let removedDevices = newDevices.filter(d => d.store === currentStore && d.status === 'removed');

    // Apply date filter for removed devices
    if (currentNewDevicesFilter.month || currentNewDevicesFilter.year) {
        removedDevices = removedDevices.filter(device => {
            if (!device.saleDate) return false;
            const date = new Date(device.saleDate);
            const deviceMonth = date.getMonth() + 1;
            const deviceYear = date.getFullYear();

            const monthMatch = !currentNewDevicesFilter.month || deviceMonth == currentNewDevicesFilter.month;
            const yearMatch = !currentNewDevicesFilter.year || deviceYear == currentNewDevicesFilter.year;

            return monthMatch && yearMatch;
        });
    } else {
        // Show only current month if no filter is applied
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        removedDevices = removedDevices.filter(device => {
            if (!device.saleDate) return false;
            const date = new Date(device.saleDate);
            return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        });
    }

    // Apply search filter for removed
    if (searchTerm) {
        removedDevices = removedDevices.filter(device => {
            return device.brand.toLowerCase().includes(searchTerm) ||
                   device.model.toLowerCase().includes(searchTerm) ||
                   device.color.toLowerCase().includes(searchTerm) ||
                   device.imei.toLowerCase().includes(searchTerm) ||
                   (device.ram + '/' + device.rom).includes(searchTerm);
        });
    }

    // Display filtered results
    displayDevices(stockDevices, 'stockTableBody', 'stock');
    displayDevices(soldDevices, 'soldTableBody', 'sold');
    displayDevices(removedDevices, 'removedTableBody', 'removed');
}

// Clear new devices filter
function clearNewDevicesFilter() {
    document.getElementById('filterNewDevicesMonth').value = '';
    document.getElementById('filterNewDevicesYear').value = '';
    currentNewDevicesFilter = { month: '', year: '' };
    applyNewDevicesFilter();
}

// Initialize date filter dropdowns for used devices
function initializeUsedDevicesDateFilter() {
    const monthSelect = document.getElementById('filterUsedDevicesMonth');
    const yearSelect = document.getElementById('filterUsedDevicesYear');

    if (!monthSelect || !yearSelect) return;

    // Populate months
    const thaiMonthsShort = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    for (let i = 0; i < 12; i++) {
        const option = document.createElement('option');
        option.value = i + 1;
        option.textContent = thaiMonthsShort[i];
        monthSelect.appendChild(option);
    }

    // Populate years (last 3 years + current year + next year)
    const currentYear = new Date().getFullYear();
    for (let year = currentYear + 543 + 1; year >= currentYear + 543 - 3; year--) {
        const option = document.createElement('option');
        option.value = year - 543;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

// Filter used devices by date
function filterUsedDevicesByDate() {
    const monthSelect = document.getElementById('filterUsedDevicesMonth');
    const yearSelect = document.getElementById('filterUsedDevicesYear');

    currentUsedDevicesFilter.month = monthSelect.value;
    currentUsedDevicesFilter.year = yearSelect.value;

    applyUsedDevicesFilter();
}

// Apply filter to used devices
function applyUsedDevicesFilter() {
    const searchTerm = document.getElementById('searchUsedDevices').value.toLowerCase();

    // Stock: Show current data always (no date filter)
    let stockDevices = usedDevices.filter(d => d.store === currentStore && d.status === 'stock');

    // Apply search filter for stock
    if (searchTerm) {
        stockDevices = stockDevices.filter(device => {
            return device.brand.toLowerCase().includes(searchTerm) ||
                   device.model.toLowerCase().includes(searchTerm) ||
                   device.color.toLowerCase().includes(searchTerm) ||
                   device.imei.toLowerCase().includes(searchTerm) ||
                   device.condition.toLowerCase().includes(searchTerm) ||
                   (device.ram + '/' + device.rom).includes(searchTerm);
        });
    }

    // Sold: Filter by saleDate based on selected month/year
    let soldDevices = usedDevices.filter(d => d.store === currentStore && d.status === 'sold');

    // Apply date filter for sold devices
    if (currentUsedDevicesFilter.month || currentUsedDevicesFilter.year) {
        soldDevices = soldDevices.filter(device => {
            if (!device.saleDate) return false;
            const date = new Date(device.saleDate);
            const deviceMonth = date.getMonth() + 1;
            const deviceYear = date.getFullYear();

            const monthMatch = !currentUsedDevicesFilter.month || deviceMonth == currentUsedDevicesFilter.month;
            const yearMatch = !currentUsedDevicesFilter.year || deviceYear == currentUsedDevicesFilter.year;

            return monthMatch && yearMatch;
        });
    } else {
        // Show only current month if no filter is applied
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        soldDevices = soldDevices.filter(device => {
            if (!device.saleDate) return false;
            const date = new Date(device.saleDate);
            return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        });
    }

    // Apply search filter for sold
    if (searchTerm) {
        soldDevices = soldDevices.filter(device => {
            return device.brand.toLowerCase().includes(searchTerm) ||
                   device.model.toLowerCase().includes(searchTerm) ||
                   device.color.toLowerCase().includes(searchTerm) ||
                   device.imei.toLowerCase().includes(searchTerm) ||
                   device.condition.toLowerCase().includes(searchTerm) ||
                   (device.ram + '/' + device.rom).includes(searchTerm);
        });
    }

    // Removed: Filter by saleDate based on selected month/year
    let removedDevices = usedDevices.filter(d => d.store === currentStore && d.status === 'removed');

    // Apply date filter for removed devices
    if (currentUsedDevicesFilter.month || currentUsedDevicesFilter.year) {
        removedDevices = removedDevices.filter(device => {
            if (!device.saleDate) return false;
            const date = new Date(device.saleDate);
            const deviceMonth = date.getMonth() + 1;
            const deviceYear = date.getFullYear();

            const monthMatch = !currentUsedDevicesFilter.month || deviceMonth == currentUsedDevicesFilter.month;
            const yearMatch = !currentUsedDevicesFilter.year || deviceYear == currentUsedDevicesFilter.year;

            return monthMatch && yearMatch;
        });
    } else {
        // Show only current month if no filter is applied
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        removedDevices = removedDevices.filter(device => {
            if (!device.saleDate) return false;
            const date = new Date(device.saleDate);
            return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        });
    }

    // Apply search filter for removed
    if (searchTerm) {
        removedDevices = removedDevices.filter(device => {
            return device.brand.toLowerCase().includes(searchTerm) ||
                   device.model.toLowerCase().includes(searchTerm) ||
                   device.color.toLowerCase().includes(searchTerm) ||
                   device.imei.toLowerCase().includes(searchTerm) ||
                   device.condition.toLowerCase().includes(searchTerm) ||
                   (device.ram + '/' + device.rom).includes(searchTerm);
        });
    }

    // Display filtered results
    displayUsedDevices(stockDevices, 'usedStockTableBody', 'stock');
    displayUsedDevices(soldDevices, 'usedSoldTableBody', 'sold');
    displayUsedDevices(removedDevices, 'usedRemovedTableBody', 'removed');
}

// Clear used devices filter
function clearUsedDevicesFilter() {
    document.getElementById('filterUsedDevicesMonth').value = '';
    document.getElementById('filterUsedDevicesYear').value = '';
    currentUsedDevicesFilter = { month: '', year: '' };
    applyUsedDevicesFilter();
}

// Update store toggle buttons active state
function updateStoreToggleButtons() {
    // Update new devices page buttons
    const newDevicesPage = document.getElementById('new-devices');
    if (newDevicesPage) {
        const buttons = newDevicesPage.querySelectorAll('.store-btn');
        buttons.forEach(btn => {
            if (btn.dataset.store === currentStore) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Update used devices page buttons
    const usedDevicesPage = document.getElementById('used-devices');
    if (usedDevicesPage) {
        const buttons = usedDevicesPage.querySelectorAll('.store-btn');
        buttons.forEach(btn => {
            if (btn.dataset.store === currentStore) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
}

// Initialize new devices page
document.addEventListener('DOMContentLoaded', function() {
    initializeNewDevicesDatabase();
    initializeUsedDevicesDatabase();
    initializeRepairDatabase();
    initializeInstallmentDatabase();
    initializePawnDatabase();
    initializeAccessoriesDatabase();
    initializeTabs();
    initializeUsedTabs();
    initializeRepairTabs();
    initializeInstallmentTabs();
    initializePawnTabs();
    loadNewDevicesData();
    loadUsedDevicesData();
    loadRepairData();
    loadInstallmentData();
    loadPawnData();
    loadAccessoriesData();
    initializeSearch();
    initializeUsedSearch();
    initializeRepairSearch();
    initializeInstallmentSearch();
    initializePawnSearch();
    initializeNewDevicesDateFilter();
    initializeUsedDevicesDateFilter();
    initializeRepairDateFilter();
    initializeInstallmentDateFilter();
    initializePawnDateFilter();
    updateStoreToggleButtons();
    initializeAccessoryDateFilter();
    initializeExpenseMonthSelector();
    loadExpenseData();
    initializeExpenseCardClicks();
});

// Tab switching functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');

            // Remove active class from all tabs and contents
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(tabName + '-tab').classList.add('active');
        });
    });
}

// Open new device modal
function openNewDeviceModal(deviceId = null) {
    const modal = document.getElementById('newDeviceModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('newDeviceForm');

    // Reset form
    form.reset();
    currentEditId = deviceId;

    if (deviceId) {
        // Edit mode
        modalTitle.textContent = 'แก้ไขข้อมูลเครื่องใหม่';
        const device = newDevices.find(d => d.id === deviceId);

        if (device) {
            document.getElementById('deviceId').value = device.id;
            document.getElementById('brand').value = device.brand;
            document.getElementById('model').value = device.model;
            document.getElementById('color').value = device.color;
            document.getElementById('imei').value = device.imei;
            document.getElementById('ram').value = device.ram;
            document.getElementById('rom').value = device.rom;
            document.getElementById('purchasePrice').value = device.purchasePrice;
            document.getElementById('importDate').value = device.importDate;
            document.getElementById('salePrice').value = device.salePrice;
            document.getElementById('saleDate').value = device.saleDate || '';
            document.getElementById('status').value = device.status;
            document.getElementById('note').value = device.note || '';

            toggleSaleDateField();
        }
    } else {
        // Add mode
        modalTitle.textContent = 'เพิ่มเครื่องใหม่';
        // Set default import date to today
        document.getElementById('importDate').value = new Date().toISOString().split('T')[0];
    }

    modal.classList.add('show');
}

// Close modal
function closeNewDeviceModal() {
    const modal = document.getElementById('newDeviceModal');
    modal.classList.remove('show');
    currentEditId = null;
}

// Toggle sale date field based on status
function toggleSaleDateField() {
    const status = document.getElementById('status').value;
    const saleDateGroup = document.querySelector('label[for="saleDate"]').parentElement;
    const noteGroup = document.getElementById('noteGroup');

    if (status === 'sold') {
        saleDateGroup.style.display = 'flex';
        noteGroup.style.display = 'none';
    } else if (status === 'removed') {
        saleDateGroup.style.display = 'none';
        noteGroup.style.display = 'flex';
    } else {
        saleDateGroup.style.display = 'none';
        noteGroup.style.display = 'none';
    }
}

// Save new device
function saveNewDevice(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const device = {
        id: currentEditId || Date.now().toString(),
        brand: formData.get('brand'),
        model: formData.get('model'),
        color: formData.get('color'),
        imei: formData.get('imei'),
        ram: formData.get('ram'),
        rom: formData.get('rom'),
        purchasePrice: parseFloat(formData.get('purchasePrice')),
        importDate: formData.get('importDate'),
        salePrice: parseFloat(formData.get('salePrice')),
        saleDate: formData.get('saleDate') || null,
        status: formData.get('status'),
        note: formData.get('note') || '',
        store: currentStore,
        createdAt: currentEditId ? newDevices.find(d => d.id === currentEditId).createdAt : new Date().toISOString()
    };

    if (currentEditId) {
        // Update existing device
        const index = newDevices.findIndex(d => d.id === currentEditId);
        newDevices[index] = device;
    } else {
        // Add new device
        newDevices.push(device);
    }

    // Save to localStorage
    localStorage.setItem('newDevices', JSON.stringify(newDevices));

    // Reload data
    loadNewDevicesData();

    // Close modal
    closeNewDeviceModal();

    // Show success message
    showNotification(currentEditId ? 'บันทึกข้อมูลสำเร็จ' : 'เพิ่มเครื่องใหม่สำเร็จ');
}

// Load and display new devices data
function loadNewDevicesData() {
    // Apply current filter (which will show current month by default)
    applyNewDevicesFilter();
    
    // Update tab counts
    updateNewDevicesTabCounts();

    // Update dashboard stats
    updateDashboard();
}

// Display devices in table
function displayDevices(devices, tableBodyId, type) {
    const tbody = document.getElementById(tableBodyId);

    if (!tbody) return;

    if (devices.length === 0) {
        const colspan = type === 'stock' ? '9' : '10';
        tbody.innerHTML = `<tr><td colspan="${colspan}" class="empty-state">ไม่มีข้อมูล</td></tr>`;
        return;
    }

    tbody.innerHTML = devices.map(device => {
        if (type === 'stock') {
            return `
                <tr>
                    <td>${device.brand}</td>
                    <td>${device.model}</td>
                    <td>${device.color}</td>
                    <td>${device.imei}</td>
                    <td>${device.ram}/${device.rom} GB</td>
                    <td>${formatCurrency(device.purchasePrice)}</td>
                    <td>${formatDate(device.importDate)}</td>
                    <td>${formatCurrency(device.salePrice)}</td>
                    <td>
                        <button class="action-btn btn-edit" onclick="openNewDeviceModal('${device.id}')">แก้ไข</button>
                        <button class="action-btn btn-sell" onclick="markAsSold('${device.id}')">ขาย</button>
                        <button class="action-btn btn-installment" onclick="transferToInstallment('${device.id}')" style="background: #8b5cf6;">ผ่อน</button>
                        <button class="action-btn btn-remove" onclick="markAsRemoved('${device.id}')">ตัด</button>
                        <button class="action-btn btn-delete" onclick="deleteDevice('${device.id}')">ลบ</button>
                    </td>
                </tr>
            `;
        } else if (type === 'sold') {
            const profit = device.salePrice - device.purchasePrice;
            const profitColor = profit >= 0 ? '#10b981' : '#ef4444';
            return `
                <tr>
                    <td>${device.brand}</td>
                    <td>${device.model}</td>
                    <td>${device.color}</td>
                    <td>${device.imei}</td>
                    <td>${device.ram}/${device.rom} GB</td>
                    <td>${formatCurrency(device.purchasePrice)}</td>
                    <td>${formatCurrency(device.salePrice)}</td>
                    <td>${formatDate(device.saleDate)}</td>
                    <td style="color: ${profitColor}; font-weight: 600;">${formatCurrency(profit)}</td>
                    <td>
                        <button class="action-btn btn-edit" onclick="openNewDeviceModal('${device.id}')">แก้ไข</button>
                        <button class="action-btn btn-delete" onclick="deleteDevice('${device.id}')">ลบ</button>
                    </td>
                </tr>
            `;
        } else {
            return `
                <tr>
                    <td>${device.brand}</td>
                    <td>${device.model}</td>
                    <td>${device.color}</td>
                    <td>${device.imei}</td>
                    <td>${device.ram}/${device.rom} GB</td>
                    <td>${formatCurrency(device.purchasePrice)}</td>
                    <td>${formatDate(device.importDate)}</td>
                    <td>${formatDate(device.saleDate)}</td>
                    <td>${device.note}</td>
                    <td>
                        <button class="action-btn btn-edit" onclick="openNewDeviceModal('${device.id}')">แก้ไข</button>
                        <button class="action-btn btn-delete" onclick="deleteDevice('${device.id}')">ลบ</button>
                    </td>
                </tr>
            `;
        }
    }).join('');
}

// Mark device as sold
function markAsSold(deviceId) {
    if (confirm('ต้องการบันทึกการขายเครื่องนี้หรือไม่?')) {
        const device = newDevices.find(d => d.id === deviceId);
        if (device) {
            device.status = 'sold';
            device.saleDate = new Date().toISOString().split('T')[0];
            localStorage.setItem('newDevices', JSON.stringify(newDevices));
            loadNewDevicesData();
            showNotification('บันทึกการขายสำเร็จ');
        }
    }
}

// Mark device as removed
function markAsRemoved(deviceId) {
    const device = newDevices.find(d => d.id === deviceId);
    if (!device) return;

    // Ask for removal type
    const choice = confirm('กดตกลงเพื่อ "ตัดขายให้เจ้าอื่น"\nกดยกเลิกเพื่อ "ตัดสลับในร้านตัวเอง"');

    if (choice) {
        // ตัดขายให้เจ้าอื่น
        const note = prompt('กรุณาระบุเหตุผลในการตัดขายให้เจ้าอื่น:');
        if (note !== null) {
            device.status = 'removed';
            device.saleDate = new Date().toISOString().split('T')[0];
            device.note = note;
            localStorage.setItem('newDevices', JSON.stringify(newDevices));
            loadNewDevicesData();
            showNotification('ตัดออกสำเร็จ');
        }
    } else {
        // ตัดสลับในร้านตัวเอง
        const otherStore = device.store === 'salaya' ? 'klongyong' : 'salaya';
        const otherStoreName = stores[otherStore];

        if (confirm(`ต้องการย้ายเครื่องนี้ไปยัง ${otherStoreName} ใช่หรือไม่?`)) {
            device.store = otherStore;
            localStorage.setItem('newDevices', JSON.stringify(newDevices));
            loadNewDevicesData();
            showNotification(`ย้ายเครื่องไปยัง ${otherStoreName} สำเร็จ`);
        }
    }
}

// Delete device
function deleteDevice(deviceId) {
    if (confirm('ต้องการลบข้อมูลนี้หรือไม่? (ไม่สามารถกู้คืนได้)')) {
        newDevices = newDevices.filter(d => d.id !== deviceId);
        localStorage.setItem('newDevices', JSON.stringify(newDevices));
        loadNewDevicesData();
        showNotification('ลบข้อมูลสำเร็จ');
    }
}

// Initialize search
function initializeSearch() {
    const searchInput = document.getElementById('searchNewDevices');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            applyNewDevicesFilter();
        });
    }
}

// Filter devices based on search term
function filterDevices(searchTerm) {
    applyNewDevicesFilter();
}

// Format date
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('newDeviceModal');
    if (event.target === modal) {
        closeNewDeviceModal();
    }
}

// ===== DATABASE MANAGEMENT FUNCTIONS =====

// Reset database to initial state
function resetNewDevicesDatabase() {
    if (confirm('⚠️ คุณต้องการรีเซ็ตฐานข้อมูลกลับไปเป็นข้อมูลเริ่มต้นหรือไม่?\n\nข้อมูลปัจจุบันทั้งหมดจะถูกลบ')) {
        newDevices = [...newDevicesMockData];
        localStorage.setItem('newDevices', JSON.stringify(newDevices));
        loadNewDevicesData();
        showNotification('รีเซ็ตฐานข้อมูลสำเร็จ');
        console.log('✅ รีเซ็ตฐานข้อมูลเครื่องใหม่สำเร็จ');
        console.log(`📊 มีข้อมูลทั้งหมด ${newDevices.length} รายการ`);
    }
}

// Clear all data
function clearNewDevicesDatabase() {
    if (confirm('⚠️ คุณต้องการลบข้อมูลทั้งหมดหรือไม่?\n\nการกระทำนี้ไม่สามารถย้อนกลับได้')) {
        newDevices = [];
        localStorage.setItem('newDevices', JSON.stringify(newDevices));
        loadNewDevicesData();
        showNotification('ลบข้อมูลทั้งหมดสำเร็จ');
        console.log('🗑️ ลบข้อมูลทั้งหมดแล้ว');
    }
}

// Export database to JSON file
function exportNewDevicesDatabase() {
    const dataStr = JSON.stringify(newDevices, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `new-devices-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('ส่งออกข้อมูลสำเร็จ');
}

// Import database from JSON file
function importNewDevicesDatabase(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (confirm(`พบข้อมูล ${importedData.length} รายการ\n\nต้องการนำเข้าข้อมูลนี้หรือไม่?`)) {
                newDevices = importedData;
                localStorage.setItem('newDevices', JSON.stringify(newDevices));
                loadNewDevicesData();
                showNotification('นำเข้าข้อมูลสำเร็จ');
                console.log('✅ นำเข้าข้อมูลสำเร็จ');
                console.log(`📊 มีข้อมูลทั้งหมด ${newDevices.length} รายการ`);
            }
        } catch (error) {
            alert('❌ ไฟล์ไม่ถูกต้อง กรุณาเลือกไฟล์ JSON ที่ถูกต้อง');
            console.error('Import error:', error);
        }
    };
    reader.readAsText(file);
}

// Show database statistics in console
function showDatabaseStats() {
    console.log('📊 สถิติฐานข้อมูลเครื่องใหม่');
    console.log('─────────────────────────────');

    const salayaDevices = newDevices.filter(d => d.store === 'salaya');
    const klongyongDevices = newDevices.filter(d => d.store === 'klongyong');

    console.log(`📍 ร้านศาลายา: ${salayaDevices.length} รายการ`);
    console.log(`   - สต๊อก: ${salayaDevices.filter(d => d.status === 'stock').length}`);
    console.log(`   - ขายแล้ว: ${salayaDevices.filter(d => d.status === 'sold').length}`);
    console.log(`   - ตัดออก: ${salayaDevices.filter(d => d.status === 'removed').length}`);

    console.log(`📍 ร้านคลองโยง: ${klongyongDevices.length} รายการ`);
    console.log(`   - สต๊อก: ${klongyongDevices.filter(d => d.status === 'stock').length}`);
    console.log(`   - ขายแล้ว: ${klongyongDevices.filter(d => d.status === 'sold').length}`);
    console.log(`   - ตัดออก: ${klongyongDevices.filter(d => d.status === 'removed').length}`);

    console.log(`\n💰 มูลค่าสต๊อกทั้งหมด: ${formatCurrency(
        newDevices.filter(d => d.status === 'stock')
            .reduce((sum, d) => sum + d.purchasePrice, 0)
    )}`);

    console.log(`💵 ยอดขายทั้งหมด: ${formatCurrency(
        newDevices.filter(d => d.status === 'sold')
            .reduce((sum, d) => sum + d.salePrice, 0)
    )}`);

    console.log(`📈 กำไรจากการขาย: ${formatCurrency(
        newDevices.filter(d => d.status === 'sold')
            .reduce((sum, d) => sum + (d.salePrice - d.purchasePrice), 0)
    )}`);

    console.log('─────────────────────────────');
}

// Add to window for console access
window.resetNewDevicesDB = resetNewDevicesDatabase;
window.clearNewDevicesDB = clearNewDevicesDatabase;
window.exportNewDevicesDB = exportNewDevicesDatabase;
window.showNewDevicesStats = showDatabaseStats;

// ===== ACCESSORIES (อะไหล่) =====

// Mock data for accessories
const accessoriesMockData = [
    // แบตเตอรี่ - ร้านศาลายา
    {
        id: 'ACC1001',
        type: 'battery',
        code: 'BAT-IP14-001',
        brand: 'Apple',
        models: 'iPhone 14',
        quantity: 5,
        costPrice: 800,
        repairPrice: 1500,
        importDate: '2025-09-01',
        note: '',
        store: 'salaya',
        createdAt: '2025-09-01T10:00:00Z'
    },
    {
        id: 'ACC1002',
        type: 'battery',
        code: 'BAT-S23-001',
        brand: 'Samsung',
        models: 'Galaxy S23, S23+',
        quantity: 3,
        costPrice: 600,
        repairPrice: 1200,
        importDate: '2025-09-05',
        note: '',
        store: 'salaya',
        createdAt: '2025-09-05T11:00:00Z'
    },
    {
        id: 'ACC1003',
        type: 'battery',
        code: 'BAT-RN12-001',
        brand: 'Xiaomi',
        models: 'Redmi Note 12, 12 Pro',
        quantity: 0,
        costPrice: 300,
        repairPrice: 600,
        importDate: '2025-08-15',
        note: 'สั่งเพิ่มแล้ว',
        store: 'salaya',
        createdAt: '2025-08-15T09:00:00Z'
    },

    // อะไหล่จอ - ร้านศาลายา
    {
        id: 'ACC1004',
        type: 'screen',
        code: 'SCR-IP13-001',
        brand: 'Apple',
        models: 'iPhone 13',
        quantity: 2,
        costPrice: 3500,
        repairPrice: 5500,
        importDate: '2025-09-10',
        note: 'OLED Original',
        store: 'salaya',
        createdAt: '2025-09-10T10:00:00Z'
    },
    {
        id: 'ACC1005',
        type: 'screen',
        code: 'SCR-A54-001',
        brand: 'Samsung',
        models: 'Galaxy A54',
        quantity: 4,
        costPrice: 1500,
        repairPrice: 2500,
        importDate: '2025-09-12',
        note: '',
        store: 'salaya',
        createdAt: '2025-09-12T14:00:00Z'
    },

    // บอร์ดชาร์จ - ร้านศาลายา
    {
        id: 'ACC1006',
        type: 'charging',
        code: 'CHG-IP12-001',
        brand: 'Apple',
        models: 'iPhone 12, 12 Pro',
        quantity: 3,
        costPrice: 400,
        repairPrice: 800,
        importDate: '2025-08-20',
        note: '',
        store: 'salaya',
        createdAt: '2025-08-20T10:00:00Z'
    },
    {
        id: 'ACC1007',
        type: 'charging',
        code: 'CHG-OP11-001',
        brand: 'OPPO',
        models: 'Reno 10, 11',
        quantity: 0,
        costPrice: 250,
        repairPrice: 500,
        importDate: '2025-08-25',
        note: 'หมดสต็อก',
        store: 'salaya',
        createdAt: '2025-08-25T11:00:00Z'
    },

    // สวิตช์ - ร้านศาลายา
    {
        id: 'ACC1008',
        type: 'switch',
        code: 'SW-IP-001',
        brand: 'Apple',
        models: 'iPhone 11, 12, 13, 14',
        quantity: 10,
        costPrice: 150,
        repairPrice: 300,
        importDate: '2025-09-01',
        note: 'ใช้ได้หลายรุ่น',
        store: 'salaya',
        createdAt: '2025-09-01T10:00:00Z'
    },

    // แบตเตอรี่ - ร้านคลองโยง
    {
        id: 'ACC2001',
        type: 'battery',
        code: 'BAT-V29-001',
        brand: 'Vivo',
        models: 'V29',
        quantity: 2,
        costPrice: 500,
        repairPrice: 1000,
        importDate: '2025-09-08',
        note: '',
        store: 'klongyong',
        createdAt: '2025-09-08T10:00:00Z'
    },
    {
        id: 'ACC2002',
        type: 'battery',
        code: 'BAT-RL11-001',
        brand: 'Realme',
        models: 'Realme 11 Pro, 11 Pro+',
        quantity: 0,
        costPrice: 350,
        repairPrice: 700,
        importDate: '2025-08-18',
        note: 'รอของเข้า',
        store: 'klongyong',
        createdAt: '2025-08-18T09:00:00Z'
    },

    // อะไหล่จอ - ร้านคลองโยง
    {
        id: 'ACC2003',
        type: 'screen',
        code: 'SCR-XM14-001',
        brand: 'Xiaomi',
        models: 'Xiaomi 14',
        quantity: 1,
        costPrice: 2000,
        repairPrice: 3500,
        importDate: '2025-09-15',
        note: '',
        store: 'klongyong',
        createdAt: '2025-09-15T11:00:00Z'
    },

    // บอร์ดชาร์จ - ร้านคลองโยง
    {
        id: 'ACC2004',
        type: 'charging',
        code: 'CHG-S24-001',
        brand: 'Samsung',
        models: 'Galaxy S24',
        quantity: 2,
        costPrice: 500,
        repairPrice: 1000,
        importDate: '2025-09-20',
        note: '',
        store: 'klongyong',
        createdAt: '2025-09-20T10:00:00Z'
    },

    // สวิตช์ - ร้านคลองโยง
    {
        id: 'ACC2005',
        type: 'switch',
        code: 'SW-SAM-001',
        brand: 'Samsung',
        models: 'Galaxy A54, A34',
        quantity: 5,
        costPrice: 200,
        repairPrice: 400,
        importDate: '2025-09-10',
        note: '',
        store: 'klongyong',
        createdAt: '2025-09-10T14:00:00Z'
    }
];

// Data storage for accessories
let accessories = [];

// Current filter state
let currentAccessoryTab = 'battery';
let currentAccessoryFilter = {
    search: '',
    month: '',
    year: ''
};

// Current editing ID
let currentAccessoryEditId = null;

// Open accessory modal
async function openAccessoryModal(accessoryId = null) {
    const modal = document.getElementById('accessoryModal');
    const modalTitle = document.getElementById('accessoryModalTitle');
    const form = document.getElementById('accessoryForm');

    form.reset();
    currentAccessoryEditId = accessoryId;

    if (accessoryId) {
        // Edit mode
        modalTitle.textContent = 'แก้ไขอะไหล่';
        try {
            const accessory = await API.get(`${API_ENDPOINTS.accessories}/${accessoryId}`);
            document.getElementById('accessoryType').value = accessory.type;
            document.getElementById('accessoryCode').value = accessory.code;
            document.getElementById('accessoryBrand').value = accessory.brand;
            document.getElementById('accessoryModels').value = accessory.models;
            document.getElementById('accessoryQuantity').value = accessory.quantity;
            document.getElementById('accessoryCostPrice').value = accessory.cost_price;
            document.getElementById('accessoryRepairPrice').value = accessory.repair_price;
            document.getElementById('accessoryImportDate').value = accessory.import_date;
            document.getElementById('accessoryNote').value = accessory.note || '';
        } catch (error) {
            alert('เกิดข้อผิดพลาดในการโหลดข้อมูลอะไหล่');
            console.error(error);
            return;
        }
    } else {
        // Add mode
        modalTitle.textContent = 'เพิ่มอะไหล่';
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('accessoryImportDate').value = today;

        // Set default type based on current tab
        if (currentAccessoryTab !== 'outofstock' && currentAccessoryTab !== 'claim') {
            document.getElementById('accessoryType').value = currentAccessoryTab;
        }
    }

    modal.classList.add('show');
}

// Close accessory modal
function closeAccessoryModal() {
    const modal = document.getElementById('accessoryModal');
    modal.classList.remove('show');
    currentAccessoryEditId = null;
}

// Save accessory
async function saveAccessory(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const accessoryData = {
        type: formData.get('type'),
        code: formData.get('code'),
        brand: formData.get('brand'),
        models: formData.get('models'),
        quantity: parseInt(formData.get('quantity')),
        cost_price: parseInt(formData.get('costPrice')),
        repair_price: parseInt(formData.get('repairPrice')),
        import_date: formData.get('importDate'),
        note: formData.get('note') || '',
        store: currentStore
    };

    try {
        if (currentAccessoryEditId) {
            // Update
            await API.put(`${API_ENDPOINTS.accessories}/${currentAccessoryEditId}`, accessoryData);
            showNotification('อัพเดทข้อมูลอะไหล่สำเร็จ');
        } else {
            // Add
            accessoryData.id = 'ACC' + Date.now().toString();
            await API.post(API_ENDPOINTS.accessories, accessoryData);
            showNotification('เพิ่มอะไหล่สำเร็จ');
        }

        loadAccessoriesData();
        closeAccessoryModal();
    } catch (error) {
        alert('เกิดข้อผิดพลาด: ' + error.message);
        console.error(error);
    }
}

// Delete accessory
async function deleteAccessory(accessoryId) {
    if (!confirm('คุณต้องการลบอะไหล่นี้ใช่หรือไม่?')) return;

    try {
        await API.delete(`${API_ENDPOINTS.accessories}/${accessoryId}`);
        loadAccessoriesData();
        showNotification('ลบอะไหล่สำเร็จ');
    } catch (error) {
        alert('เกิดข้อผิดพลาดในการลบอะไหล่: ' + error.message);
        console.error(error);
    }
}

// Switch accessory tab
function switchAccessoryTab(tab) {
    currentAccessoryTab = tab;
    
    // Update tab buttons
    const tabButtons = document.querySelectorAll('#accessories .tab-btn');
    const tabContents = document.querySelectorAll('#accessories .tab-content');
    
    tabButtons.forEach(btn => {
        if (btn.getAttribute('data-tab') === 'accessory-' + tab) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    tabContents.forEach(content => {
        if (content.id === 'accessory-' + tab) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

// Load accessories data
async function loadAccessoriesData() {
    try {
        // Get accessories from API
        const allAccessories = await API.get(API_ENDPOINTS.accessories, { store: currentStore });

        // Apply search
        let filteredAccessories = allAccessories;
        if (currentAccessoryFilter.search) {
            const search = currentAccessoryFilter.search.toLowerCase();
            filteredAccessories = filteredAccessories.filter(a =>
                a.brand.toLowerCase().includes(search) ||
                a.code.toLowerCase().includes(search) ||
                a.models.toLowerCase().includes(search)
            );
        }

        // Apply date filter
        if (currentAccessoryFilter.month || currentAccessoryFilter.year) {
            filteredAccessories = filteredAccessories.filter(a => {
                const date = new Date(a.import_date);
                const month = date.getMonth() + 1;
                const year = date.getFullYear();

                const monthMatch = !currentAccessoryFilter.month || month == currentAccessoryFilter.month;
                const yearMatch = !currentAccessoryFilter.year || year == currentAccessoryFilter.year;

                return monthMatch && yearMatch;
            });
        }

        // Separate by type
        const batteryAccessories = filteredAccessories.filter(a => a.type === 'battery' && a.quantity > 0);
        const screenAccessories = filteredAccessories.filter(a => a.type === 'screen' && a.quantity > 0);
        const chargingAccessories = filteredAccessories.filter(a => a.type === 'charging' && a.quantity > 0);
        const switchAccessories = filteredAccessories.filter(a => a.type === 'switch' && a.quantity > 0);
        const outOfStockAccessories = filteredAccessories.filter(a => a.quantity === 0);
        const claimAccessories = filteredAccessories.filter(a => (a.claim_quantity || 0) > 0);

        // Update counts
        document.getElementById('batteryCount').textContent = batteryAccessories.length;
        document.getElementById('screenCount').textContent = screenAccessories.length;
        document.getElementById('chargingCount').textContent = chargingAccessories.length;
        document.getElementById('switchCount').textContent = switchAccessories.length;
        document.getElementById('outofstockCount').textContent = outOfStockAccessories.length;
        document.getElementById('claimCount').textContent = claimAccessories.length;

        // Display accessories
        displayAccessories(batteryAccessories, 'batteryTableBody');
        displayAccessories(screenAccessories, 'screenTableBody');
        displayAccessories(chargingAccessories, 'chargingTableBody');
        displayAccessories(switchAccessories, 'switchTableBody');
        displayOutOfStockAccessories(outOfStockAccessories, 'outofstockTableBody');
        displayClaimAccessories(claimAccessories, 'claimTableBody');
    } catch (error) {
        console.error('Error loading accessories:', error);
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูลอะไหล่');
    }
}

// Display accessories
function displayAccessories(accessoriesList, tableBodyId) {
    const tbody = document.getElementById(tableBodyId);
    if (!tbody) return;

    if (accessoriesList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-state">ไม่มีข้อมูล</td></tr>';
        return;
    }

    tbody.innerHTML = accessoriesList.map(acc => {
        const claimQuantity = acc.claim_quantity || 0;
        const availableQuantity = acc.quantity - claimQuantity;

        return `
        <tr>
            <td>${acc.code}</td>
            <td>${acc.brand}</td>
            <td>${acc.models}</td>
            <td><strong>${acc.quantity}</strong>${claimQuantity > 0 ? ` <small style="color: #e67e22;">(เคลม: ${claimQuantity})</small>` : ''}</td>
            <td>${formatCurrency(acc.cost_price)}</td>
            <td>${formatCurrency(acc.repair_price)}</td>
            <td>${formatDate(acc.import_date)}</td>
            <td>
                <button class="btn-action btn-edit" onclick="openAccessoryModal('${acc.id}')">แก้ไข</button>
                ${availableQuantity > 0 ? `<button class="btn-action" style="background: #e67e22;" onclick="openClaimModal('${acc.id}')">เคลม</button>` : ''}
                <button class="btn-action btn-delete" onclick="deleteAccessory('${acc.id}')">ลบ</button>
            </td>
        </tr>
    `;
    }).join('');
}

// Display out of stock accessories
function displayOutOfStockAccessories(accessoriesList, tableBodyId) {
    const tbody = document.getElementById(tableBodyId);
    if (!tbody) return;

    if (accessoriesList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-state">ไม่มีอะไหล่ที่หมดสต็อก</td></tr>';
        return;
    }

    const typeNames = {
        battery: 'แบตเตอรี่',
        screen: 'อะไหล่จอ',
        charging: 'บอร์ดชาร์จ',
        switch: 'สวิตช์'
    };

    tbody.innerHTML = accessoriesList.map(acc => `
        <tr style="background: #fff5f5;">
            <td>${acc.code}</td>
            <td><span class="badge badge-danger">${typeNames[acc.type]}</span></td>
            <td>${acc.brand}</td>
            <td>${acc.models}</td>
            <td>${formatCurrency(acc.cost_price)}</td>
            <td>${formatCurrency(acc.repair_price)}</td>
            <td>${formatDate(acc.import_date)}</td>
            <td>
                <button class="btn-action btn-edit" onclick="openAccessoryModal('${acc.id}')">แก้ไข</button>
                <button class="btn-action btn-delete" onclick="deleteAccessory('${acc.id}')">ลบ</button>
            </td>
        </tr>
    `).join('');
}

// Search accessories
function searchAccessory() {
    const searchInput = document.getElementById('searchAccessory');
    currentAccessoryFilter.search = searchInput.value;
    loadAccessoriesData();
}

// Filter accessories
function filterAccessory() {
    const monthSelect = document.getElementById('filterAccessoryMonth');
    const yearSelect = document.getElementById('filterAccessoryYear');
    
    currentAccessoryFilter.month = monthSelect.value;
    currentAccessoryFilter.year = yearSelect.value;
    
    loadAccessoriesData();
}

// Reset accessory filter
function resetAccessoryFilter() {
    document.getElementById('searchAccessory').value = '';
    document.getElementById('filterAccessoryMonth').value = '';
    document.getElementById('filterAccessoryYear').value = '';
    
    currentAccessoryFilter = {
        search: '',
        month: '',
        year: ''
    };
    
    loadAccessoriesData();
}

// Initialize accessory date filter
function initializeAccessoryDateFilter() {
    const monthSelect = document.getElementById('filterAccessoryMonth');
    const yearSelect = document.getElementById('filterAccessoryYear');

    if (!monthSelect || !yearSelect) return;

    // Populate year dropdown
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 5; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = `${year + 543}`;
        yearSelect.appendChild(option);
    }

    // Populate month dropdown
    const thaiMonths = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];

    thaiMonths.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index + 1;
        option.textContent = month;
        monthSelect.appendChild(option);
    });
}

// Display claim accessories
function displayClaimAccessories(accessoriesList, tableBodyId) {
    const tbody = document.getElementById(tableBodyId);
    if (!tbody) return;

    if (accessoriesList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-state">ไม่มีอะไหล่ที่ส่งเคลม</td></tr>';
        return;
    }

    const typeNames = {
        battery: 'แบตเตอรี่',
        screen: 'อะไหล่จอ',
        charging: 'บอร์ดชาร์จ',
        switch: 'สวิตช์'
    };

    tbody.innerHTML = accessoriesList.map(acc => {
        const claimQuantity = acc.claim_quantity || 0;
        const availableQuantity = acc.quantity - claimQuantity;

        return `
        <tr style="background: #fff8e1;">
            <td>${acc.code}</td>
            <td><span class="badge badge-warning">${typeNames[acc.type]}</span></td>
            <td>${acc.brand}</td>
            <td>${acc.models}</td>
            <td><strong style="color: #e67e22;">${claimQuantity}</strong></td>
            <td>${availableQuantity}</td>
            <td>${acc.claim_date ? formatDate(acc.claim_date) : '-'}</td>
            <td>
                <button class="btn-action" style="background: #27ae60;" onclick="openReturnStockModal('${acc.id}')">คืนสต็อก</button>
                <button class="btn-action btn-edit" onclick="openAccessoryModal('${acc.id}')">แก้ไข</button>
            </td>
        </tr>
    `;
    }).join('');
}

// Open claim modal
async function openClaimModal(accessoryId) {
    try {
        const accessory = await API.get(`${API_ENDPOINTS.accessories}/${accessoryId}`);

        const modal = document.getElementById('claimAccessoryModal');
        const claimQuantity = accessory.claim_quantity || 0;
        const availableQuantity = accessory.quantity - claimQuantity;

        document.getElementById('claimAccessoryInfo').textContent =
            `${accessory.code} - ${accessory.brand} ${accessory.models}`;
        document.getElementById('claimAvailableQuantity').textContent =
            `จำนวนที่สามารถเคลมได้: ${availableQuantity} ชิ้น`;
        document.getElementById('claimQuantity').max = availableQuantity;
        document.getElementById('claimQuantity').value = '';
        document.getElementById('claimAccessoryId').value = accessoryId;

        modal.classList.add('show');
    } catch (error) {
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูลอะไหล่');
        console.error(error);
    }
}

// Close claim modal
function closeClaimModal() {
    const modal = document.getElementById('claimAccessoryModal');
    modal.classList.remove('show');
}

// Send accessory to claim
async function sendAccessoryToClaim(event) {
    event.preventDefault();

    const accessoryId = document.getElementById('claimAccessoryId').value;
    const quantity = parseInt(document.getElementById('claimQuantity').value);

    try {
        await API.post(API_ENDPOINTS.accessoryClaim(accessoryId), { quantity });

        loadAccessoriesData();
        closeClaimModal();

        showNotification(`ส่งเคลมอะไหล่ ${quantity} ชิ้น สำเร็จ`);
    } catch (error) {
        alert('เกิดข้อผิดพลาด: ' + error.message);
        console.error(error);
    }
}

// Open return stock modal
async function openReturnStockModal(accessoryId) {
    try {
        const accessory = await API.get(`${API_ENDPOINTS.accessories}/${accessoryId}`);

        const modal = document.getElementById('returnStockModal');
        const claimQuantity = accessory.claim_quantity || 0;

        document.getElementById('returnAccessoryInfo').textContent =
            `${accessory.code} - ${accessory.brand} ${accessory.models}`;
        document.getElementById('returnClaimQuantity').textContent =
            `จำนวนที่ส่งเคลม: ${claimQuantity} ชิ้น`;
        document.getElementById('returnQuantity').max = claimQuantity;
        document.getElementById('returnQuantity').value = '';
        document.getElementById('returnAccessoryId').value = accessoryId;

        modal.classList.add('show');
    } catch (error) {
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูลอะไหล่');
        console.error(error);
    }
}

// Close return stock modal
function closeReturnStockModal() {
    const modal = document.getElementById('returnStockModal');
    modal.classList.remove('show');
}

// Return accessory to stock
async function returnAccessoryToStock(event) {
    event.preventDefault();

    const accessoryId = document.getElementById('returnAccessoryId').value;
    const quantity = parseInt(document.getElementById('returnQuantity').value);

    try {
        await API.post(API_ENDPOINTS.accessoryReturnStock(accessoryId), { quantity });

        loadAccessoriesData();
        closeReturnStockModal();

        showNotification(`คืนอะไหล่กลับสต็อก ${quantity} ชิ้น สำเร็จ`);
    } catch (error) {
        alert('เกิดข้อผิดพลาด: ' + error.message);
        console.error(error);
    }
}

// ===== EXPENSES MANAGEMENT =====

// Initialize expense month selector
function initializeExpenseMonthSelector() {
    const monthSelect = document.getElementById('expenseMonthSelect');
    if (!monthSelect) return;

    // Generate last 12 months
    const months = [];
    const today = new Date();

    for (let i = 0; i < 12; i++) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const yearMonth = date.toISOString().slice(0, 7);
        const year = date.getFullYear();
        const month = date.getMonth();
        const thaiYear = year + 543; // Convert to Buddhist calendar

        months.push({
            value: yearMonth,
            label: `${thaiMonths[month]} ${thaiYear}`
        });
    }

    // Populate month selector
    monthSelect.innerHTML = months.map(m =>
        `<option value="${m.value}">${m.label}</option>`
    ).join('');

    // Set current month as selected
    monthSelect.value = currentMonth;

    // Add change event listener
    monthSelect.addEventListener('change', function() {
        currentMonth = this.value;
        loadExpenseData();
    });
}

// Load and calculate expense data
function loadExpenseData() {
    const selectedMonth = document.getElementById('expenseMonthSelect')?.value || currentMonth;
    
    // Calculate expenses for each category
    const newDevicesExpense = calculateNewDevicesExpense(selectedMonth);
    const usedDevicesExpense = calculateUsedDevicesExpense(selectedMonth);
    const pawnExpense = calculatePawnExpense(selectedMonth);
    const accessoriesExpense = calculateAccessoriesExpense(selectedMonth);
    
    // Update summary cards
    updateExpenseSummary(newDevicesExpense, usedDevicesExpense, pawnExpense, accessoriesExpense);
    
    // Update expense details table
    updateExpenseDetailsTable(selectedMonth);
}

// Calculate new devices expense (purchase prices) - All stores
function calculateNewDevicesExpense(month) {
    // Get all devices from all stores
    const allDevices = newDevices;
    
    if (month) {
        const filteredDevices = allDevices.filter(device => {
            const deviceDate = new Date(device.importDate);
            const deviceMonth = deviceDate.toISOString().slice(0, 7);
            return deviceMonth === month;
        });
        return filteredDevices.reduce((sum, device) => sum + device.purchasePrice, 0);
    }
    
    return allDevices.reduce((sum, device) => sum + device.purchasePrice, 0);
}

// Calculate used devices expense (purchase prices) - All stores
function calculateUsedDevicesExpense(month) {
    // Get all devices from all stores
    const allDevices = usedDevices;
    
    if (month) {
        const filteredDevices = allDevices.filter(device => {
            const deviceDate = new Date(device.purchaseDate);
            const deviceMonth = deviceDate.toISOString().slice(0, 7);
            return deviceMonth === month;
        });
        return filteredDevices.reduce((sum, device) => sum + device.purchasePrice, 0);
    }
    
    return allDevices.reduce((sum, device) => sum + device.purchasePrice, 0);
}

// Calculate pawn expense (pawn amounts) - All stores
function calculatePawnExpense(month) {
    // Get all pawns from all stores
    const allPawns = pawnDevices;
    
    if (month) {
        const filteredPawns = allPawns.filter(pawn => {
            const pawnDate = new Date(pawn.receiveDate);
            const pawnMonth = pawnDate.toISOString().slice(0, 7);
            return pawnMonth === month;
        });
        return filteredPawns.reduce((sum, pawn) => sum + pawn.pawnAmount, 0);
    }
    
    return allPawns.reduce((sum, pawn) => sum + pawn.pawnAmount, 0);
}

// Calculate accessories expense (cost prices) - All stores
function calculateAccessoriesExpense(month) {
    // Get all accessories from all stores
    const allAccessories = accessories;
    
    if (month) {
        const filteredAccessories = allAccessories.filter(accessory => {
            const accessoryDate = new Date(accessory.importDate);
            const accessoryMonth = accessoryDate.toISOString().slice(0, 7);
            return accessoryMonth === month;
        });
        return filteredAccessories.reduce((sum, accessory) => sum + (accessory.costPrice * accessory.quantity), 0);
    }
    
    return allAccessories.reduce((sum, accessory) => sum + (accessory.costPrice * accessory.quantity), 0);
}

// Update expense summary cards
function updateExpenseSummary(newDevicesExpense, usedDevicesExpense, pawnExpense, accessoriesExpense) {
    const totalExpense = newDevicesExpense + usedDevicesExpense + pawnExpense + accessoriesExpense;
    
    // Update individual cards
    const newDevicesExpenseElement = document.getElementById('newDevicesExpense');
    const usedDevicesExpenseElement = document.getElementById('usedDevicesExpense');
    const pawnExpenseElement = document.getElementById('pawnExpense');
    const accessoriesExpenseElement = document.getElementById('accessoriesExpense');
    const totalExpenseElement = document.getElementById('totalExpenseAmount');
    
    if (newDevicesExpenseElement) newDevicesExpenseElement.textContent = formatCurrency(newDevicesExpense);
    if (usedDevicesExpenseElement) usedDevicesExpenseElement.textContent = formatCurrency(usedDevicesExpense);
    if (pawnExpenseElement) pawnExpenseElement.textContent = formatCurrency(pawnExpense);
    if (accessoriesExpenseElement) accessoriesExpenseElement.textContent = formatCurrency(accessoriesExpense);
    if (totalExpenseElement) totalExpenseElement.textContent = formatCurrency(totalExpense);
}

// Update expense details table - All stores
function updateExpenseDetailsTable(month) {
    const tbody = document.getElementById('expenseDetailsTableBody');
    if (!tbody) return;
    
    const expenseDetails = [];
    
    // New devices expenses - All stores
    const allNewDevices = newDevices;
    const filteredNewDevices = month ? allNewDevices.filter(device => {
        const deviceDate = new Date(device.importDate);
        const deviceMonth = deviceDate.toISOString().slice(0, 7);
        return deviceMonth === month;
    }) : allNewDevices;
    
    filteredNewDevices.forEach(device => {
        const storeName = stores[device.store] || device.store;
        expenseDetails.push({
            category: 'เครื่องใหม่',
            item: `${device.brand} ${device.model} (${device.color})`,
            amount: device.purchasePrice,
            date: device.importDate,
            note: `${storeName} - IMEI: ${device.imei}`
        });
    });
    
    // Used devices expenses - All stores
    const allUsedDevices = usedDevices;
    const filteredUsedDevices = month ? allUsedDevices.filter(device => {
        const deviceDate = new Date(device.purchaseDate);
        const deviceMonth = deviceDate.toISOString().slice(0, 7);
        return deviceMonth === month;
    }) : allUsedDevices;
    
    filteredUsedDevices.forEach(device => {
        const storeName = stores[device.store] || device.store;
        expenseDetails.push({
            category: 'เครื่องมือสอง',
            item: `${device.brand} ${device.model} (${device.color})`,
            amount: device.purchasePrice,
            date: device.purchaseDate,
            note: `${storeName} - สภาพ: ${device.condition}`
        });
    });
    
    // Pawn expenses - All stores
    const allPawns = pawnDevices;
    const filteredPawns = month ? allPawns.filter(pawn => {
        const pawnDate = new Date(pawn.receiveDate);
        const pawnMonth = pawnDate.toISOString().slice(0, 7);
        return pawnMonth === month;
    }) : allPawns;
    
    filteredPawns.forEach(pawn => {
        const storeName = stores[pawn.store] || pawn.store;
        expenseDetails.push({
            category: 'ค่าขายฝาก',
            item: `${pawn.brand} ${pawn.model} (${pawn.color})`,
            amount: pawn.pawnAmount,
            date: pawn.receiveDate,
            note: `${storeName} - ดอกเบี้ย: ${formatCurrency(pawn.interest)}`
        });
    });
    
    // Accessories expenses - All stores
    const allAccessories = accessories;
    const filteredAccessories = month ? allAccessories.filter(accessory => {
        const accessoryDate = new Date(accessory.importDate);
        const accessoryMonth = accessoryDate.toISOString().slice(0, 7);
        return accessoryMonth === month;
    }) : allAccessories;
    
    filteredAccessories.forEach(accessory => {
        const storeName = stores[accessory.store] || accessory.store;
        const totalCost = accessory.costPrice * accessory.quantity;
        expenseDetails.push({
            category: 'ค่าอะไหล่',
            item: `${accessory.code} - ${accessory.brand} (${accessory.models})`,
            amount: totalCost,
            date: accessory.importDate,
            note: `${storeName} - จำนวน: ${accessory.quantity} ชิ้น`
        });
    });
    
    // Sort by date (newest first)
    expenseDetails.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Display in table
    if (expenseDetails.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">ไม่มีข้อมูลค่าใช้จ่ายในเดือนนี้</td></tr>';
    } else {
        tbody.innerHTML = expenseDetails.map(expense => `
            <tr>
                <td><span class="expense-category">${expense.category}</span></td>
                <td>${expense.item}</td>
                <td class="expense-amount-cell">${formatCurrency(expense.amount)}</td>
                <td>${formatDate(expense.date)}</td>
                <td>${expense.note}</td>
            </tr>
        `).join('');
    }
}

// Initialize expense card clicks
function initializeExpenseCardClicks() {
    const expenseCards = document.querySelectorAll('.expense-summary-card');
    
    expenseCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            showExpenseDetail(category);
        });
    });
}

// Show expense detail page
function showExpenseDetail(category) {
    // Hide main expense page
    const expenseMain = document.querySelector('#expenses .expense-summary-section, #expenses .expense-controls, #expenses .expense-details-section');
    if (expenseMain) {
        expenseMain.style.display = 'none';
    }
    
    // Show detail page
    const detailPage = document.getElementById(`${category}-detail`);
    if (detailPage) {
        detailPage.classList.add('active');
        loadExpenseDetailData(category);
    }
}

// Show expense main page
function showExpenseMain() {
    // Hide all detail pages
    const detailPages = document.querySelectorAll('.expense-detail-page');
    detailPages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show main expense page
    const expenseMain = document.querySelector('#expenses .expense-summary-section, #expenses .expense-controls, #expenses .expense-details-section');
    if (expenseMain) {
        expenseMain.style.display = 'block';
    }
}

// Load expense detail data
function loadExpenseDetailData(category) {
    const selectedMonth = document.getElementById('expenseMonthSelect')?.value || '';
    
    switch(category) {
        case 'new-devices':
            loadNewDevicesDetail(selectedMonth);
            break;
        case 'used-devices':
            loadUsedDevicesDetail(selectedMonth);
            break;
        case 'pawn':
            loadPawnDetail(selectedMonth);
            break;
        case 'accessories':
            loadAccessoriesDetail(selectedMonth);
            break;
    }
}

// Load new devices detail
function loadNewDevicesDetail(month) {
    const allDevices = newDevices;
    const filteredDevices = month ? allDevices.filter(device => {
        const deviceDate = new Date(device.importDate);
        const deviceMonth = deviceDate.toISOString().slice(0, 7);
        return deviceMonth === month;
    }) : allDevices;
    
    // Update stats
    const totalAmount = filteredDevices.reduce((sum, device) => sum + device.purchasePrice, 0);
    const totalCount = filteredDevices.length;
    
    document.getElementById('newDevicesTotalAmount').textContent = formatCurrency(totalAmount);
    document.getElementById('newDevicesTotalCount').textContent = totalCount;
    
    // Update table
    const tbody = document.getElementById('newDevicesDetailTableBody');
    if (filteredDevices.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">ไม่มีข้อมูลในเดือนนี้</td></tr>';
    } else {
        tbody.innerHTML = filteredDevices.map(device => {
            const storeName = stores[device.store] || device.store;
            return `
                <tr>
                    <td>${storeName}</td>
                    <td>${device.brand} ${device.model} (${device.color})</td>
                    <td class="expense-amount-cell">${formatCurrency(device.purchasePrice)}</td>
                    <td>${formatDate(device.importDate)}</td>
                    <td>${device.imei}</td>
                </tr>
            `;
        }).join('');
    }
}

// Load used devices detail
function loadUsedDevicesDetail(month) {
    const allDevices = usedDevices;
    const filteredDevices = month ? allDevices.filter(device => {
        const deviceDate = new Date(device.purchaseDate);
        const deviceMonth = deviceDate.toISOString().slice(0, 7);
        return deviceMonth === month;
    }) : allDevices;
    
    // Update stats
    const totalAmount = filteredDevices.reduce((sum, device) => sum + device.purchasePrice, 0);
    const totalCount = filteredDevices.length;
    
    document.getElementById('usedDevicesTotalAmount').textContent = formatCurrency(totalAmount);
    document.getElementById('usedDevicesTotalCount').textContent = totalCount;
    
    // Update table
    const tbody = document.getElementById('usedDevicesDetailTableBody');
    if (filteredDevices.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">ไม่มีข้อมูลในเดือนนี้</td></tr>';
    } else {
        tbody.innerHTML = filteredDevices.map(device => {
            const storeName = stores[device.store] || device.store;
            return `
                <tr>
                    <td>${storeName}</td>
                    <td>${device.brand} ${device.model} (${device.color})</td>
                    <td class="expense-amount-cell">${formatCurrency(device.purchasePrice)}</td>
                    <td>${formatDate(device.purchaseDate)}</td>
                    <td>${device.condition}</td>
                </tr>
            `;
        }).join('');
    }
}

// Load pawn detail
function loadPawnDetail(month) {
    const allPawns = pawnDevices;
    const filteredPawns = month ? allPawns.filter(pawn => {
        const pawnDate = new Date(pawn.receiveDate);
        const pawnMonth = pawnDate.toISOString().slice(0, 7);
        return pawnMonth === month;
    }) : allPawns;
    
    // Update stats
    const totalAmount = filteredPawns.reduce((sum, pawn) => sum + pawn.pawnAmount, 0);
    const totalCount = filteredPawns.length;
    
    document.getElementById('pawnTotalAmount').textContent = formatCurrency(totalAmount);
    document.getElementById('pawnTotalCount').textContent = totalCount;
    
    // Update table
    const tbody = document.getElementById('pawnDetailTableBody');
    if (filteredPawns.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">ไม่มีข้อมูลในเดือนนี้</td></tr>';
    } else {
        tbody.innerHTML = filteredPawns.map(pawn => {
            const storeName = stores[pawn.store] || pawn.store;
            return `
                <tr>
                    <td>${storeName}</td>
                    <td>${pawn.brand} ${pawn.model} (${pawn.color})</td>
                    <td class="expense-amount-cell">${formatCurrency(pawn.pawnAmount)}</td>
                    <td>${formatDate(pawn.receiveDate)}</td>
                    <td>${formatCurrency(pawn.interest)}</td>
                </tr>
            `;
        }).join('');
    }
}

// Load accessories detail
function loadAccessoriesDetail(month) {
    const allAccessories = accessories;
    const filteredAccessories = month ? allAccessories.filter(accessory => {
        const accessoryDate = new Date(accessory.importDate);
        const accessoryMonth = accessoryDate.toISOString().slice(0, 7);
        return accessoryMonth === month;
    }) : allAccessories;
    
    // Update stats
    const totalAmount = filteredAccessories.reduce((sum, accessory) => sum + (accessory.costPrice * accessory.quantity), 0);
    const totalCount = filteredAccessories.length;
    
    document.getElementById('accessoriesTotalAmount').textContent = formatCurrency(totalAmount);
    document.getElementById('accessoriesTotalCount').textContent = totalCount;
    
    // Update table
    const tbody = document.getElementById('accessoriesDetailTableBody');
    if (filteredAccessories.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">ไม่มีข้อมูลในเดือนนี้</td></tr>';
    } else {
        tbody.innerHTML = filteredAccessories.map(accessory => {
            const storeName = stores[accessory.store] || accessory.store;
            const totalCost = accessory.costPrice * accessory.quantity;
            return `
                <tr>
                    <td>${storeName}</td>
                    <td>${accessory.code} - ${accessory.brand} (${accessory.models})</td>
                    <td class="expense-amount-cell">${formatCurrency(totalCost)}</td>
                    <td>${accessory.quantity}</td>
                    <td>${formatDate(accessory.importDate)}</td>
                </tr>
            `;
        }).join('');
    }
}
