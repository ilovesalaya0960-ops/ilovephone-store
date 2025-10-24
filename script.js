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

// ===== REAL DATA ONLY - NO MOCK DATA =====
// All data is now fetched from the database via API

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

            // Load data for specific pages
            if (page === 'accessories') {
                loadAccessoriesData();
            } else if (page === 'new-devices') {
                loadNewDevicesData();
            } else if (page === 'used-devices') {
                loadUsedDevicesData();
            } else if (page === 'repair') {
                loadRepairData();
            } else if (page === 'installment') {
                loadInstallmentData();
            } else if (page === 'pawn') {
                loadPawnData();
            }
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
async function updateDashboard() {
    console.log('🔄 Updating dashboard with real data from API...');
    console.log('Store:', currentStore, '| Month:', currentMonth);

    // Get real data from new devices database via API
    let realNewDevicesCount = 0;
    let newDevicesData = [];
    try {
        newDevicesData = await API.get(API_ENDPOINTS.newDevices, { store: currentStore });
        realNewDevicesCount = newDevicesData.filter(d => d.status === 'stock').length;
    } catch (error) {
        console.error('Error fetching new devices for dashboard:', error);
    }

    // Get real data from used devices database via API
    let realUsedDevicesCount = 0;
    let usedDevicesData = [];
    try {
        usedDevicesData = await API.get(API_ENDPOINTS.usedDevices, { store: currentStore });
        realUsedDevicesCount = usedDevicesData.filter(d => d.status === 'stock').length;
    } catch (error) {
        console.error('Error fetching used devices for dashboard:', error);
    }

    // Get real data from pawn devices database via API
    let realPawnDevicesCount = 0;
    let pawnDevicesData = [];
    try {
        pawnDevicesData = await API.get(API_ENDPOINTS.pawn, { store: currentStore });
        realPawnDevicesCount = pawnDevicesData.filter(p => p.status === 'active').length;
        console.log('Pawn devices count:', {
            store: currentStore,
            total: pawnDevicesData.length,
            active: realPawnDevicesCount
        });
    } catch (error) {
        console.error('Error fetching pawn devices for dashboard:', error);
    }

    // Calculate income breakdown from real data
    const currentYear = currentMonth.substring(0, 4);
    const currentMonthNum = currentMonth.substring(5, 7);

    // Income from new devices (sold in current month)
    let incomeNewDevices = 0;
    if (newDevicesData.length > 0) {
        incomeNewDevices = newDevicesData
            .filter(d => d.status === 'sold' && (d.sale_date || d.saleDate))
            .filter(d => {
                const saleDate = new Date(d.sale_date || d.saleDate);
                return saleDate.getFullYear().toString() === currentYear &&
                       (saleDate.getMonth() + 1).toString().padStart(2, '0') === currentMonthNum;
            })
            .reduce((sum, d) => sum + ((d.sale_price || d.salePrice) || 0), 0);
    }

    // Income from used devices (sold in current month)
    let incomeUsedDevices = 0;
    if (usedDevicesData.length > 0) {
        incomeUsedDevices = usedDevicesData
            .filter(d => d.status === 'sold' && (d.sale_date || d.saleDate))
            .filter(d => {
                const saleDate = new Date(d.sale_date || d.saleDate);
                return saleDate.getFullYear().toString() === currentYear &&
                       (saleDate.getMonth() + 1).toString().padStart(2, '0') === currentMonthNum;
            })
            .reduce((sum, d) => sum + ((d.sale_price || d.salePrice) || 0), 0);
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

    // Income from pawn (interest + returned amount)
    let incomePawn = 0;

    // 1. Income from pawn interest (from transactions)
    let pawnInterestAmount = 0;
    try {
        const [year, month] = currentMonth.split('-');
        const pawnInterest = await API.get('http://localhost:5001/api/pawn-interest/summary', {
            store: currentStore,
            year: year,
            month: month
        });
        pawnInterestAmount = parseFloat(pawnInterest.total_interest) || 0;
        console.log('Pawn interest from transactions:', pawnInterestAmount);
    } catch (error) {
        console.error('Error loading pawn interest:', error);
    }

    // 2. Income from returned pawn devices (customer paid back - redemption amount)
    let returnedPawnAmount = 0;
    console.log('==================== PAWN INCOME CALCULATION ====================');
    console.log('Current Store:', currentStore);
    console.log('Current Month:', `${currentYear}-${currentMonthNum}`);
    console.log('Total pawn devices from API:', pawnDevicesData ? pawnDevicesData.length : 0);
    
    if (pawnDevicesData && pawnDevicesData.length > 0) {
        // Filter returned items
        const returnedItems = pawnDevicesData.filter(p => p.status === 'returned' && (p.return_date || p.returnDate));
        console.log('Returned items (all):', returnedItems.length);
        
        // Filter by return date in current month
        const returnedThisMonth = returnedItems.filter(p => {
            const returnDate = new Date(p.return_date || p.returnDate);
            const matchYear = returnDate.getFullYear().toString() === currentYear;
            const matchMonth = (returnDate.getMonth() + 1).toString().padStart(2, '0') === currentMonthNum;
            return matchYear && matchMonth;
        });
        
        console.log('Returned items in current month:', returnedThisMonth.length);
        if (returnedThisMonth.length > 0) {
            console.log('Details of returned items:');
            returnedThisMonth.forEach(p => {
                const redemptionAmount = parseFloat(p.redemption_amount || p.redemptionAmount) || 0;
                console.log(`  - ID: ${p.id}, Customer: ${p.customer_name || p.customerName}, Return Date: ${p.return_date || p.returnDate}, Redemption: ${redemptionAmount}`);
            });
        }
        
        returnedPawnAmount = returnedThisMonth.reduce((sum, p) => {
            const redemptionAmount = parseFloat(p.redemption_amount || p.redemptionAmount) || 0;
            return sum + redemptionAmount;
        }, 0);
        
        console.log('Total returned pawn redemption amount:', returnedPawnAmount);
    }

    // Total pawn income = interest + redemption amount when customer returns
    incomePawn = parseFloat(pawnInterestAmount) + parseFloat(returnedPawnAmount);
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 สรุปรายรับขายฝาก (Pawn Income Summary)');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('1️⃣  ดอกเบี้ย (Interest):');
    console.log('   - จำนวนเงิน:', formatCurrency(pawnInterestAmount));
    console.log('   - มาจาก: รายการหักดอก/ต่อดอกในเดือนนี้');
    console.log('');
    console.log('2️⃣  ยอดไถ่ถอน (Redemption Amount):');
    console.log('   - จำนวนเงิน:', formatCurrency(returnedPawnAmount));
    console.log('   - มาจาก: ลูกค้ารับเครื่องคืนในเดือนนี้');
    console.log('');
    console.log('💰 รายรับขายฝากรวม = ดอกเบี้ย + ยอดไถ่ถอน');
    console.log('   ', formatCurrency(pawnInterestAmount), '+', formatCurrency(returnedPawnAmount), '=', formatCurrency(incomePawn));
    console.log('');
    console.log('✅ รายรับขายฝากที่แสดงในการ์ด:', formatCurrency(incomePawn));
    console.log('═══════════════════════════════════════════════════════════');

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
    if (statNewDevices) statNewDevices.textContent = realNewDevicesCount;
    if (statUsedDevices) statUsedDevices.textContent = realUsedDevicesCount;

    // Count repair devices (pending/in-progress)
    const realRepairCount = repairDevices ? repairDevices.filter(r =>
        r.store === currentStore && (r.status === 'pending' || r.status === 'in-progress')
    ).length : 0;
    if (statRepair) statRepair.textContent = realRepairCount;

    // Count installment devices (active)
    const realInstallmentCount = installmentDevices ? installmentDevices.filter(i =>
        i.store === currentStore && i.status === 'active'
    ).length : 0;
    if (statInstallment) statInstallment.textContent = realInstallmentCount;

    if (statPawn) statPawn.textContent = realPawnDevicesCount;

    // Update income first (will update total income, expense, and profit later after calculating expenses)
    const totalIncome = document.getElementById('totalIncome');
    const totalExpense = document.getElementById('totalExpense');
    const netProfit = document.getElementById('netProfit');

    if (totalIncome) totalIncome.textContent = formatCurrency(totalIncomeAmount);

    // Update income breakdown
    const incomeNewDevicesEl = document.getElementById('incomeNewDevices');
    const incomeUsedDevicesEl = document.getElementById('incomeUsedDevices');
    const incomeInstallmentEl = document.getElementById('incomeInstallment');
    const incomePawnEl = document.getElementById('incomePawn');
    const incomeRepairEl = document.getElementById('incomeRepair');

    if (incomeNewDevicesEl) incomeNewDevicesEl.textContent = formatCurrency(incomeNewDevices);
    if (incomeUsedDevicesEl) incomeUsedDevicesEl.textContent = formatCurrency(incomeUsedDevices);
    if (incomeInstallmentEl) incomeInstallmentEl.textContent = formatCurrency(incomeInstallment);
    if (incomePawnEl) {
        incomePawnEl.textContent = formatCurrency(incomePawn);
        console.log('💰 Income Pawn Card Updated:', formatCurrency(incomePawn));
    }
    if (incomeRepairEl) incomeRepairEl.textContent = formatCurrency(incomeRepair);

    // Calculate expense breakdown
    // Expense from new devices (purchase price of sold devices in current month)
    let expenseNewDevices = 0;
    if (newDevicesData.length > 0) {
        expenseNewDevices = newDevicesData
            .filter(d => d.status === 'sold' && (d.sale_date || d.saleDate))
            .filter(d => {
                const saleDate = new Date(d.sale_date || d.saleDate);
                return saleDate.getFullYear().toString() === currentYear &&
                       (saleDate.getMonth() + 1).toString().padStart(2, '0') === currentMonthNum;
            })
            .reduce((sum, d) => sum + ((d.purchase_price || d.purchasePrice) || 0), 0);
    }

    // Expense from used devices (purchase price of sold devices in current month)
    let expenseUsedDevices = 0;
    if (usedDevicesData.length > 0) {
        expenseUsedDevices = usedDevicesData
            .filter(d => d.status === 'sold' && (d.sale_date || d.saleDate))
            .filter(d => {
                const saleDate = new Date(d.sale_date || d.saleDate);
                return saleDate.getFullYear().toString() === currentYear &&
                       (saleDate.getMonth() + 1).toString().padStart(2, '0') === currentMonthNum;
            })
            .reduce((sum, d) => sum + ((d.purchase_price || d.purchasePrice) || 0), 0);
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

    // Expense from pawn (pawn amount given to customers when creating pawn record)
    let expensePawn = 0;
    if (pawnDevicesData && pawnDevicesData.length > 0) {
        expensePawn = pawnDevicesData
            .filter(p => (p.receive_date || p.receiveDate))
            .filter(p => {
                const receiveDate = new Date(p.receive_date || p.receiveDate);
                return receiveDate.getFullYear().toString() === currentYear &&
                       (receiveDate.getMonth() + 1).toString().padStart(2, '0') === currentMonthNum;
            })
            .reduce((sum, p) => sum + (parseFloat(p.pawn_amount || p.pawnAmount) || 0), 0);
        console.log('Pawn expense calculation:', {
            currentStore,
            currentMonth: `${currentYear}-${currentMonthNum}`,
            totalPawns: pawnDevicesData.length,
            filteredPawns: pawnDevicesData.filter(p => (p.receive_date || p.receiveDate)).length,
            expensePawn
        });
    }

    // Expense from accessories (cost price - not repair cost, but spare parts cost)
    let expenseAccessories = 0;
    // This would need accessories data with cost tracking

    // Calculate total expense
    const totalExpenseAmount = expenseNewDevices + expenseUsedDevices + expenseInstallment + expensePawn + expenseAccessories;
    
    console.log('Expense breakdown:', {
        newDevices: expenseNewDevices,
        usedDevices: expenseUsedDevices,
        installment: expenseInstallment,
        pawn: expensePawn,
        accessories: expenseAccessories,
        total: totalExpenseAmount
    });

    // Update expense breakdown
    const expenseNewDevicesEl = document.getElementById('expenseNewDevices');
    const expenseUsedDevicesEl = document.getElementById('expenseUsedDevices');
    const expenseInstallmentEl = document.getElementById('expenseInstallment');
    const expensePawnEl = document.getElementById('expensePawn');
    const expenseAccessoriesEl = document.getElementById('expenseAccessories');

    if (expenseNewDevicesEl) expenseNewDevicesEl.textContent = formatCurrency(expenseNewDevices);
    if (expenseUsedDevicesEl) expenseUsedDevicesEl.textContent = formatCurrency(expenseUsedDevices);
    if (expenseInstallmentEl) expenseInstallmentEl.textContent = formatCurrency(expenseInstallment);
    if (expensePawnEl) {
        expensePawnEl.textContent = formatCurrency(expensePawn);
        console.log('📤 Expense Pawn Card Updated:', formatCurrency(expensePawn));
    }
    if (expenseAccessoriesEl) expenseAccessoriesEl.textContent = formatCurrency(expenseAccessories);

    // Calculate profit breakdown
    const profitNewDevices = incomeNewDevices - expenseNewDevices;
    const profitUsedDevices = incomeUsedDevices - expenseUsedDevices;
    const profitInstallment = incomeInstallment - expenseInstallment;
    const profitPawn = incomePawn - expensePawn; // Income (interest + returned) - Expense (pawn amount)
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
        console.log('📊 Profit Pawn Card Updated:', formatCurrency(profitPawn), `(Income: ${formatCurrency(incomePawn)} - Expense: ${formatCurrency(expensePawn)})`);
    }
    if (profitRepairEl) {
        profitRepairEl.textContent = formatCurrency(profitRepair);
        profitRepairEl.parentElement.parentElement.classList.toggle('negative', profitRepair < 0);
    }

    // Update total expense with calculated value
    if (totalExpense) {
        totalExpense.textContent = formatCurrency(totalExpenseAmount);
        console.log('Total expense updated:', totalExpenseAmount);
    }

    // Recalculate net profit with real data
    const profit = totalIncomeAmount - totalExpenseAmount;
    console.log('Profit calculation:', {
        income: totalIncomeAmount,
        expense: totalExpenseAmount,
        profit: profit
    });
    
    if (netProfit) {
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
    // ตรวจสอบว่า amount เป็น number หรือไม่
    if (amount === undefined || amount === null || isNaN(amount)) {
        return '฿0';
    }
    // แปลงเป็น number ถ้าเป็น string
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return '฿' + numAmount.toLocaleString('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
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
async function openUsedDeviceModal(deviceId = null) {
    const modal = document.getElementById('usedDeviceModal');
    const modalTitle = document.getElementById('usedModalTitle');
    const form = document.getElementById('usedDeviceForm');

    // Reset form
    form.reset();
    currentUsedEditId = deviceId;

    if (deviceId) {
        // Edit mode
        modalTitle.textContent = 'แก้ไขข้อมูลเครื่องมือสอง';

        try {
            const device = await API.get(`${API_ENDPOINTS.usedDevices}/${deviceId}`);

            if (device) {
                document.getElementById('usedDeviceId').value = device.id;
                document.getElementById('usedBrand').value = device.brand;
                document.getElementById('usedModel').value = device.model;
                document.getElementById('usedColor').value = device.color;
                document.getElementById('usedImei').value = device.imei;
                document.getElementById('usedRam').value = device.ram;
                document.getElementById('usedRom').value = device.rom;
                document.getElementById('usedPurchasePrice').value = device.purchase_price || device.purchasePrice;
                document.getElementById('usedPurchaseDate').value = device.purchase_date || device.purchaseDate;
                document.getElementById('usedSalePrice').value = device.sale_price || device.salePrice;
                document.getElementById('usedSaleDate').value = device.sale_date || device.saleDate || '';
                document.getElementById('usedCondition').value = device.condition;
                document.getElementById('usedStatus').value = device.status;
                document.getElementById('usedNote').value = device.note || '';

                toggleUsedSaleDateField();
            }
        } catch (error) {
            console.error('Error loading device:', error);
            alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
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
async function saveUsedDevice(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const deviceData = {
        brand: formData.get('brand'),
        model: formData.get('model'),
        color: formData.get('color'),
        imei: formData.get('imei'),
        ram: formData.get('ram'),
        rom: formData.get('rom'),
        purchase_price: parseFloat(formData.get('purchasePrice')),
        purchase_date: formData.get('purchaseDate'),
        sale_price: parseFloat(formData.get('salePrice')),
        sale_date: formData.get('saleDate') || null,
        condition: formData.get('condition'),
        status: formData.get('status'),
        note: formData.get('note') || '',
        store: currentStore
    };

    try {
        if (currentUsedEditId) {
            await API.put(`${API_ENDPOINTS.usedDevices}/${currentUsedEditId}`, deviceData);
            showNotification('บันทึกข้อมูลสำเร็จ');
        } else {
            deviceData.id = 'U' + Date.now().toString();
            await API.post(API_ENDPOINTS.usedDevices, deviceData);
            showNotification('เพิ่มเครื่องมือสองสำเร็จ');
        }

        loadUsedDevicesData();
        closeUsedDeviceModal();
    } catch (error) {
        alert('เกิดข้อผิดพลาด: ' + error.message);
        console.error(error);
    }
}

// Load and display used devices data
function loadUsedDevicesData() {
    // Apply current filter (which will show current month by default)
    applyUsedDevicesFilter();

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
        // Handle both snake_case and camelCase field names
        const purchasePrice = device.purchase_price || device.purchasePrice;
        const salePrice = device.sale_price || device.salePrice;
        const purchaseDate = device.purchase_date || device.purchaseDate;
        const saleDate = device.sale_date || device.saleDate;

        if (type === 'stock') {
            return `
                <tr>
                    <td>${device.brand}</td>
                    <td>${device.model}</td>
                    <td>${device.color}</td>
                    <td>${device.imei}</td>
                    <td>${device.ram}/${device.rom} GB</td>
                    <td>${conditionLabels[device.condition]}</td>
                    <td>${formatCurrency(purchasePrice)}</td>
                    <td>${formatDate(purchaseDate)}</td>
                    <td>${formatCurrency(salePrice)}</td>
                    <td>
                        <button class="action-btn btn-sell" onclick="markUsedAsSold('${device.id}')">ขาย</button>
                        <button class="action-btn btn-remove" onclick="markUsedAsRemoved('${device.id}')">ตัด</button>
                        <button class="action-btn btn-edit" onclick="openUsedDeviceModal('${device.id}')">แก้ไข</button>
                        <button class="action-btn btn-delete" onclick="deleteUsedDevice('${device.id}')">ลบ</button>
                    </td>
                </tr>
            `;
        } else if (type === 'sold') {
            const profit = salePrice - purchasePrice;
            const profitColor = profit >= 0 ? '#10b981' : '#ef4444';
            return `
                <tr>
                    <td>${device.brand}</td>
                    <td>${device.model}</td>
                    <td>${device.color}</td>
                    <td>${device.imei}</td>
                    <td>${device.ram}/${device.rom} GB</td>
                    <td>${conditionLabels[device.condition]}</td>
                    <td>${formatCurrency(purchasePrice)}</td>
                    <td>${formatCurrency(salePrice)}</td>
                    <td>${formatDate(saleDate)}</td>
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
                    <td>${formatCurrency(purchasePrice)}</td>
                    <td>${formatDate(purchaseDate)}</td>
                    <td>${formatDate(saleDate)}</td>
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
async function markUsedAsSold(deviceId) {
    if (confirm('ต้องการบันทึกการขายเครื่องนี้หรือไม่?')) {
        try {
            await API.put(`${API_ENDPOINTS.usedDevices}/${deviceId}`, {
                status: 'sold',
                sale_date: new Date().toISOString().split('T')[0]
            });
            loadUsedDevicesData();
            showNotification('บันทึกการขายสำเร็จ');
        } catch (error) {
            alert('เกิดข้อผิดพลาด: ' + error.message);
            console.error(error);
        }
    }
}

// Mark used device as removed
async function markUsedAsRemoved(deviceId) {
    try {
        // Get device data
        const device = await API.get(`${API_ENDPOINTS.usedDevices}/${deviceId}`);
        if (!device) return;

        // Ask for removal type
        const choice = confirm('กดตกลงเพื่อ "ตัดขายให้เจ้าอื่น"\nกดยกเลิกเพื่อ "ตัดสลับในร้านตัวเอง"');

        if (choice) {
            // ตัดขายให้เจ้าอื่น
            const note = prompt('กรุณาระบุเหตุผลในการตัดขายให้เจ้าอื่น:');
            if (note !== null) {
                await API.put(`${API_ENDPOINTS.usedDevices}/${deviceId}`, {
                    status: 'removed',
                    sale_date: new Date().toISOString().split('T')[0],
                    note: note
                });
                loadUsedDevicesData();
                showNotification('ตัดออกสำเร็จ');
            }
        } else {
            // ตัดสลับในร้านตัวเอง
            const otherStore = device.store === 'salaya' ? 'klongyong' : 'salaya';
            const otherStoreName = stores[otherStore];

            if (confirm(`ต้องการย้ายเครื่องนี้ไปยัง ${otherStoreName} ใช่หรือไม่?`)) {
                await API.put(`${API_ENDPOINTS.usedDevices}/${deviceId}`, {
                    store: otherStore
                });
                loadUsedDevicesData();
                showNotification(`ย้ายเครื่องไปยัง ${otherStoreName} สำเร็จ`);
            }
        }
    } catch (error) {
        alert('เกิดข้อผิดพลาด: ' + error.message);
        console.error(error);
    }
}

// Delete used device
async function deleteUsedDevice(deviceId) {
    if (confirm('ต้องการลบข้อมูลนี้หรือไม่? (ไม่สามารถกู้คืนได้)')) {
        try {
            await API.delete(`${API_ENDPOINTS.usedDevices}/${deviceId}`);
            loadUsedDevicesData();
            showNotification('ลบข้อมูลสำเร็จ');
        } catch (error) {
            alert('เกิดข้อผิดพลาด: ' + error.message);
            console.error(error);
        }
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

// ===== CARD DETAILS DISPLAY (ALL CATEGORIES) =====

let currentCardDetailsPage = 1;
const CARD_ITEMS_PER_PAGE = 20;
let currentCardType = null;

// Show card details based on card type
async function showCardDetails(cardType) {
    currentCardDetailsPage = 1;
    currentCardType = cardType;

    const section = document.getElementById('cardDetailsSection');
    const content = document.getElementById('cardDetailsContent');
    const titleEl = document.getElementById('cardDetailsTitle');

    if (!section || !content) return;

    // Set title
    const titles = {
        'new-devices': '📱 รายการเครื่องใหม่ในสต็อก',
        'used-devices': '♻️ รายการเครื่องมือสองในสต็อก',
        'repair': '🔧 รายการซ่อมที่เสร็จสิ้น',
        'installment': '💳 รายการผ่อนที่เสร็จสิ้น',
        'pawn': '🏦 รายการขายฝากที่ยังคงอยู่'
    };
    if (titleEl) titleEl.textContent = titles[cardType] || 'รายละเอียด';

    // Show loading
    content.innerHTML = '<div class="loading">กำลังโหลดข้อมูล...</div>';
    section.style.display = 'block';

    // Scroll to section
    section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    try {
        const items = await getCardDetailsByType(cardType);
        displayCardDetailsItems(items);
    } catch (error) {
        content.innerHTML = '<div class="error">เกิดข้อผิดพลาดในการโหลดข้อมูล: ' + error.message + '</div>';
        console.error('Error loading card details:', error);
    }
}

// Get card details based on type
async function getCardDetailsByType(cardType) {
    const currentStore = document.getElementById('storeSelect').value;
    const currentMonth = document.getElementById('monthSelect').value;
    const [currentYear, currentMonthNum] = currentMonth.split('-');

    console.log('Getting card details:', {
        cardType,
        store: currentStore,
        month: currentMonth,
        year: currentYear,
        monthNum: currentMonthNum
    });

    let items = [];

    if (cardType === 'new-devices') {
        // New devices in stock
        const devices = await API.get(API_ENDPOINTS.newDevices, { store: currentStore });
        console.log('New devices from API:', devices.length, 'devices');
        const stockDevices = devices.filter(d => d.status === 'stock');
        console.log('Filtered (stock only):', stockDevices.length, 'devices');
        items = stockDevices.map(d => ({
                id: d.id,
                date: d.import_date || d.importDate,
                name: `${d.brand} ${d.model}`,
                color: d.color,
                specs: `${d.ram}/${d.rom} GB`,
                price: d.purchase_price || d.purchasePrice || 0,
                salePrice: d.sale_price || d.salePrice || 0,
                condition: d.device_condition || d.deviceCondition || '-',
                note: d.note || '-'
            }));
    } else if (cardType === 'used-devices') {
        // Used devices in stock
        const devices = await API.get(API_ENDPOINTS.usedDevices, { store: currentStore });
        items = devices
            .filter(d => d.status === 'stock')
            .map(d => ({
                id: d.id,
                date: d.import_date || d.importDate,
                name: `${d.brand} ${d.model}`,
                color: d.color,
                specs: `${d.ram}/${d.rom} GB`,
                price: d.purchase_price || d.purchasePrice || 0,
                salePrice: d.sale_price || d.salePrice || 0,
                condition: d.device_condition || d.deviceCondition || '-',
                note: d.note || '-'
            }));
    } else if (cardType === 'repair') {
        // Completed repairs in current month
        const repairs = repairDevices || [];
        items = repairs
            .filter(r => r.store === currentStore && r.status === 'completed' && r.completedDate)
            .filter(r => {
                const completedDate = new Date(r.completedDate);
                return completedDate.getFullYear().toString() === currentYear &&
                       (completedDate.getMonth() + 1).toString().padStart(2, '0') === currentMonthNum;
            })
            .map(r => ({
                id: r.id,
                date: r.completedDate,
                name: r.deviceName || `${r.brand || ''} ${r.model || ''}`,
                customer: r.customerName || '-',
                problem: r.problemDescription || '-',
                price: r.repairCost || 0,
                note: r.note || '-'
            }));
    } else if (cardType === 'installment') {
        // Completed installments in current month
        const installments = installmentDevices || [];
        items = installments
            .filter(i => i.store === currentStore && i.status === 'completed' && i.completedDate)
            .filter(i => {
                const completedDate = new Date(i.completedDate);
                return completedDate.getFullYear().toString() === currentYear &&
                       (completedDate.getMonth() + 1).toString().padStart(2, '0') === currentMonthNum;
            })
            .map(i => ({
                id: i.id,
                date: i.completedDate,
                name: `${i.brand} ${i.model}`,
                customer: i.customerName || '-',
                color: i.color,
                specs: `${i.ram}/${i.rom} GB`,
                totalPrice: i.salePrice || 0,
                downPayment: i.downPayment || 0,
                installments: i.installmentCount || 0,
                note: i.note || '-'
            }));
    } else if (cardType === 'pawn') {
        // Active pawn devices
        const pawns = await API.get(API_ENDPOINTS.pawn, { store: currentStore });
        console.log('==================== PAWN CARD DETAILS ====================');
        console.log('Current Store:', currentStore);
        console.log('Pawn devices from API:', pawns.length, 'items');
        console.log('All pawn data:', pawns);
        
        // Show status breakdown
        const statusCount = {
            active: pawns.filter(p => p.status === 'active').length,
            returned: pawns.filter(p => p.status === 'returned').length,
            seized: pawns.filter(p => p.status === 'seized').length
        };
        console.log('Status breakdown:', statusCount);
        
        const activePawns = pawns.filter(p => p.status === 'active');
        console.log('Filtered (active only):', activePawns.length, 'items');
        
        if (activePawns.length > 0) {
            console.log('Active pawn details:', activePawns);
        }
        console.log('=========================================================');
        
        items = activePawns.map(p => ({
                id: p.id,
                date: p.receive_date || p.receiveDate,
                customer: p.customer_name || p.customerName || '-',
                name: `${p.brand} ${p.model}`,
                color: p.color,
                specs: `${p.ram}/${p.rom} GB`,
                pawnAmount: p.pawn_amount || p.pawnAmount || 0,
                interest: p.interest || 0,
                dueDate: p.due_date || p.dueDate,
                interestMethod: p.interest_collection_method || p.interestCollectionMethod || 'not_deducted',
                redemptionAmount: p.redemption_amount || p.redemptionAmount || 0,
                note: p.note || '-'
            }));
    }

    // Sort by date (newest first)
    items.sort((a, b) => new Date(b.date) - new Date(a.date));

    return items;
}

// Display card details with pagination
function displayCardDetailsItems(items) {
    const content = document.getElementById('cardDetailsContent');
    const pagination = document.getElementById('cardDetailsPagination');

    if (!content || !pagination) return;

    console.log(`Card details (${currentCardType}):`, {
        totalItems: items.length,
        currentStore: document.getElementById('storeSelect').value,
        currentMonth: document.getElementById('monthSelect').value
    });

    if (items.length === 0) {
        let message = '<div class="no-data">';
        message += '<p style="font-size: 1.2rem; margin-bottom: 1rem;">📭 ไม่มีข้อมูลในขณะนี้</p>';
        message += '<p style="color: #9ca3af; font-size: 0.9rem;">กรุณาตรวจสอบ:</p>';
        message += '<ul style="list-style: none; padding: 0; color: #9ca3af; font-size: 0.9rem;">';
        message += '<li>✓ เลือกร้านที่ถูกต้อง</li>';
        
        if (currentCardType === 'repair' || currentCardType === 'installment') {
            message += '<li>✓ เลือกเดือนที่มีรายการเสร็จสิ้น</li>';
        } else if (currentCardType === 'new-devices' || currentCardType === 'used-devices') {
            message += '<li>✓ มีเครื่องในสต็อกหรือไม่</li>';
        } else if (currentCardType === 'pawn') {
            message += '<li>✓ มีเครื่องขายฝากที่ยังไม่รับคืนหรือไม่</li>';
        }
        
        message += '</ul></div>';
        content.innerHTML = message;
        pagination.innerHTML = '';
        return;
    }

    // Calculate pagination
    const totalPages = Math.ceil(items.length / CARD_ITEMS_PER_PAGE);
    const startIndex = (currentCardDetailsPage - 1) * CARD_ITEMS_PER_PAGE;
    const endIndex = startIndex + CARD_ITEMS_PER_PAGE;
    const currentItems = items.slice(startIndex, endIndex);

    // Display items
    let html = '<div class="card-details-table">';
    html += '<table>';
    html += '<thead><tr>';

    // Headers based on card type
    if (currentCardType === 'new-devices' || currentCardType === 'used-devices') {
        html += '<th>วันที่นำเข้า</th><th>รุ่น</th><th>สี</th><th>RAM/ROM</th><th>สภาพ</th><th>ราคาทุน</th><th>ราคาขาย</th><th>หมายเหตุ</th>';
    } else if (currentCardType === 'repair') {
        html += '<th>วันที่เสร็จ</th><th>เครื่อง</th><th>ลูกค้า</th><th>ปัญหา</th><th>ค่าซ่อม</th><th>หมายเหตุ</th>';
    } else if (currentCardType === 'installment') {
        html += '<th>วันที่เสร็จ</th><th>รุ่น</th><th>ลูกค้า</th><th>สี</th><th>RAM/ROM</th><th>ราคารวม</th><th>เงินดาวน์</th><th>งวด</th>';
    } else if (currentCardType === 'pawn') {
        html += '<th>วันรับ</th><th>ลูกค้า</th><th>รุ่น</th><th>สี</th><th>RAM/ROM</th><th>ยอดฝาก</th><th>ดอกเบี้ย</th><th>วันครบกำหนด</th><th>ยอดไถ่ถอน</th>';
    }

    html += '</tr></thead><tbody>';

    currentItems.forEach(item => {
        html += '<tr>';

        if (currentCardType === 'new-devices' || currentCardType === 'used-devices') {
            html += `<td>${formatDate(item.date)}</td>`;
            html += `<td>${item.name}</td>`;
            html += `<td>${item.color}</td>`;
            html += `<td>${item.specs}</td>`;
            html += `<td>${item.condition}</td>`;
            html += `<td>${formatCurrency(item.price)}</td>`;
            html += `<td>${formatCurrency(item.salePrice)}</td>`;
            html += `<td>${item.note}</td>`;
        } else if (currentCardType === 'repair') {
            html += `<td>${formatDate(item.date)}</td>`;
            html += `<td>${item.name}</td>`;
            html += `<td>${item.customer}</td>`;
            html += `<td>${item.problem}</td>`;
            html += `<td class="income">${formatCurrency(item.price)}</td>`;
            html += `<td>${item.note}</td>`;
        } else if (currentCardType === 'installment') {
            html += `<td>${formatDate(item.date)}</td>`;
            html += `<td>${item.name}</td>`;
            html += `<td>${item.customer}</td>`;
            html += `<td>${item.color}</td>`;
            html += `<td>${item.specs}</td>`;
            html += `<td>${formatCurrency(item.totalPrice)}</td>`;
            html += `<td>${formatCurrency(item.downPayment)}</td>`;
            html += `<td>${item.installments} งวด</td>`;
        } else if (currentCardType === 'pawn') {
            html += `<td>${formatDate(item.date)}</td>`;
            html += `<td>${item.customer}</td>`;
            html += `<td>${item.name}</td>`;
            html += `<td>${item.color}</td>`;
            html += `<td>${item.specs}</td>`;
            html += `<td>${formatCurrency(item.pawnAmount)}</td>`;
            html += `<td>${formatCurrency(item.interest)}</td>`;
            html += `<td>${formatDate(item.dueDate)}</td>`;
            html += `<td class="income">${formatCurrency(item.redemptionAmount)}</td>`;
        }

        html += '</tr>';
    });

    html += '</tbody></table></div>';
    content.innerHTML = html;

    // Display pagination
    if (totalPages > 1) {
        let paginationHtml = '<div class="pagination-controls">';
        paginationHtml += `<span>แสดง ${startIndex + 1}-${Math.min(endIndex, items.length)} จาก ${items.length} รายการ</span>`;
        paginationHtml += '<div class="pagination-buttons">';

        if (currentCardDetailsPage > 1) {
            paginationHtml += `<button class="btn btn-secondary" onclick="changeCardDetailsPage(${currentCardDetailsPage - 1})">← ก่อนหน้า</button>`;
        }

        for (let i = 1; i <= totalPages; i++) {
            if (i === currentCardDetailsPage) {
                paginationHtml += `<button class="btn btn-primary">${i}</button>`;
            } else if (i === 1 || i === totalPages || (i >= currentCardDetailsPage - 1 && i <= currentCardDetailsPage + 1)) {
                paginationHtml += `<button class="btn btn-secondary" onclick="changeCardDetailsPage(${i})">${i}</button>`;
            } else if (i === currentCardDetailsPage - 2 || i === currentCardDetailsPage + 2) {
                paginationHtml += `<span>...</span>`;
            }
        }

        if (currentCardDetailsPage < totalPages) {
            paginationHtml += `<button class="btn btn-secondary" onclick="changeCardDetailsPage(${currentCardDetailsPage + 1})">ถัดไป →</button>`;
        }

        paginationHtml += '</div></div>';
        pagination.innerHTML = paginationHtml;
    } else {
        pagination.innerHTML = '';
    }
}

// Change card details page
async function changeCardDetailsPage(page) {
    currentCardDetailsPage = page;
    await showCardDetails(currentCardType);
}

// Close card details
function closeCardDetails() {
    const section = document.getElementById('cardDetailsSection');
    if (section) section.style.display = 'none';
}

// ===== PAWN DETAILS DISPLAY =====

let currentPawnDetailsPage = 1;
const ITEMS_PER_PAGE = 20;

// Show pawn details based on type (income/expense/profit)
async function showPawnDetails(type) {
    currentPawnDetailsPage = 1;

    if (type === 'income') {
        // For income, show both interest and returned sections
        await showPawnInterestDetails();
        await showPawnReturnDetails();
    } else if (type === 'expense') {
        // For expense, show both active and returned sections
        await showPawnExpenseActiveDetails();
        await showPawnExpenseReturnedDetails();
    } else {
        // For profit, use original logic
        const sectionId = 'pawnProfitDetailsSection';
        const contentId = 'pawnProfitDetailsContent';
        const paginationId = 'pawnProfitDetailsPagination';

        const section = document.getElementById(sectionId);
        const content = document.getElementById(contentId);

        if (!section || !content) return;

        content.innerHTML = '<div class="loading">กำลังโหลดข้อมูล...</div>';
        section.style.display = 'block';
        section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        try {
            const items = await getPawnDetailsByType(type);
            displayPawnDetailsItems(items, contentId, paginationId, type);
        } catch (error) {
            content.innerHTML = '<div class="error">เกิดข้อผิดพลาดในการโหลดข้อมูล</div>';
            console.error('Error loading pawn details:', error);
        }
    }
}

// Show pawn interest details (ดอกเบี้ย)
async function showPawnInterestDetails() {
    const section = document.getElementById('pawnDetailsSection');
    const content = document.getElementById('pawnDetailsContent');
    const pagination = document.getElementById('pawnDetailsPagination');

    if (!section || !content) return;

    content.innerHTML = '<div class="loading">กำลังโหลดข้อมูล...</div>';
    section.style.display = 'block';
    section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    try {
        const items = await getPawnInterestItems();
        displayPawnDetailsItems(items, 'pawnDetailsContent', 'pawnDetailsPagination', 'income');
    } catch (error) {
        content.innerHTML = '<div class="error">เกิดข้อผิดพลาดในการโหลดข้อมูลดอกเบี้ย</div>';
        console.error('Error loading interest details:', error);
    }
}

// Show pawn return details (รับเครื่องคืน)
async function showPawnReturnDetails() {
    const section = document.getElementById('pawnReturnDetailsSection');
    const content = document.getElementById('pawnReturnDetailsContent');
    const pagination = document.getElementById('pawnReturnDetailsPagination');

    if (!section || !content) return;

    content.innerHTML = '<div class="loading">กำลังโหลดข้อมูล...</div>';
    section.style.display = 'block';

    try {
        const items = await getPawnReturnItems();
        displayPawnReturnItems(items);
    } catch (error) {
        content.innerHTML = '<div class="error">เกิดข้อผิดพลาดในการโหลดข้อมูลรับเครื่องคืน</div>';
        console.error('Error loading return details:', error);
    }
}

// Get pawn interest items only
async function getPawnInterestItems() {
    // Use global currentStore and currentMonth variables
    const [year, month] = currentMonth.split('-');
    
    let items = [];
    
    try {
        const pawnDevices = await API.get(API_ENDPOINTS.pawn, { store: currentStore });
        const transactions = await API.get('http://localhost:5001/api/pawn-interest', {
            store: currentStore,
            year: year,
            month: month
        });

        if (Array.isArray(transactions)) {
            items = transactions.map(t => {
                const pawn = pawnDevices.find(p => p.id === t.pawn_id);
                return {
                    id: t.pawn_id,
                    date: t.transaction_date,
                    customer: pawn ? (pawn.customer_name || pawn.customerName || '-') : '-',
                    device: pawn ? `${pawn.brand} ${pawn.model}` : '-',
                    amount: parseFloat(t.interest_amount) || 0,
                    type: 'interest',
                    description: t.transaction_type === 'initial_deduction' ? 'หักดอกเบี้ย' : 'ต่อดอกเบี้ย'
                };
            });
        }
    } catch (error) {
        console.error('Error loading interest items:', error);
    }

    items.sort((a, b) => new Date(b.date) - new Date(a.date));
    return items;
}

// Get pawn return items only
async function getPawnReturnItems() {
    // Use global currentStore and currentMonth variables
    console.log('==================== GET PAWN RETURN ITEMS ====================');
    console.log('Current Store:', currentStore);
    console.log('Current Month (raw):', currentMonth);
    
    const [currentYear, currentMonthNum] = currentMonth.split('-');
    console.log('Current Year:', currentYear);
    console.log('Current Month Num:', currentMonthNum);
    
    let items = [];
    
    try {
        const pawnDevices = await API.get(API_ENDPOINTS.pawn, { store: currentStore });
        console.log('Total pawn devices from API:', pawnDevices.length);
        
        const returnedAll = pawnDevices.filter(p => p.status === 'returned' && (p.return_date || p.returnDate));
        console.log('Returned items (all):', returnedAll.length);
        
        if (returnedAll.length > 0) {
            console.log('All returned items details:');
            returnedAll.forEach(p => {
                console.log(`  - ID: ${p.id}, Customer: ${p.customer_name || p.customerName}, Return Date: ${p.return_date || p.returnDate}, Redemption: ${p.redemption_amount || p.redemptionAmount}`);
            });
        }
        
        items = pawnDevices
            .filter(p => p.status === 'returned' && (p.return_date || p.returnDate))
            .filter(p => {
                const returnDate = new Date(p.return_date || p.returnDate);
                const matchYear = returnDate.getFullYear().toString() === currentYear;
                const matchMonth = (returnDate.getMonth() + 1).toString().padStart(2, '0') === currentMonthNum;
                console.log(`  Checking: ${p.id}, Return Date: ${p.return_date || p.returnDate}, Year Match: ${matchYear}, Month Match: ${matchMonth}`);
                return matchYear && matchMonth;
            })
            .map(p => ({
                id: p.id,
                date: p.return_date || p.returnDate,
                customer: p.customer_name || p.customerName || '-',
                device: `${p.brand} ${p.model}`,
                pawnAmount: parseFloat(p.pawn_amount || p.pawnAmount) || 0,
                interest: parseFloat(p.interest) || 0,
                redemptionAmount: parseFloat(p.redemption_amount || p.redemptionAmount) || 0,
                interestMethod: p.interest_collection_method || p.interestCollectionMethod || 'not_deducted',
                type: 'returned',
                description: 'รับเครื่องคืน'
            }));
        
        console.log('Filtered returned items in current month:', items.length);
        if (items.length > 0) {
            console.log('Returned items details:');
            items.forEach(item => {
                console.log(`  - ${item.customer}: ${item.device}, Redemption: ${item.redemptionAmount}`);
            });
        }
    } catch (error) {
        console.error('Error loading return items:', error);
    }
    
    console.log('============================================================');

    items.sort((a, b) => new Date(b.date) - new Date(a.date));
    return items;
}

// Display pawn return items
function displayPawnReturnItems(items) {
    const content = document.getElementById('pawnReturnDetailsContent');
    const pagination = document.getElementById('pawnReturnDetailsPagination');

    if (!content) return;

    if (items.length === 0) {
        content.innerHTML = '<div class="no-data">ไม่มีรายการรับเครื่องคืนในเดือนนี้</div>';
        if (pagination) pagination.innerHTML = '';
        return;
    }

    // Display items
    let html = '<div class="pawn-details-table">';
    html += '<table>';
    html += '<thead>';
    html += '<tr>';
    html += '<th>วันที่</th>';
    html += '<th>ลูกค้า</th>';
    html += '<th>เครื่อง</th>';
    html += '<th>ยอดฝาก</th>';
    html += '<th>ดอกเบี้ย</th>';
    html += '<th>วิธีเก็บดอก</th>';
    html += '<th>ยอดไถ่ถอน</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';

    items.forEach(item => {
        const interestMethodText = item.interestMethod === 'deducted' ? 'หักดอก' : 'ยังไม่หักดอก';
        
        html += '<tr>';
        html += `<td>${formatDate(item.date)}</td>`;
        html += `<td>${item.customer}</td>`;
        html += `<td>${item.device}</td>`;
        html += `<td>${formatCurrency(item.pawnAmount)}</td>`;
        html += `<td>${formatCurrency(item.interest)}</td>`;
        html += `<td>${interestMethodText}</td>`;
        html += `<td class="income"><strong>${formatCurrency(item.redemptionAmount)}</strong></td>`;
        html += '</tr>';
    });

    html += '</tbody>';
    html += '<tfoot>';
    html += '<tr style="background: #f0fdf4; font-weight: bold;">';
    html += '<td colspan="6" style="text-align: right;">รวมยอดรับคืน:</td>';
    const totalRedemption = items.reduce((sum, item) => sum + item.redemptionAmount, 0);
    html += `<td class="income"><strong>${formatCurrency(totalRedemption)}</strong></td>`;
    html += '</tr>';
    html += '</tfoot>';
    html += '</table>';
    html += '</div>';

    content.innerHTML = html;
    if (pagination) pagination.innerHTML = '';
}

// Show pawn expense active details (รายการขายฝากที่อยู่)
async function showPawnExpenseActiveDetails() {
    const section = document.getElementById('pawnExpenseActiveDetailsSection');
    const content = document.getElementById('pawnExpenseActiveDetailsContent');
    const pagination = document.getElementById('pawnExpenseActiveDetailsPagination');

    if (!section || !content) return;

    content.innerHTML = '<div class="loading">กำลังโหลดข้อมูล...</div>';
    section.style.display = 'block';
    section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    try {
        const items = await getPawnExpenseActiveItems();
        displayPawnExpenseActiveItems(items);
    } catch (error) {
        content.innerHTML = '<div class="error">เกิดข้อผิดพลาดในการโหลดข้อมูลรายการขายฝาก</div>';
        console.error('Error loading expense active details:', error);
    }
}

// Show pawn expense returned details (รายการรับเครื่องคืนแล้ว)
async function showPawnExpenseReturnedDetails() {
    const section = document.getElementById('pawnExpenseReturnedDetailsSection');
    const content = document.getElementById('pawnExpenseReturnedDetailsContent');
    const pagination = document.getElementById('pawnExpenseReturnedDetailsPagination');

    if (!section || !content) return;

    content.innerHTML = '<div class="loading">กำลังโหลดข้อมูล...</div>';
    section.style.display = 'block';

    try {
        const items = await getPawnExpenseReturnedItems();
        displayPawnExpenseReturnedItems(items);
    } catch (error) {
        content.innerHTML = '<div class="error">เกิดข้อผิดพลาดในการโหลดข้อมูลรับเครื่องคืน</div>';
        console.error('Error loading expense returned details:', error);
    }
}

// Get pawn expense active items (รายการขายฝากที่อยู่)
async function getPawnExpenseActiveItems() {
    // Use global currentStore and currentMonth variables
    const [currentYear, currentMonthNum] = currentMonth.split('-');
    
    let items = [];
    
    try {
        const pawnDevices = await API.get(API_ENDPOINTS.pawn, { store: currentStore });
        
        items = pawnDevices
            .filter(p => p.status === 'active' && (p.receive_date || p.receiveDate))
            .filter(p => {
                const receiveDate = new Date(p.receive_date || p.receiveDate);
                return receiveDate.getFullYear().toString() === currentYear &&
                       (receiveDate.getMonth() + 1).toString().padStart(2, '0') === currentMonthNum;
            })
            .map(p => ({
                id: p.id,
                date: p.receive_date || p.receiveDate,
                customer: p.customer_name || p.customerName || '-',
                device: `${p.brand} ${p.model}`,
                color: p.color,
                specs: `${p.ram}/${p.rom} GB`,
                pawnAmount: parseFloat(p.pawn_amount || p.pawnAmount) || 0,
                interest: parseFloat(p.interest) || 0,
                dueDate: p.due_date || p.dueDate,
                interestMethod: p.interest_collection_method || p.interestCollectionMethod || 'not_deducted',
                redemptionAmount: parseFloat(p.redemption_amount || p.redemptionAmount) || 0,
                note: p.note || '-'
            }));
    } catch (error) {
        console.error('Error loading expense active items:', error);
    }

    items.sort((a, b) => new Date(b.date) - new Date(a.date));
    return items;
}

// Get pawn expense returned items (รายการรับเครื่องคืนแล้ว)
async function getPawnExpenseReturnedItems() {
    // Use global currentStore and currentMonth variables
    const [currentYear, currentMonthNum] = currentMonth.split('-');
    
    let items = [];
    
    try {
        const pawnDevices = await API.get(API_ENDPOINTS.pawn, { store: currentStore });
        
        items = pawnDevices
            .filter(p => p.status === 'returned' && (p.receive_date || p.receiveDate))
            .filter(p => {
                const receiveDate = new Date(p.receive_date || p.receiveDate);
                return receiveDate.getFullYear().toString() === currentYear &&
                       (receiveDate.getMonth() + 1).toString().padStart(2, '0') === currentMonthNum;
            })
            .map(p => ({
                id: p.id,
                dateReceived: p.receive_date || p.receiveDate,
                dateReturned: p.return_date || p.returnDate,
                customer: p.customer_name || p.customerName || '-',
                device: `${p.brand} ${p.model}`,
                color: p.color,
                specs: `${p.ram}/${p.rom} GB`,
                pawnAmount: parseFloat(p.pawn_amount || p.pawnAmount) || 0,
                interest: parseFloat(p.interest) || 0,
                interestMethod: p.interest_collection_method || p.interestCollectionMethod || 'not_deducted',
                redemptionAmount: parseFloat(p.redemption_amount || p.redemptionAmount) || 0,
                note: p.note || '-'
            }));
    } catch (error) {
        console.error('Error loading expense returned items:', error);
    }

    items.sort((a, b) => new Date(b.dateReceived) - new Date(a.dateReceived));
    return items;
}

// Display pawn expense active items
function displayPawnExpenseActiveItems(items) {
    const content = document.getElementById('pawnExpenseActiveDetailsContent');
    const pagination = document.getElementById('pawnExpenseActiveDetailsPagination');

    if (!content) return;

    if (items.length === 0) {
        content.innerHTML = '<div class="no-data">ไม่มีรายการขายฝากที่อยู่ในเดือนนี้</div>';
        if (pagination) pagination.innerHTML = '';
        return;
    }

    // Display items
    let html = '<div class="pawn-details-table">';
    html += '<table>';
    html += '<thead>';
    html += '<tr>';
    html += '<th>วันที่รับ</th>';
    html += '<th>ลูกค้า</th>';
    html += '<th>เครื่อง</th>';
    html += '<th>สี</th>';
    html += '<th>RAM/ROM</th>';
    html += '<th>ยอดฝาก</th>';
    html += '<th>ดอกเบี้ย</th>';
    html += '<th>วันครบกำหนด</th>';
    html += '<th>หมายเหตุ</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';

    items.forEach(item => {
        html += '<tr>';
        html += `<td>${formatDate(item.date)}</td>`;
        html += `<td>${item.customer}</td>`;
        html += `<td>${item.device}</td>`;
        html += `<td>${item.color}</td>`;
        html += `<td>${item.specs}</td>`;
        html += `<td class="expense"><strong>${formatCurrency(item.pawnAmount)}</strong></td>`;
        html += `<td>${formatCurrency(item.interest)}</td>`;
        html += `<td>${formatDate(item.dueDate)}</td>`;
        html += `<td>${item.note}</td>`;
        html += '</tr>';
    });

    html += '</tbody>';
    html += '<tfoot>';
    html += '<tr style="background: #fef2f2; font-weight: bold;">';
    html += '<td colspan="5" style="text-align: right;">รวมยอดจ่าย:</td>';
    const totalPawnAmount = items.reduce((sum, item) => sum + item.pawnAmount, 0);
    html += `<td class="expense"><strong>${formatCurrency(totalPawnAmount)}</strong></td>`;
    html += '<td colspan="3"></td>';
    html += '</tr>';
    html += '</tfoot>';
    html += '</table>';
    html += '</div>';

    content.innerHTML = html;
    if (pagination) pagination.innerHTML = '';
}

// Display pawn expense returned items
function displayPawnExpenseReturnedItems(items) {
    const content = document.getElementById('pawnExpenseReturnedDetailsContent');
    const pagination = document.getElementById('pawnExpenseReturnedDetailsPagination');

    if (!content) return;

    if (items.length === 0) {
        content.innerHTML = '<div class="no-data">ไม่มีรายการรับเครื่องคืนในเดือนนี้</div>';
        if (pagination) pagination.innerHTML = '';
        return;
    }

    // Display items
    let html = '<div class="pawn-details-table">';
    html += '<table>';
    html += '<thead>';
    html += '<tr>';
    html += '<th>วันที่รับ</th>';
    html += '<th>วันที่คืน</th>';
    html += '<th>ลูกค้า</th>';
    html += '<th>เครื่อง</th>';
    html += '<th>สี</th>';
    html += '<th>RAM/ROM</th>';
    html += '<th>ยอดฝาก</th>';
    html += '<th>ดอกเบี้ย</th>';
    html += '<th>หมายเหตุ</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';

    items.forEach(item => {
        html += '<tr>';
        html += `<td>${formatDate(item.dateReceived)}</td>`;
        html += `<td><span style="color: #059669; font-weight: 600;">${formatDate(item.dateReturned)}</span></td>`;
        html += `<td>${item.customer}</td>`;
        html += `<td>${item.device}</td>`;
        html += `<td>${item.color}</td>`;
        html += `<td>${item.specs}</td>`;
        html += `<td class="expense"><strong>${formatCurrency(item.pawnAmount)}</strong></td>`;
        html += `<td>${formatCurrency(item.interest)}</td>`;
        html += `<td>${item.note}</td>`;
        html += '</tr>';
    });

    html += '</tbody>';
    html += '<tfoot>';
    html += '<tr style="background: #fef2f2; font-weight: bold;">';
    html += '<td colspan="6" style="text-align: right;">รวมยอดจ่าย:</td>';
    const totalPawnAmount = items.reduce((sum, item) => sum + item.pawnAmount, 0);
    html += `<td class="expense"><strong>${formatCurrency(totalPawnAmount)}</strong></td>`;
    html += '<td colspan="2"></td>';
    html += '</tr>';
    html += '</tfoot>';
    html += '</table>';
    html += '</div>';

    content.innerHTML = html;
    if (pagination) pagination.innerHTML = '';
}

// Get pawn details based on type
async function getPawnDetailsByType(type) {
    const currentStore = document.getElementById('storeSelect').value;
    const currentMonth = document.getElementById('monthSelect').value;
    const [currentYear, currentMonthNum] = currentMonth.split('-');

    let items = [];

    // Get pawn devices
    const pawnDevices = await API.get(API_ENDPOINTS.pawn, { store: currentStore });

    if (type === 'expense') {
        // Expense: pawn_amount when receive_date in current month
        items = pawnDevices
            .filter(p => p.receive_date || p.receiveDate)
            .filter(p => {
                const receiveDate = new Date(p.receive_date || p.receiveDate);
                return receiveDate.getFullYear().toString() === currentYear &&
                       (receiveDate.getMonth() + 1).toString().padStart(2, '0') === currentMonthNum;
            })
            .map(p => ({
                id: p.id,
                date: p.receive_date || p.receiveDate,
                customer: p.customer_name || p.customerName || '-',
                device: `${p.brand} ${p.model}`,
                amount: p.pawn_amount || p.pawnAmount || 0,
                type: 'expense',
                description: 'จ่ายให้ลูกค้า'
            }));
    } else if (type === 'income') {
        // Income: interest + returned amount

        // 1. Get interest transactions
        try {
            const [year, month] = currentMonth.split('-');
            const transactions = await API.get('http://localhost:5001/api/pawn-interest', {
                store: currentStore,
                year: year,
                month: month
            });

            if (Array.isArray(transactions)) {
                const interestItems = transactions.map(t => {
                    const pawn = pawnDevices.find(p => p.id === t.pawn_id);
                    return {
                        id: t.pawn_id,
                        date: t.transaction_date,
                        customer: pawn ? (pawn.customer_name || pawn.customerName || '-') : '-',
                        device: pawn ? `${pawn.brand} ${pawn.model}` : '-',
                        amount: parseFloat(t.interest_amount) || 0,
                        type: 'interest',
                        description: t.transaction_type === 'initial_deduction' ? 'หักดอกเบี้ย' : 'ต่อดอกเบี้ย'
                    };
                });
                items.push(...interestItems);
            }
        } catch (error) {
            console.error('Error loading interest transactions:', error);
        }

        // 2. Get returned devices
        const returnedItems = pawnDevices
            .filter(p => p.status === 'returned' && (p.return_date || p.returnDate))
            .filter(p => {
                const returnDate = new Date(p.return_date || p.returnDate);
                return returnDate.getFullYear().toString() === currentYear &&
                       (returnDate.getMonth() + 1).toString().padStart(2, '0') === currentMonthNum;
            })
            .map(p => ({
                id: p.id,
                date: p.return_date || p.returnDate,
                customer: p.customer_name || p.customerName || '-',
                device: `${p.brand} ${p.model}`,
                amount: p.pawn_amount || p.pawnAmount || 0,
                type: 'returned',
                description: 'รับคืนจากลูกค้า'
            }));

        items.push(...returnedItems);
    } else if (type === 'profit') {
        // Profit: show both income and expense

        // Get income items first
        const incomeItems = await getPawnDetailsByType('income');
        const expenseItems = await getPawnDetailsByType('expense');

        items = [...incomeItems, ...expenseItems];
    }

    // Sort by date (newest first)
    items.sort((a, b) => new Date(b.date) - new Date(a.date));

    return items;
}

// Display pawn details with pagination
function displayPawnDetailsItems(items, contentId, paginationId, type) {
    const content = document.getElementById(contentId);
    const pagination = document.getElementById(paginationId);

    if (!content || !pagination) return;

    if (items.length === 0) {
        content.innerHTML = '<div class="no-data">ไม่มีข้อมูลในเดือนนี้</div>';
        pagination.innerHTML = '';
        return;
    }

    // Calculate pagination
    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
    const startIndex = (currentPawnDetailsPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = items.slice(startIndex, endIndex);

    // Display items
    let html = '<div class="pawn-details-table">';
    html += '<table>';
    html += '<thead>';
    html += '<tr>';
    html += '<th>วันที่</th>';
    html += '<th>ลูกค้า</th>';
    html += '<th>เครื่อง</th>';
    html += '<th>รายการ</th>';
    html += '<th>จำนวนเงิน</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';

    currentItems.forEach(item => {
        const typeClass = item.type === 'expense' ? 'expense' : 'income';
        const typeIcon = item.type === 'expense' ? '📤' : '📥';

        html += '<tr>';
        html += `<td>${formatDate(item.date)}</td>`;
        html += `<td>${item.customer}</td>`;
        html += `<td>${item.device}</td>`;
        html += `<td>${typeIcon} ${item.description}</td>`;
        html += `<td class="${typeClass}">${formatCurrency(item.amount)}</td>`;
        html += '</tr>';
    });

    html += '</tbody>';
    html += '</table>';
    html += '</div>';

    content.innerHTML = html;

    // Display pagination
    if (totalPages > 1) {
        let paginationHtml = '<div class="pagination-controls">';
        paginationHtml += `<span>แสดง ${startIndex + 1}-${Math.min(endIndex, items.length)} จาก ${items.length} รายการ</span>`;
        paginationHtml += '<div class="pagination-buttons">';

        // Previous button
        if (currentPawnDetailsPage > 1) {
            paginationHtml += `<button class="btn btn-secondary" onclick="changePawnDetailsPage(${currentPawnDetailsPage - 1}, '${type}')">← ก่อนหน้า</button>`;
        }

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === currentPawnDetailsPage) {
                paginationHtml += `<button class="btn btn-primary">${i}</button>`;
            } else if (i === 1 || i === totalPages || (i >= currentPawnDetailsPage - 1 && i <= currentPawnDetailsPage + 1)) {
                paginationHtml += `<button class="btn btn-secondary" onclick="changePawnDetailsPage(${i}, '${type}')">${i}</button>`;
            } else if (i === currentPawnDetailsPage - 2 || i === currentPawnDetailsPage + 2) {
                paginationHtml += `<span>...</span>`;
            }
        }

        // Next button
        if (currentPawnDetailsPage < totalPages) {
            paginationHtml += `<button class="btn btn-secondary" onclick="changePawnDetailsPage(${currentPawnDetailsPage + 1}, '${type}')">ถัดไป →</button>`;
        }

        paginationHtml += '</div>';
        paginationHtml += '</div>';
        pagination.innerHTML = paginationHtml;
    } else {
        pagination.innerHTML = '';
    }
}

// Change page
async function changePawnDetailsPage(page, type) {
    currentPawnDetailsPage = page;
    await showPawnDetails(type);
}

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
async function openRepairModal(repairId = null) {
    const modal = document.getElementById('repairModal');
    const modalTitle = document.getElementById('repairModalTitle');
    const form = document.getElementById('repairForm');

    // Reset form
    form.reset();
    currentRepairEditId = repairId;

    if (repairId) {
        // Edit mode
        modalTitle.textContent = 'แก้ไขรายการซ่อม';

        try {
            const repair = await API.get(`${API_ENDPOINTS.repairs}/${repairId}`);

            if (repair) {
                document.getElementById('repairId').value = repair.id;
                document.getElementById('repairBrand').value = repair.brand;
                document.getElementById('repairModel').value = repair.model;
                document.getElementById('repairColor').value = repair.color;
                document.getElementById('repairImei').value = repair.imei;
                document.getElementById('repairSymptom').value = repair.problem; // ใช้ problem จาก backend
                document.getElementById('repairPrice').value = repair.repair_cost; // ใช้ repair_cost จาก backend
                document.getElementById('repairReceiveDate').value = repair.received_date ? repair.received_date.split('T')[0] : ''; // ใช้ received_date จาก backend
                document.getElementById('repairStatus').value = repair.status;
            }
        } catch (error) {
            console.error('Error loading repair:', error);
            alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
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
async function saveRepair(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const repairData = {
        brand: formData.get('brand'),
        model: formData.get('model'),
        color: formData.get('color'),
        imei: formData.get('imei'),
        customer_name: formData.get('customerName') || null,
        customer_phone: formData.get('customerPhone') || null,
        problem: formData.get('symptom'),
        repair_cost: parseFloat(formData.get('price')),
        received_date: formData.get('receiveDate'),
        appointment_date: null,
        status: formData.get('status'),
        note: null,
        store: currentStore
    };

    try {
        if (currentRepairEditId) {
            // สำหรับการแก้ไข ต้องเพิ่ม completed_date, returned_date และ seized_date
            repairData.completed_date = null;
            repairData.returned_date = null;
            repairData.seized_date = null;
            await API.put(`${API_ENDPOINTS.repairs}/${currentRepairEditId}`, repairData);
            showNotification('บันทึกข้อมูลสำเร็จ');
        } else {
            repairData.id = 'R' + Date.now().toString();
            await API.post(API_ENDPOINTS.repairs, repairData);
            showNotification('เพิ่มรายการซ่อมสำเร็จ');
        }

        loadRepairData();
        closeRepairModal();
    } catch (error) {
        alert('เกิดข้อผิดพลาด: ' + error.message);
        console.error(error);
    }
}

// Load and display repair data
function loadRepairData() {
    // Apply current filter (which will show current month by default for returned/received)
    filterRepairByDate();

    // Update dashboard stats
    updateDashboard();
}

// Display repairs in table
function displayRepairs(repairs, tableBodyId, type) {
    const tbody = document.getElementById(tableBodyId);

    if (!tbody) return;

    if (repairs.length === 0) {
        const colspan = (type === 'received' || type === 'returned' || type === 'seized') ? '9' : '8';
        tbody.innerHTML = `<tr><td colspan="${colspan}" class="empty-state">ไม่มีข้อมูล</td></tr>`;
        return;
    }

    tbody.innerHTML = repairs.map(repair => {
        // Handle both snake_case and camelCase field names
        const receivedDate = repair.received_date || repair.receiveDate;
        const returnedDate = repair.returned_date || repair.returnDate;
        const seizedDate = repair.seized_date || repair.seizedDate;
        const problem = repair.problem || repair.symptom;
        const repairCost = repair.repair_cost || repair.price;

        if (type === 'seized') {
            return `
                <tr>
                    <td>${repair.brand}</td>
                    <td>${repair.model}</td>
                    <td>${repair.color}</td>
                    <td>${repair.imei}</td>
                    <td>${problem}</td>
                    <td>${formatCurrency(repairCost)}</td>
                    <td>${formatDate(receivedDate)}</td>
                    <td>${formatDate(seizedDate)}</td>
                    <td>
                        <button class="action-btn btn-success" onclick="sendToUsedDevices('${repair.id}')">ส่งไปเครื่องมือสอง</button>
                        <button class="action-btn btn-edit" onclick="openRepairModal('${repair.id}')">แก้ไข</button>
                        <button class="action-btn btn-delete" onclick="deleteRepair('${repair.id}')">ลบ</button>
                    </td>
                </tr>
            `;
        } else if (type === 'received') {
            return `
                <tr>
                    <td>${repair.brand}</td>
                    <td>${repair.model}</td>
                    <td>${repair.color}</td>
                    <td>${repair.imei}</td>
                    <td>${problem}</td>
                    <td>${formatCurrency(repairCost)}</td>
                    <td>${formatDate(receivedDate)}</td>
                    <td>${formatDate(returnedDate)}</td>
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
                    <td>${problem}</td>
                    <td>${formatCurrency(repairCost)}</td>
                    <td>${formatDate(receivedDate)}</td>
                    <td>${repair.note || '-'}</td>
                    <td>
                        <button class="action-btn btn-success" onclick="markAsReceived('${repair.id}')">รับเครื่อง</button>
                        <button class="action-btn btn-edit" onclick="openRepairModal('${repair.id}')">แก้ไข</button>
                        <button class="action-btn btn-delete" onclick="deleteRepair('${repair.id}')">ลบ</button>
                    </td>
                </tr>
            `;
        } else {
            // pending (รอซ่อม): มีปุ่มส่งซ่อม + ซ่อมเสร็จ + คืนเครื่อง
            // in-repair (ส่งซ่อม): มีปุ่มซ่อมเสร็จ + คืนเครื่อง
            // completed (ซ่อมเสร็จ): มีปุ่มรับเครื่อง + ยึดเครื่อง
            let actionButtons = '';
            if (type === 'pending') {
                actionButtons = `<button class="action-btn btn-info" onclick="markAsInRepair('${repair.id}')">ส่งซ่อม</button>
                                <button class="action-btn btn-primary" onclick="markAsCompleted('${repair.id}')">ซ่อมเสร็จ</button>
                                <button class="action-btn btn-warning" onclick="markAsReturned('${repair.id}')">คืนเครื่อง</button>`;
            } else if (type === 'in-repair') {
                actionButtons = `<button class="action-btn btn-primary" onclick="markAsCompleted('${repair.id}')">ซ่อมเสร็จ</button>
                                <button class="action-btn btn-warning" onclick="markAsReturned('${repair.id}')">คืนเครื่อง</button>`;
            } else if (type === 'completed') {
                actionButtons = `<button class="action-btn btn-success" onclick="markAsReceived('${repair.id}')">รับเครื่อง</button>
                                <button class="action-btn btn-danger" onclick="seizeRepair('${repair.id}')">ยึดเครื่อง</button>`;
            }

            return `
                <tr>
                    <td>${repair.brand}</td>
                    <td>${repair.model}</td>
                    <td>${repair.color}</td>
                    <td>${repair.imei}</td>
                    <td>${problem}</td>
                    <td>${formatCurrency(repairCost)}</td>
                    <td>${formatDate(receivedDate)}</td>
                    <td>
                        ${actionButtons}
                        <button class="action-btn btn-edit" onclick="openRepairModal('${repair.id}')">แก้ไข</button>
                        <button class="action-btn btn-delete" onclick="deleteRepair('${repair.id}')">ลบ</button>
                    </td>
                </tr>
            `;
        }
    }).join('');
}

// Mark repair as in-repair
async function markAsInRepair(repairId) {
    if (confirm('ต้องการส่งซ่อมเครื่องนี้ใช่หรือไม่?')) {
        try {
            // ดึงข้อมูลเดิมมาก่อน
            const repair = await API.get(`${API_ENDPOINTS.repairs}/${repairId}`);
            if (!repair) {
                alert('ไม่พบข้อมูลเครื่องซ่อม');
                return;
            }

            // ส่งข้อมูลครบทุกฟิลด์พร้อมอัพเดท status เป็น in-repair
            await API.put(`${API_ENDPOINTS.repairs}/${repairId}`, {
                brand: repair.brand,
                model: repair.model,
                color: repair.color,
                imei: repair.imei,
                customer_name: repair.customer_name,
                customer_phone: repair.customer_phone,
                problem: repair.problem,
                repair_cost: repair.repair_cost,
                received_date: repair.received_date ? repair.received_date.split('T')[0] : null,
                appointment_date: repair.appointment_date ? repair.appointment_date.split('T')[0] : null,
                completed_date: repair.completed_date ? repair.completed_date.split('T')[0] : null,
                returned_date: repair.returned_date ? repair.returned_date.split('T')[0] : null,
                seized_date: repair.seized_date ? repair.seized_date.split('T')[0] : null,
                status: 'in-repair',
                note: repair.note,
                store: repair.store
            });
            loadRepairData();
            showNotification('ส่งซ่อมสำเร็จ');
        } catch (error) {
            alert('เกิดข้อผิดพลาด: ' + error.message);
            console.error(error);
        }
    }
}

// Mark repair as completed
async function markAsCompleted(repairId) {
    if (confirm('เครื่องซ่อมเสร็จแล้วใช่หรือไม่?')) {
        try {
            // ดึงข้อมูลเดิมมาก่อน
            const repair = await API.get(`${API_ENDPOINTS.repairs}/${repairId}`);
            if (!repair) {
                alert('ไม่พบข้อมูลเครื่องซ่อม');
                return;
            }

            // ส่งข้อมูลครบทุกฟิลด์พร้อมอัพเดท status และ completed_date
            await API.put(`${API_ENDPOINTS.repairs}/${repairId}`, {
                brand: repair.brand,
                model: repair.model,
                color: repair.color,
                imei: repair.imei,
                customer_name: repair.customer_name,
                customer_phone: repair.customer_phone,
                problem: repair.problem,
                repair_cost: repair.repair_cost,
                received_date: repair.received_date ? repair.received_date.split('T')[0] : null,
                appointment_date: repair.appointment_date ? repair.appointment_date.split('T')[0] : null,
                completed_date: new Date().toISOString().split('T')[0],
                returned_date: repair.returned_date ? repair.returned_date.split('T')[0] : null,
                seized_date: repair.seized_date ? repair.seized_date.split('T')[0] : null,
                status: 'completed',
                note: repair.note,
                store: repair.store
            });
            loadRepairData();
            showNotification('บันทึกซ่อมเสร็จสำเร็จ');
        } catch (error) {
            alert('เกิดข้อผิดพลาด: ' + error.message);
            console.error(error);
        }
    }
}

// Mark repair as received
async function markAsReceived(repairId) {
    if (confirm('ลูกค้ามารับเครื่องแล้วใช่หรือไม่?')) {
        try {
            // ดึงข้อมูลเดิมมาก่อน
            const repair = await API.get(`${API_ENDPOINTS.repairs}/${repairId}`);
            if (!repair) {
                alert('ไม่พบข้อมูลเครื่องซ่อม');
                return;
            }

            // ส่งข้อมูลครบทุกฟิลด์พร้อมอัพเดท status และ returned_date
            await API.put(`${API_ENDPOINTS.repairs}/${repairId}`, {
                brand: repair.brand,
                model: repair.model,
                color: repair.color,
                imei: repair.imei,
                customer_name: repair.customer_name,
                customer_phone: repair.customer_phone,
                problem: repair.problem,
                repair_cost: repair.repair_cost,
                received_date: repair.received_date ? repair.received_date.split('T')[0] : null,
                appointment_date: repair.appointment_date ? repair.appointment_date.split('T')[0] : null,
                completed_date: repair.completed_date ? repair.completed_date.split('T')[0] : null,
                returned_date: new Date().toISOString().split('T')[0],
                seized_date: repair.seized_date ? repair.seized_date.split('T')[0] : null,
                status: 'received',
                note: repair.note,
                store: repair.store
            });
            loadRepairData();
            showNotification('บันทึกรับเครื่องสำเร็จ');
        } catch (error) {
            alert('เกิดข้อผิดพลาด: ' + error.message);
            console.error(error);
        }
    }
}

// Mark repair as returned
async function markAsReturned(repairId) {
    const note = prompt('กรุณาระบุเหตุผลที่คืนเครื่อง:');
    if (note !== null && note.trim() !== '') {
        try {
            // ดึงข้อมูลเดิมมาก่อน
            const repair = await API.get(`${API_ENDPOINTS.repairs}/${repairId}`);
            if (!repair) {
                alert('ไม่พบข้อมูลเครื่องซ่อม');
                return;
            }

            // ส่งข้อมูลครบทุกฟิลด์พร้อมอัพเดท status, note และ returned_date
            await API.put(`${API_ENDPOINTS.repairs}/${repairId}`, {
                brand: repair.brand,
                model: repair.model,
                color: repair.color,
                imei: repair.imei,
                customer_name: repair.customer_name,
                customer_phone: repair.customer_phone,
                problem: repair.problem,
                repair_cost: repair.repair_cost,
                received_date: repair.received_date ? repair.received_date.split('T')[0] : null,
                appointment_date: repair.appointment_date ? repair.appointment_date.split('T')[0] : null,
                completed_date: repair.completed_date ? repair.completed_date.split('T')[0] : null,
                returned_date: new Date().toISOString().split('T')[0], // บันทึกวันที่คืนเครื่อง
                seized_date: repair.seized_date ? repair.seized_date.split('T')[0] : null,
                status: 'returned',
                note: note.trim(),
                store: repair.store
            });
            loadRepairData();
            showNotification('บันทึกคืนเครื่องสำเร็จ');
        } catch (error) {
            alert('เกิดข้อผิดพลาด: ' + error.message);
            console.error(error);
        }
    } else if (note !== null) {
        alert('กรุณาระบุเหตุผลที่คืนเครื่อง');
    }
}

// Delete repair
async function deleteRepair(repairId) {
    if (confirm('ต้องการลบข้อมูลนี้หรือไม่? (ไม่สามารถกู้คืนได้)')) {
        try {
            await API.delete(`${API_ENDPOINTS.repairs}/${repairId}`);
            loadRepairData();
            showNotification('ลบข้อมูลสำเร็จ');
        } catch (error) {
            alert('เกิดข้อผิดพลาด: ' + error.message);
            console.error(error);
        }
    }
}

// Seize repair device
async function seizeRepair(repairId) {
    if (confirm('ต้องการยึดเครื่องนี้หรือไม่?')) {
        try {
            // ดึงข้อมูลเดิมมาก่อน
            const repair = await API.get(`${API_ENDPOINTS.repairs}/${repairId}`);
            if (!repair) {
                alert('ไม่พบข้อมูลเครื่องซ่อม');
                return;
            }

            // ส่งข้อมูลครบทุกฟิลด์พร้อมอัพเดท status และ seized_date
            await API.put(`${API_ENDPOINTS.repairs}/${repairId}`, {
                brand: repair.brand,
                model: repair.model,
                color: repair.color,
                imei: repair.imei,
                customer_name: repair.customer_name,
                customer_phone: repair.customer_phone,
                problem: repair.problem,
                repair_cost: repair.repair_cost,
                received_date: repair.received_date ? repair.received_date.split('T')[0] : null,
                appointment_date: repair.appointment_date ? repair.appointment_date.split('T')[0] : null,
                completed_date: repair.completed_date ? repair.completed_date.split('T')[0] : null,
                returned_date: repair.returned_date ? repair.returned_date.split('T')[0] : null,
                status: 'seized',
                seized_date: new Date().toISOString().split('T')[0],
                note: repair.note,
                store: repair.store
            });
            loadRepairData();
            showNotification('บันทึกการยึดเครื่องสำเร็จ');
        } catch (error) {
            alert('เกิดข้อผิดพลาด: ' + error.message);
            console.error(error);
        }
    }
}

// Send seized repair to used devices
async function sendToUsedDevices(repairId) {
    if (confirm('ต้องการส่งข้อมูลเครื่องนี้ไปยังเครื่องมือสองหรือไม่?')) {
        try {
            // ดึงข้อมูลเครื่องซ่อมที่ถูกยึด
            const repair = await API.get(`${API_ENDPOINTS.repairs}/${repairId}`);
            if (!repair) {
                alert('ไม่พบข้อมูลเครื่องซ่อม');
                return;
            }

            // สร้างข้อมูลเครื่องมือสอง - ลงเฉพาะข้อมูลที่มีจากเครื่องซ่อม
            const usedDeviceData = {
                id: 'U' + Date.now().toString(),
                brand: repair.brand,
                model: repair.model,
                color: repair.color,
                imei: repair.imei,
                ram: '-', // ไม่มีในเครื่องซ่อม ให้แก้ไขภายหลัง
                rom: '-', // ไม่มีในเครื่องซ่อม ให้แก้ไขภายหลัง
                device_condition: '-', // ไม่มีในเครื่องซ่อม ให้แก้ไขภายหลัง
                purchase_price: 0, // ให้แก้ไขภายหลัง
                import_date: new Date().toISOString().split('T')[0],
                sale_price: null,
                sale_date: null,
                status: 'stock',
                note: `ยึดจากเครื่องซ่อม - อาการ: ${repair.problem || '-'}`,
                store: repair.store
            };

            // ส่งไปยังเครื่องมือสอง
            await API.post(API_ENDPOINTS.usedDevices, usedDeviceData);

            // ลบเครื่องออกจากรายการซ่อม
            await API.delete(`${API_ENDPOINTS.repairs}/${repairId}`);

            loadRepairData();
            showNotification('ส่งข้อมูลไปเครื่องมือสองสำเร็จ - กรุณาแก้ไข RAM, ROM, สภาพเครื่อง และราคารับซื้อ');
        } catch (error) {
            alert('เกิดข้อผิดพลาด: ' + error.message);
            console.error(error);
        }
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
async function filterRepairByDate() {
    const monthSelect = document.getElementById('filterRepairMonth');
    const yearSelect = document.getElementById('filterRepairYear');

    currentRepairFilter.month = monthSelect.value;
    currentRepairFilter.year = yearSelect.value;

    try {
        // Get all repairs from API
        const allRepairs = await API.get(API_ENDPOINTS.repairs, { store: currentStore });

        // Pending, In-repair, Completed: Show current data always (no date filter)
        const pendingRepairs = allRepairs.filter(r => r.status === 'pending');
        displayRepairs(pendingRepairs, 'repairPendingTableBody', 'pending');

        const inRepairRepairs = allRepairs.filter(r => r.status === 'in-repair');
        displayRepairs(inRepairRepairs, 'repairInRepairTableBody', 'in-repair');

        const completedRepairs = allRepairs.filter(r => r.status === 'completed');
        displayRepairs(completedRepairs, 'repairCompletedTableBody', 'completed');

        // Returned: Filter by returned_date
        let returnedRepairs = allRepairs.filter(r => r.status === 'returned');

        if (currentRepairFilter.month || currentRepairFilter.year) {
            returnedRepairs = returnedRepairs.filter(repair => {
                const returnedDate = repair.returned_date || repair.returnedDate;
                if (!returnedDate) return false;
                const date = new Date(returnedDate);
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
                const returnedDate = repair.returned_date || repair.returnedDate;
                if (!returnedDate) return false;
                const date = new Date(returnedDate);
                return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
            });
        }

        displayRepairs(returnedRepairs, 'repairReturnedTableBody', 'returned');

        // Received: Filter by returned_date
        let receivedRepairs = allRepairs.filter(r => r.status === 'received');

        if (currentRepairFilter.month || currentRepairFilter.year) {
            receivedRepairs = receivedRepairs.filter(repair => {
                const returnedDate = repair.returned_date || repair.returnedDate;
                if (!returnedDate) return false;
                const date = new Date(returnedDate);
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
                const returnedDate = repair.returned_date || repair.returnedDate;
                if (!returnedDate) return false;
                const date = new Date(returnedDate);
                return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
            });
        }

        displayRepairs(receivedRepairs, 'repairReceivedTableBody', 'received');

        // Seized: Filter by seized_date
        let seizedRepairs = allRepairs.filter(r => r.status === 'seized');

        if (currentRepairFilter.month || currentRepairFilter.year) {
            seizedRepairs = seizedRepairs.filter(repair => {
                const seizedDate = repair.seized_date || repair.seizedDate;
                if (!seizedDate) return false;
                const date = new Date(seizedDate);
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

            seizedRepairs = seizedRepairs.filter(repair => {
                const seizedDate = repair.seized_date || repair.seizedDate;
                if (!seizedDate) return false;
                const date = new Date(seizedDate);
                return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
            });
        }

        displayRepairs(seizedRepairs, 'repairSeizedTableBody', 'seized');

        // Update tab counts
        const pendingCountElement = document.getElementById('repairPendingCount');
        const inRepairCountElement = document.getElementById('repairInRepairCount');
        const completedCountElement = document.getElementById('repairCompletedCount');
        const returnedCountElement = document.getElementById('repairReturnedCount');
        const receivedCountElement = document.getElementById('repairReceivedCount');
        const seizedCountElement = document.getElementById('repairSeizedCount');

        if (pendingCountElement) pendingCountElement.textContent = pendingRepairs.length;
        if (inRepairCountElement) inRepairCountElement.textContent = inRepairRepairs.length;
        if (completedCountElement) completedCountElement.textContent = completedRepairs.length;
        if (returnedCountElement) returnedCountElement.textContent = returnedRepairs.length;
        if (receivedCountElement) receivedCountElement.textContent = receivedRepairs.length;
        if (seizedCountElement) seizedCountElement.textContent = seizedRepairs.length;
    } catch (error) {
        console.error('Error loading repairs:', error);
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    }
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
async function initializeInstallmentDatabase() {
    try {
        // โหลดข้อมูลจาก API แทน localStorage
        installmentDevices = await API.get(API_ENDPOINTS.installments);
        console.log('✅ โหลดข้อมูลเครื่องผ่อนจาก API สำเร็จ');
        console.log(`📊 มีข้อมูลทั้งหมด ${installmentDevices.length} รายการ`);
        loadInstallmentData();
    } catch (error) {
        console.error('Error loading installments from API:', error);
        installmentDevices = [];
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

// Calculate next due date from down payment date (+ 29 days)
function calculateNextDueDate() {
    const downPaymentDateInput = document.getElementById('downPaymentDate');
    const nextDueDateInput = document.getElementById('nextDueDate');
    
    if (downPaymentDateInput && downPaymentDateInput.value) {
        const downPaymentDate = new Date(downPaymentDateInput.value);
        downPaymentDate.setDate(downPaymentDate.getDate() + 29);
        const nextDueDate = downPaymentDate.toISOString().split('T')[0];
        
        if (nextDueDateInput) {
            nextDueDateInput.value = nextDueDate;
            console.log('📅 Next due date calculated:', {
                downPayment: downPaymentDateInput.value,
                nextDue: nextDueDate,
                daysAdded: 29
            });
        }
    }
}

// Open installment modal for adding/editing
function openInstallmentModal(installmentId = null) {
    const modal = document.getElementById('installmentModal');
    const modalTitle = document.getElementById('installmentModalTitle');
    const form = document.getElementById('installmentForm');

    form.reset();
    currentInstallmentEditId = installmentId;
    
    // Add event listener for down payment date change
    const downPaymentDateInput = document.getElementById('downPaymentDate');
    if (downPaymentDateInput) {
        downPaymentDateInput.removeEventListener('change', calculateNextDueDate); // Remove old listener
        downPaymentDateInput.addEventListener('change', calculateNextDueDate); // Add new listener
    }

    if (installmentId) {
        // Edit mode
        modalTitle.textContent = 'แก้ไขรายการผ่อน';
        const installment = installmentDevices.find(i => i.id === installmentId);
        if (installment) {
            console.log('📝 Editing installment:', installment);
            
            // Support both snake_case (from API) and camelCase (legacy)
            document.getElementById('installmentBrand').value = installment.brand;
            document.getElementById('installmentModel').value = installment.model;
            document.getElementById('installmentColor').value = installment.color;
            document.getElementById('installmentImei').value = installment.imei;
            document.getElementById('installmentRam').value = installment.ram;
            document.getElementById('installmentRom').value = installment.rom;
            document.getElementById('customerName').value = installment.customer_name || installment.customerName;
            document.getElementById('customerPhone').value = installment.customer_phone || installment.customerPhone;
            document.getElementById('costPrice').value = installment.cost_price || installment.costPrice;
            document.getElementById('salePrice').value = installment.sale_price || installment.salePrice;
            document.getElementById('downPayment').value = installment.down_payment || installment.downPayment;
            document.getElementById('totalInstallments').value = installment.total_installments || installment.totalInstallments;
            document.getElementById('installmentAmount').value = installment.installment_amount || installment.installmentAmount;
            document.getElementById('downPaymentDate').value = installment.down_payment_date || installment.downPaymentDate;
            
            // Get next due date
            const nextDueDate = installment.next_payment_due_date || installment.nextPaymentDueDate || getNextDueDate(installment);
            document.getElementById('nextDueDate').value = nextDueDate;
            document.getElementById('installmentNote').value = installment.note || '';
        }
    } else {
        // Add mode
        modalTitle.textContent = 'เพิ่มรายการผ่อน';
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('downPaymentDate').value = today;

        // คำนวณวันครบกำหนดถัดไป (วันวางดาวน์ + 29 วัน)
        const nextDue = new Date(today);
        nextDue.setDate(nextDue.getDate() + 29);
        document.getElementById('nextDueDate').value = nextDue.toISOString().split('T')[0];
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
async function saveInstallment(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const downPaymentDate = formData.get('downPaymentDate');

    // คำนวณวันครบกำหนดถัดไป: วันวางดาวน์ + 29 วัน
    const nextDueDate = new Date(downPaymentDate);
    nextDueDate.setDate(nextDueDate.getDate() + 29);
    const nextDueDateStr = nextDueDate.toISOString().split('T')[0];
    
    console.log('💾 Saving installment:', {
        downPaymentDate,
        nextDueDate: nextDueDateStr,
        daysAdded: 29
    });

    // ดึงข้อมูลเดิมถ้าเป็นการแก้ไข เพื่อเก็บ status และ seized_date เดิม
    let existingStatus = 'active';
    let existingSeizedDate = null;
    if (currentInstallmentEditId) {
        const existing = installmentDevices.find(i => i.id === currentInstallmentEditId);
        if (existing) {
            existingStatus = existing.status || 'active';
            existingSeizedDate = existing.seized_date || existing.seizedDate || null;
        }
    }

    // สร้าง object สำหรับส่งไป API (ใช้ snake_case)
    const installmentData = {
        id: currentInstallmentEditId || ('INS' + Date.now().toString()),
        brand: formData.get('brand'),
        model: formData.get('model'),
        color: formData.get('color'),
        imei: formData.get('imei'),
        ram: formData.get('ram'),
        rom: formData.get('rom'),
        customer_name: formData.get('customerName'),
        customer_phone: formData.get('customerPhone'),
        cost_price: parseFloat(formData.get('costPrice')),
        sale_price: parseFloat(formData.get('salePrice')),
        down_payment: parseFloat(formData.get('downPayment')),
        total_installments: parseInt(formData.get('totalInstallments')),
        installment_amount: parseFloat(formData.get('installmentAmount')),
        paid_installments: 0,
        next_payment_due_date: nextDueDateStr,
        down_payment_date: downPaymentDate,
        note: formData.get('note') || '',
        status: existingStatus, // ใช้ status เดิม
        seized_date: existingSeizedDate, // ใช้ seized_date เดิม
        store: currentStore
    };

    try {
        if (currentInstallmentEditId) {
            // Update existing installment
            await API.put(`${API_ENDPOINTS.installments}/${currentInstallmentEditId}`, installmentData);
        } else {
            // Create new installment
            await API.post(API_ENDPOINTS.installments, installmentData);
        }

        // Reload data
        await loadInstallmentData();

        // Close modal
        closeInstallmentModal();

        // Show success message
        showNotification(currentInstallmentEditId ? 'บันทึกข้อมูลสำเร็จ' : 'เพิ่มรายการผ่อนสำเร็จ');
    } catch (error) {
        alert('เกิดข้อผิดพลาด: ' + error.message);
        console.error(error);
    }
}

// Load and display installment data
async function loadInstallmentData() {
    try {
        // โหลดข้อมูลจาก API
        installmentDevices = await API.get(API_ENDPOINTS.installments, { store: currentStore });

        // Active: Show current data always (no date filter)
        const activeInstallments = installmentDevices.filter(i => i.status === 'active');
        displayInstallments(activeInstallments, 'installmentActiveTableBody', 'active');

        // Completed: Filter by completedDate (current month by default)
        let completedInstallments = installmentDevices.filter(i => i.status === 'completed');

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        completedInstallments = completedInstallments.filter(inst => {
            if (!inst.completed_date) return false;
            const date = new Date(inst.completed_date);
            return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        });

        displayInstallments(completedInstallments, 'installmentCompletedTableBody', 'completed');

        // Seized: Filter by seizedDate (current month by default)
        let seizedInstallments = installmentDevices.filter(i => i.status === 'seized');

        seizedInstallments = seizedInstallments.filter(inst => {
            if (!inst.seized_date) return false;
            const date = new Date(inst.seized_date);
            return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        });

        displayInstallments(seizedInstallments, 'installmentSeizedTableBody', 'seized');

        // Update tab counts
        updateInstallmentTabCounts();

        // Update dashboard stats
        updateDashboard();
    } catch (error) {
        console.error('Error loading installment data:', error);
    }
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
        const customerName = inst.customer_name || inst.customerName;
        const customerPhone = inst.customer_phone || inst.customerPhone;
        const customerInfo = `${customerName}<br/>${customerPhone}`;
        const salePrice = inst.sale_price || inst.salePrice;
        const downPayment = inst.down_payment || inst.downPayment;
        const totalInstallments = inst.total_installments || inst.totalInstallments;
        const paidInstallments = inst.paid_installments ?? inst.paidInstallments ?? 0;
        const installmentAmount = inst.installment_amount || inst.installmentAmount;
        const remainingAmount = (totalInstallments - paidInstallments) * installmentAmount;
        const nextDueDate = getNextDueDate(inst);

        if (type === 'active') {
            return `
                <tr>
                    <td>${deviceInfo}</td>
                    <td>${customerInfo}</td>
                    <td>${formatCurrency(salePrice)}</td>
                    <td>${formatCurrency(downPayment)}</td>
                    <td>${paidInstallments}/${totalInstallments}</td>
                    <td>${formatCurrency(installmentAmount)}</td>
                    <td style="color: ${remainingAmount > 0 ? '#dc2626' : '#16a34a'}">${formatCurrency(remainingAmount)}</td>
                    <td>${nextDueDate}</td>
                    <td>
                        <button class="action-btn btn-success" onclick="openPaymentModal('${inst.id}')">บันทึกการผ่อน</button>
                        <button class="action-btn btn-info" onclick="openHistoryModal('${inst.id}')">ประวัติ</button>
                        <button class="action-btn btn-remove" onclick="seizeInstallment('${inst.id}')">ยึดเครื่อง</button>
                        <button class="action-btn btn-edit" onclick="openInstallmentModal('${inst.id}')">แก้ไข</button>
                        <button class="action-btn btn-delete" onclick="deleteInstallment('${inst.id}')">ลบ</button>
                    </td>
                </tr>
            `;
        } else if (type === 'completed') {
            const completedDate = inst.completed_date || inst.completedDate;
            return `
                <tr>
                    <td>${deviceInfo}</td>
                    <td>${customerInfo}</td>
                    <td>${formatCurrency(salePrice)}</td>
                    <td>${formatCurrency(downPayment)}</td>
                    <td>${paidInstallments}/${totalInstallments}</td>
                    <td>${formatCurrency(installmentAmount)}</td>
                    <td>${formatDate(completedDate)}</td>
                    <td>
                        <button class="action-btn btn-info" onclick="openHistoryModal('${inst.id}')">ประวัติ</button>
                        <button class="action-btn btn-edit" onclick="openInstallmentModal('${inst.id}')">แก้ไข</button>
                        <button class="action-btn btn-delete" onclick="deleteInstallment('${inst.id}')">ลบ</button>
                    </td>
                </tr>
            `;
        } else if (type === 'seized') {
            const seizedDate = inst.seized_date || inst.seizedDate;
            return `
                <tr>
                    <td>${deviceInfo}</td>
                    <td>${customerInfo}</td>
                    <td>${formatCurrency(salePrice)}</td>
                    <td>${formatCurrency(downPayment)}</td>
                    <td>${paidInstallments}/${totalInstallments}</td>
                    <td>${formatCurrency(remainingAmount)}</td>
                    <td>${formatDate(seizedDate)}</td>
                    <td>
                        <button class="action-btn btn-info" onclick="openHistoryModal('${inst.id}')">ประวัติ</button>
                        <button class="action-btn btn-edit" onclick="openInstallmentModal('${inst.id}')">แก้ไข</button>
                        <button class="action-btn btn-delete" onclick="deleteInstallment('${inst.id}')">ลบ</button>
                    </td>
                </tr>
            `;
        }
    }).join('');
}

// Get next due date for installment
function getNextDueDate(installment) {
    const paidInstallments = installment.paid_installments || installment.paidInstallments || 0;
    const totalInstallments = installment.total_installments || installment.totalInstallments || 0;

    if (paidInstallments >= totalInstallments) {
        return 'ผ่อนครบแล้ว';
    }

    // ใช้วันครบกำหนดที่บันทึกไว้ หรือคำนวณใหม่ถ้าไม่มี
    const nextPaymentDueDate = installment.next_payment_due_date || installment.nextPaymentDueDate;
    if (nextPaymentDueDate) {
        return formatDate(nextPaymentDueDate);
    }

    // คำนวณจากวันวางดาวน์ + (งวดที่จ่ายแล้ว + 1) * 30 วัน
    const downPaymentDate = new Date(installment.down_payment_date || installment.downPaymentDate);
    const daysToAdd = (paidInstallments + 1) * 30;
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
async function savePayment(event) {
    event.preventDefault();

    const installmentId = document.getElementById('paymentInstallmentId').value;
    const paymentDate = document.getElementById('paymentDate').value;

    const installment = installmentDevices.find(i => i.id === installmentId);
    if (!installment) return;

    const paidInstallments = installment.paid_installments || installment.paidInstallments || 0;
    const installmentAmount = installment.installment_amount || installment.installmentAmount;
    const nextInstallmentNumber = paidInstallments + 1;

    try {
        // เรียก API เพื่อบันทึกการชำระเงิน
        await API.post(`${API_ENDPOINTS.installments}/${installmentId}/payment`, {
            installment_number: nextInstallmentNumber,
            payment_date: paymentDate,
            amount: installmentAmount
        });

        // Reload data เพื่อแสดงผลอัพเดท
        await loadInstallmentData();

        // Close modal
        closePaymentModal();

        // แสดงข้อความสำเร็จ
        showNotification(`บันทึกการชำระงวดที่ ${nextInstallmentNumber} สำเร็จ`);
    } catch (error) {
        alert('เกิดข้อผิดพลาด: ' + error.message);
        console.error(error);
    }
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
async function seizeInstallment(installmentId) {
    if (confirm('ต้องการยึดเครื่องใช่หรือไม่?')) {
        try {
            // ดึงข้อมูลเดิมมาก่อน
            const installment = installmentDevices.find(i => i.id === installmentId);
            if (!installment) {
                alert('ไม่พบข้อมูลเครื่องผ่อน');
                return;
            }

            // ส่งข้อมูลครบทุกฟิลด์ไปยัง API
            await API.put(`${API_ENDPOINTS.installments}/${installmentId}`, {
                brand: installment.brand,
                model: installment.model,
                color: installment.color,
                imei: installment.imei,
                ram: installment.ram,
                rom: installment.rom,
                customer_name: installment.customer_name || installment.customerName,
                customer_phone: installment.customer_phone || installment.customerPhone,
                cost_price: installment.cost_price || installment.costPrice,
                sale_price: installment.sale_price || installment.salePrice,
                down_payment: installment.down_payment || installment.downPayment,
                total_installments: installment.total_installments || installment.totalInstallments,
                installment_amount: installment.installment_amount || installment.installmentAmount,
                next_payment_due_date: null, // ยึดเครื่องแล้วไม่ต้องมีวันครบกำหนด
                note: installment.note || '',
                status: 'seized',
                seized_date: new Date().toISOString().split('T')[0]
            });
            loadInstallmentData();
            showNotification('บันทึกยึดเครื่องสำเร็จ');
        } catch (error) {
            alert('เกิดข้อผิดพลาด: ' + error.message);
            console.error(error);
        }
    }
}

// Delete installment
async function deleteInstallment(installmentId) {
    if (confirm('ต้องการลบข้อมูลนี้หรือไม่? (ไม่สามารถกู้คืนได้)')) {
        try {
            await API.delete(`${API_ENDPOINTS.installments}/${installmentId}`);
            loadInstallmentData();
            showNotification('ลบข้อมูลสำเร็จ');
        } catch (error) {
            alert('เกิดข้อผิดพลาด: ' + error.message);
            console.error(error);
        }
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
async function filterInstallmentByDate() {
    const monthSelect = document.getElementById('filterInstallmentMonth');
    const yearSelect = document.getElementById('filterInstallmentYear');

    currentInstallmentFilter.month = monthSelect.value;
    currentInstallmentFilter.year = yearSelect.value;

    try {
        // Get all installments from API
        const allInstallments = await API.get(API_ENDPOINTS.installments, { store: currentStore });

        // Active: Show current data always (no date filter)
        const activeInstallments = allInstallments.filter(i => i.status === 'active');
        displayInstallments(activeInstallments, 'installmentActiveTableBody', 'active');

        // Completed: Filter by completedDate
        let completedInstallments = allInstallments.filter(i => i.status === 'completed');

        if (currentInstallmentFilter.month || currentInstallmentFilter.year) {
            completedInstallments = completedInstallments.filter(inst => {
                const completedDate = inst.completed_date || inst.completedDate;
                if (!completedDate) return false;
                const date = new Date(completedDate);
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
                const completedDate = inst.completed_date || inst.completedDate;
                if (!completedDate) return false;
                const date = new Date(completedDate);
                return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
            });
        }

        displayInstallments(completedInstallments, 'installmentCompletedTableBody', 'completed');

        // Seized: Filter by seizedDate
        let seizedInstallments = allInstallments.filter(i => i.status === 'seized');

        if (currentInstallmentFilter.month || currentInstallmentFilter.year) {
            seizedInstallments = seizedInstallments.filter(inst => {
                const seizedDate = inst.seized_date || inst.seizedDate;
                if (!seizedDate) return false;
                const date = new Date(seizedDate);
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
                const seizedDate = inst.seized_date || inst.seizedDate;
                if (!seizedDate) return false;
                const date = new Date(seizedDate);
                return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
            });
        }

        displayInstallments(seizedInstallments, 'installmentSeizedTableBody', 'seized');

        // Update tab counts
        const activeCountElement = document.getElementById('installmentActiveCount');
        const completedCountElement = document.getElementById('installmentCompletedCount');
        const seizedCountElement = document.getElementById('installmentSeizedCount');

        if (activeCountElement) activeCountElement.textContent = activeInstallments.length;
        if (completedCountElement) completedCountElement.textContent = completedInstallments.length;
        if (seizedCountElement) seizedCountElement.textContent = seizedInstallments.length;
    } catch (error) {
        console.error('Error loading installments:', error);
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    }
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
async function openPawnModal(pawnId = null) {
    const modal = document.getElementById('pawnModal');
    const modalTitle = document.getElementById('pawnModalTitle');
    const form = document.getElementById('pawnForm');

    form.reset();
    currentPawnEditId = pawnId;

    if (pawnId) {
        // Edit mode
        modalTitle.textContent = 'แก้ไขรายการขายฝาก';

        try {
            const pawn = await API.get(`${API_ENDPOINTS.pawn}/${pawnId}`);

            if (pawn) {
                // Handle both snake_case and camelCase field names
                const pawnAmount = pawn.pawn_amount || pawn.pawnAmount;
                const receiveDate = pawn.receive_date || pawn.receiveDate;
                const dueDate = pawn.due_date || pawn.dueDate;
                const customerName = pawn.customer_name || pawn.customerName;

                document.getElementById('pawnCustomerName').value = customerName || '';
                document.getElementById('pawnBrand').value = pawn.brand;
                document.getElementById('pawnModel').value = pawn.model;
                document.getElementById('pawnColor').value = pawn.color;
                document.getElementById('pawnImei').value = pawn.imei;
                document.getElementById('pawnRam').value = pawn.ram;
                document.getElementById('pawnRom').value = pawn.rom;
                document.getElementById('pawnAmount').value = pawnAmount;
                document.getElementById('pawnInterest').value = pawn.interest;
                document.getElementById('pawnInterestMethod').value = pawn.interest_collection_method || pawn.interestCollectionMethod || 'not_deducted';
                document.getElementById('pawnRedemptionAmount').value = pawn.redemption_amount || pawn.redemptionAmount || 0;
                document.getElementById('pawnReceiveDate').value = receiveDate ? receiveDate.split('T')[0] : '';
                document.getElementById('pawnDueDate').value = dueDate ? dueDate.split('T')[0] : '';
                document.getElementById('pawnNote').value = pawn.note || '';
            }
        } catch (error) {
            console.error('Error loading pawn data:', error);
            alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
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

// Update pawn due date (+14 days from receive date)
function updatePawnDueDate() {
    const receiveDateInput = document.getElementById('pawnReceiveDate');
    const dueDateInput = document.getElementById('pawnDueDate');

    if (receiveDateInput.value) {
        const receiveDate = new Date(receiveDateInput.value);
        receiveDate.setDate(receiveDate.getDate() + 14);
        dueDateInput.value = receiveDate.toISOString().split('T')[0];
    }
}

// Calculate interest automatically (10% of pawn amount)
function calculatePawnInterest() {
    const pawnAmount = parseFloat(document.getElementById('pawnAmount').value) || 0;
    const interestAmount = pawnAmount * 0.10; // 10%
    document.getElementById('pawnInterest').value = interestAmount.toFixed(2);
    
    // Recalculate redemption amount when interest changes
    calculateRedemptionAmount();
}

// Calculate redemption amount based on interest collection method
function calculateRedemptionAmount() {
    const pawnAmount = parseFloat(document.getElementById('pawnAmount').value) || 0;
    const interest = parseFloat(document.getElementById('pawnInterest').value) || 0;
    const interestMethod = document.getElementById('pawnInterestMethod').value;
    
    let redemptionAmount = 0;
    
    if (interestMethod === 'deducted') {
        // หักดอก: redemption amount = pawn amount only
        redemptionAmount = pawnAmount;
    } else if (interestMethod === 'not_deducted') {
        // ยังไม่หักดอก: redemption amount = pawn amount + interest
        redemptionAmount = pawnAmount + interest;
    }
    
    document.getElementById('pawnRedemptionAmount').value = redemptionAmount.toFixed(2);
}

// Save pawn (add or update)
async function savePawn(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const pawnData = {
        id: currentPawnEditId || ('PWN' + Date.now().toString()),
        customer_name: formData.get('customerName')?.trim() || null,
        brand: formData.get('brand'),
        model: formData.get('model'),
        color: formData.get('color'),
        imei: formData.get('imei'),
        ram: formData.get('ram'),
        rom: formData.get('rom'),
        pawn_amount: parseFloat(formData.get('pawnAmount')),
        interest: parseFloat(formData.get('interest')),
        interest_collection_method: formData.get('interestMethod'),
        redemption_amount: parseFloat(formData.get('redemptionAmount')),
        receive_date: formData.get('receiveDate'),
        due_date: formData.get('dueDate'),
        note: formData.get('note') || '',
        status: 'active',
        store: currentStore
    };

    try {
        if (currentPawnEditId) {
            // Update existing pawn - get current data first
            const currentPawn = await API.get(`${API_ENDPOINTS.pawn}/${currentPawnEditId}`);
            pawnData.return_date = currentPawn.return_date;
            pawnData.seized_date = currentPawn.seized_date;
            pawnData.status = currentPawn.status;

            await API.put(`${API_ENDPOINTS.pawn}/${currentPawnEditId}`, pawnData);
            showNotification('บันทึกข้อมูลสำเร็จ');
        } else {
            // Add new pawn
            pawnData.return_date = null;
            pawnData.seized_date = null;
            await API.post(API_ENDPOINTS.pawn, pawnData);

            // บันทึก transaction ถ้าเลือกหักดอก
            if (pawnData.interest_collection_method === 'deducted') {
                await API.post('http://localhost:5001/api/pawn-interest', {
                    pawn_id: pawnData.id,
                    interest_amount: pawnData.interest,
                    transaction_type: 'initial_deduction',
                    transaction_date: pawnData.receive_date,
                    store: pawnData.store
                });
            }

            showNotification('เพิ่มรายการขายฝากสำเร็จ');
        }

        // Reload data
        await loadPawnData();

        // Update dashboard to reflect new income
        await updateDashboard();

        // Close modal
        closePawnModal();
    } catch (error) {
        console.error('Error saving pawn:', error);
        alert('เกิดข้อผิดพลาด: ' + error.message);
    }
}

// Load and display pawn data
async function loadPawnData() {
    try {
        // Get all pawns from API
        const allPawns = await API.get(API_ENDPOINTS.pawn, { store: currentStore });

        // Active: Show current data always (no date filter)
        const activePawns = allPawns.filter(p => p.status === 'active');
        displayPawns(activePawns, 'pawnActiveTableBody', 'active');

        // Returned: Filter by return_date (current month by default)
        let returnedPawns = allPawns.filter(p => p.status === 'returned');

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        returnedPawns = returnedPawns.filter(pawn => {
            const returnDate = pawn.return_date || pawn.returnDate;
            if (!returnDate) return false;
            const date = new Date(returnDate);
            return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        });

        displayPawns(returnedPawns, 'pawnReturnedTableBody', 'returned');

        // Seized: Filter by seized_date (current month by default)
        let seizedPawns = allPawns.filter(p => p.status === 'seized');

        seizedPawns = seizedPawns.filter(pawn => {
            const seizedDate = pawn.seized_date || pawn.seizedDate;
            if (!seizedDate) return false;
            const date = new Date(seizedDate);
            return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        });

        displayPawns(seizedPawns, 'pawnSeizedTableBody', 'seized');

        // Update tab counts with API data
        updatePawnTabCounts(allPawns);

        // Update dashboard stats
        updateDashboard();
    } catch (error) {
        console.error('Error loading pawn data:', error);
        showNotification('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    }
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
        // Handle both snake_case and camelCase field names
        const pawnAmount = pawn.pawn_amount || pawn.pawnAmount;
        const receiveDate = pawn.receive_date || pawn.receiveDate;
        const dueDate = pawn.due_date || pawn.dueDate;
        const returnDate = pawn.return_date || pawn.returnDate;
        const seizedDate = pawn.seized_date || pawn.seizedDate;

        const ramRom = `${pawn.ram}/${pawn.rom} GB`;

        if (type === 'active') {
            return `
                <tr>
                    <td>${pawn.brand}</td>
                    <td>${pawn.model}</td>
                    <td>${pawn.color}</td>
                    <td>${pawn.imei}</td>
                    <td>${ramRom}</td>
                    <td>${formatCurrency(pawnAmount)}</td>
                    <td>${formatCurrency(pawn.interest)}</td>
                    <td>${(pawn.interest_collection_method || pawn.interestCollectionMethod) === 'deducted' ? 'หักดอก' : 'ยังไม่หักดอก'}</td>
                    <td>${formatCurrency(pawn.redemption_amount || pawn.redemptionAmount || 0)}</td>
                    <td>${formatDate(receiveDate)}</td>
                    <td>${formatDate(dueDate)}</td>
                    <td>
                        <button class="action-btn btn-warning" onclick="renewPawn('${pawn.id}')">ต่อดอก</button>
                        <button class="action-btn btn-success" onclick="returnPawn('${pawn.id}')">รับเครื่อง</button>
                        <button class="action-btn btn-remove" onclick="seizePawn('${pawn.id}')">ยึดเครื่อง</button>
                        <button class="action-btn btn-edit" onclick="openPawnModal('${pawn.id}')">แก้ไข</button>
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
                    <td>${formatCurrency(pawnAmount)}</td>
                    <td>${formatCurrency(pawn.interest)}</td>
                    <td>${(pawn.interest_collection_method || pawn.interestCollectionMethod) === 'deducted' ? 'หักดอก' : 'ยังไม่หักดอก'}</td>
                    <td>${formatCurrency(pawn.redemption_amount || pawn.redemptionAmount || 0)}</td>
                    <td>${formatDate(receiveDate)}</td>
                    <td>${formatDate(returnDate)}</td>
                    <td>
                        <button class="action-btn btn-warning" onclick="revertPawnToActive('${pawn.id}')">กลับสู่รายการขายฝาก</button>
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
                    <td>${formatCurrency(pawnAmount)}</td>
                    <td>${formatCurrency(pawn.interest)}</td>
                    <td>${(pawn.interest_collection_method || pawn.interestCollectionMethod) === 'deducted' ? 'หักดอก' : 'ยังไม่หักดอก'}</td>
                    <td>${formatCurrency(pawn.redemption_amount || pawn.redemptionAmount || 0)}</td>
                    <td>${formatDate(receiveDate)}</td>
                    <td>${formatDate(seizedDate)}</td>
                    <td>
                        <button class="action-btn btn-warning" onclick="revertPawnToActive('${pawn.id}')">กลับสู่รายการขายฝาก</button>
                        <button class="action-btn btn-success" onclick="sendPawnToUsedDevices('${pawn.id}')">ส่งไปเครื่องมือสอง</button>
                        <button class="action-btn btn-edit" onclick="openPawnModal('${pawn.id}')">แก้ไข</button>
                        <button class="action-btn btn-delete" onclick="deletePawn('${pawn.id}')">ลบ</button>
                    </td>
                </tr>
            `;
        }
    }).join('');
}

// Renew pawn (extend due date by 14 days)
async function renewPawn(pawnId) {
    if (confirm('ต้องการต่อดอกใช่หรือไม่? (วันครบกำหนดจะเพิ่มอีก 14 วัน)')) {
        try {
            const pawn = await API.get(`${API_ENDPOINTS.pawn}/${pawnId}`);
            if (!pawn) {
                alert('ไม่พบข้อมูลเครื่องขายฝาก');
                return;
            }

            const dueDate = pawn.due_date || pawn.dueDate;
            const currentDueDate = new Date(dueDate);
            currentDueDate.setDate(currentDueDate.getDate() + 14);
            const newDueDate = currentDueDate.toISOString().split('T')[0];

            const pawnData = {
                customer_name: pawn.customer_name,
                brand: pawn.brand,
                model: pawn.model,
                color: pawn.color,
                imei: pawn.imei,
                ram: pawn.ram,
                rom: pawn.rom,
                pawn_amount: pawn.pawn_amount || pawn.pawnAmount,
                interest: pawn.interest,
                interest_collection_method: pawn.interest_collection_method,
                redemption_amount: pawn.redemption_amount,
                receive_date: pawn.receive_date || pawn.receiveDate,
                due_date: newDueDate,
                return_date: pawn.return_date || pawn.returnDate,
                seized_date: pawn.seized_date || pawn.seizedDate,
                status: pawn.status,
                note: pawn.note,
                store: pawn.store
            };

            await API.put(`${API_ENDPOINTS.pawn}/${pawnId}`, pawnData);

            // บันทึก transaction สำหรับการต่อดอก
            await API.post('http://localhost:5001/api/pawn-interest', {
                pawn_id: pawnId,
                interest_amount: pawn.interest,
                transaction_type: 'renewal',
                transaction_date: new Date().toISOString().split('T')[0],
                store: pawn.store
            });

            await loadPawnData();
            await updateDashboard();
            showNotification('ต่อดอกสำเร็จ วันครบกำหนดใหม่: ' + formatDate(newDueDate));
        } catch (error) {
            console.error('Error renewing pawn:', error);
            alert('เกิดข้อผิดพลาด: ' + error.message);
        }
    }
}

// Return pawn (customer picks up device)
async function returnPawn(pawnId) {
    if (confirm('ลูกค้ามารับเครื่องคืนใช่หรือไม่?')) {
        try {
            const pawn = await API.get(`${API_ENDPOINTS.pawn}/${pawnId}`);
            if (!pawn) {
                alert('ไม่พบข้อมูลเครื่องขายฝาก');
                return;
            }

            const returnDate = new Date().toISOString().split('T')[0];

            const pawnData = {
                customer_name: pawn.customer_name,
                brand: pawn.brand,
                model: pawn.model,
                color: pawn.color,
                imei: pawn.imei,
                ram: pawn.ram,
                rom: pawn.rom,
                pawn_amount: pawn.pawn_amount || pawn.pawnAmount,
                interest: pawn.interest,
                interest_collection_method: pawn.interest_collection_method,
                redemption_amount: pawn.redemption_amount,
                receive_date: pawn.receive_date || pawn.receiveDate,
                due_date: pawn.due_date || pawn.dueDate,
                return_date: returnDate,
                seized_date: pawn.seized_date,
                status: 'returned',
                note: pawn.note,
                store: pawn.store
            };

            await API.put(`${API_ENDPOINTS.pawn}/${pawnId}`, pawnData);
            await loadPawnData();
            await updateDashboard();
            showNotification('บันทึกรับเครื่องคืนสำเร็จ');
        } catch (error) {
            console.error('Error returning pawn:', error);
            alert('เกิดข้อผิดพลาด: ' + error.message);
        }
    }
}

// Seize pawn (confiscate device)
async function seizePawn(pawnId) {
    if (confirm('ต้องการยึดเครื่องใช่หรือไม่?')) {
        try {
            const pawn = await API.get(`${API_ENDPOINTS.pawn}/${pawnId}`);
            if (!pawn) {
                alert('ไม่พบข้อมูลเครื่องขายฝาก');
                return;
            }

            const seizedDate = new Date().toISOString().split('T')[0];

            const pawnData = {
                customer_name: pawn.customer_name,
                brand: pawn.brand,
                model: pawn.model,
                color: pawn.color,
                imei: pawn.imei,
                ram: pawn.ram,
                rom: pawn.rom,
                pawn_amount: pawn.pawn_amount || pawn.pawnAmount,
                interest: pawn.interest,
                interest_collection_method: pawn.interest_collection_method,
                redemption_amount: pawn.redemption_amount,
                receive_date: pawn.receive_date || pawn.receiveDate,
                due_date: pawn.due_date || pawn.dueDate,
                return_date: pawn.return_date,
                seized_date: seizedDate,
                status: 'seized',
                note: pawn.note,
                store: pawn.store
            };

            await API.put(`${API_ENDPOINTS.pawn}/${pawnId}`, pawnData);
            loadPawnData();
            showNotification('บันทึกยึดเครื่องสำเร็จ');
        } catch (error) {
            console.error('Error seizing pawn:', error);
            alert('เกิดข้อผิดพลาด: ' + error.message);
        }
    }
}

// Revert pawn back to active status (undo return/seize)
async function revertPawnToActive(pawnId) {
    if (confirm('ต้องการย้ายกลับไปยังรายการเครื่องขายฝากหรือไม่?')) {
        try {
            const pawn = await API.get(`${API_ENDPOINTS.pawn}/${pawnId}`);
            if (!pawn) {
                alert('ไม่พบข้อมูลเครื่องขายฝาก');
                return;
            }

            const pawnData = {
                customer_name: pawn.customer_name,
                brand: pawn.brand,
                model: pawn.model,
                color: pawn.color,
                imei: pawn.imei,
                ram: pawn.ram,
                rom: pawn.rom,
                pawn_amount: pawn.pawn_amount || pawn.pawnAmount,
                interest: pawn.interest,
                interest_collection_method: pawn.interest_collection_method,
                redemption_amount: pawn.redemption_amount,
                receive_date: pawn.receive_date || pawn.receiveDate,
                due_date: pawn.due_date || pawn.dueDate,
                return_date: null,
                seized_date: null,
                status: 'active',
                note: pawn.note,
                store: pawn.store
            };

            await API.put(`${API_ENDPOINTS.pawn}/${pawnId}`, pawnData);
            loadPawnData();
            showNotification('ย้ายกลับไปยังรายการเครื่องขายฝากสำเร็จ');
        } catch (error) {
            console.error('Error reverting pawn to active:', error);
            alert('เกิดข้อผิดพลาด: ' + error.message);
        }
    }
}

// Delete pawn
async function deletePawn(pawnId) {
    if (confirm('ต้องการลบข้อมูลนี้หรือไม่? (ไม่สามารถกู้คืนได้)')) {
        try {
            await API.delete(`${API_ENDPOINTS.pawn}/${pawnId}`);
            await loadPawnData();
            await updateDashboard();
            showNotification('ลบข้อมูลสำเร็จ');
        } catch (error) {
            alert('เกิดข้อผิดพลาด: ' + error.message);
            console.error(error);
        }
    }
}

// Send seized pawn to used devices
async function sendPawnToUsedDevices(pawnId) {
    if (confirm('ต้องการส่งข้อมูลเครื่องนี้ไปยังเครื่องมือสองหรือไม่?')) {
        try {
            // ดึงข้อมูลเครื่องขายฝากที่ถูกยึด
            const pawn = await API.get(`${API_ENDPOINTS.pawn}/${pawnId}`);
            if (!pawn) {
                alert('ไม่พบข้อมูลเครื่องขายฝาก');
                return;
            }

            // สร้างข้อมูลเครื่องมือสอง - ลงเฉพาะข้อมูลที่มีจากเครื่องขายฝาก
            const usedDeviceData = {
                id: 'U' + Date.now().toString(),
                brand: pawn.brand,
                model: pawn.model,
                color: pawn.color,
                imei: pawn.imei,
                ram: pawn.ram,
                rom: pawn.rom,
                device_condition: '-', // ไม่มีในเครื่องขายฝาก ให้แก้ไขภายหลัง
                purchase_price: pawn.pawn_amount || pawn.pawnAmount || 0, // ใช้ยอดขายฝากเป็นต้นทุน
                import_date: new Date().toISOString().split('T')[0],
                sale_price: null,
                sale_date: null,
                status: 'stock',
                note: `ยึดจากเครื่องขายฝาก - ยอดฝาก: ${formatCurrency(pawn.pawn_amount || pawn.pawnAmount || 0)}`,
                store: pawn.store
            };

            // ส่งไปยังเครื่องมือสอง
            await API.post(API_ENDPOINTS.usedDevices, usedDeviceData);

            // ลบเครื่องออกจากรายการขายฝาก
            await API.delete(`${API_ENDPOINTS.pawn}/${pawnId}`);

            loadPawnData();
            showNotification('ส่งข้อมูลไปเครื่องมือสองสำเร็จ - กรุณาแก้ไขสภาพเครื่องและราคาตามต้องการ');
        } catch (error) {
            alert('เกิดข้อผิดพลาด: ' + error.message);
            console.error(error);
        }
    }
}

// Update pawn tab counts
function updatePawnTabCounts(allPawns = []) {
    // Count pawns by status from API data
    const activeCount = allPawns.filter(p => p.status === 'active').length;
    const returnedCount = allPawns.filter(p => p.status === 'returned').length;
    const seizedCount = allPawns.filter(p => p.status === 'seized').length;

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
async function applyNewDevicesFilter() {
    const searchTerm = document.getElementById('searchNewDevices').value.toLowerCase();

    try {
        // Get devices from API
        const allDevices = await API.get(API_ENDPOINTS.newDevices, { store: currentStore });

        // Stock: Show current data always (no date filter)
        let stockDevices = allDevices.filter(d => d.status === 'stock');

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
        let soldDevices = allDevices.filter(d => d.status === 'sold');

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
        let removedDevices = allDevices.filter(d => d.status === 'removed');

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

        // Update tab counts
        const stockCountElement = document.getElementById('newStockCount');
        const soldCountElement = document.getElementById('newSoldCount');
        const removedCountElement = document.getElementById('newRemovedCount');

        if (stockCountElement) stockCountElement.textContent = stockDevices.length;
        if (soldCountElement) soldCountElement.textContent = soldDevices.length;
        if (removedCountElement) removedCountElement.textContent = removedDevices.length;
    } catch (error) {
        console.error('Error loading new devices:', error);
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    }
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
async function applyUsedDevicesFilter() {
    const searchTerm = document.getElementById('searchUsedDevices').value.toLowerCase();

    try {
        // Get devices from API
        const allDevices = await API.get(API_ENDPOINTS.usedDevices, { store: currentStore });

        // Stock: Show current data always (no date filter)
        let stockDevices = allDevices.filter(d => d.status === 'stock');

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
        let soldDevices = allDevices.filter(d => d.status === 'sold');

        // Apply date filter for sold devices
        if (currentUsedDevicesFilter.month || currentUsedDevicesFilter.year) {
            soldDevices = soldDevices.filter(device => {
                const saleDate = device.sale_date || device.saleDate;
                if (!saleDate) return false;
                const date = new Date(saleDate);
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
                const saleDate = device.sale_date || device.saleDate;
                if (!saleDate) return false;
                const date = new Date(saleDate);
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
        let removedDevices = allDevices.filter(d => d.status === 'removed');

        // Apply date filter for removed devices
        if (currentUsedDevicesFilter.month || currentUsedDevicesFilter.year) {
            removedDevices = removedDevices.filter(device => {
                const saleDate = device.sale_date || device.saleDate;
                if (!saleDate) return false;
                const date = new Date(saleDate);
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
                const saleDate = device.sale_date || device.saleDate;
                if (!saleDate) return false;
                const date = new Date(saleDate);
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

        // Update tab counts
        const stockCountElement = document.getElementById('usedStockCount');
        const soldCountElement = document.getElementById('usedSoldCount');
        const removedCountElement = document.getElementById('usedRemovedCount');

        if (stockCountElement) stockCountElement.textContent = stockDevices.length;
        if (soldCountElement) soldCountElement.textContent = soldDevices.length;
        if (removedCountElement) removedCountElement.textContent = removedDevices.length;
    } catch (error) {
        console.error('Error loading used devices:', error);
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    }
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
    initializeUsedDevicesDatabase();
    initializeRepairDatabase();
    initializeInstallmentDatabase();
    // initializePawnDatabase(); // Disabled - now using MySQL API instead of localStorage
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

            // Skip if button has onclick attribute (handled by specific function)
            if (this.hasAttribute('onclick')) {
                return;
            }

            // Remove active class from all tabs and contents
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            const tabContent = document.getElementById(tabName + '-tab');
            if (tabContent) {
                tabContent.classList.add('active');
            }
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

        API.get(`${API_ENDPOINTS.newDevices}/${deviceId}`).then(device => {
            document.getElementById('deviceId').value = device.id;
            document.getElementById('brand').value = device.brand;
            document.getElementById('model').value = device.model;
            document.getElementById('color').value = device.color;
            document.getElementById('imei').value = device.imei;
            document.getElementById('ram').value = device.ram;
            document.getElementById('rom').value = device.rom;
            document.getElementById('purchasePrice').value = device.purchase_price || device.purchasePrice;
            document.getElementById('importDate').value = device.import_date || device.importDate;
            document.getElementById('salePrice').value = device.sale_price || device.salePrice;
            document.getElementById('saleDate').value = device.sale_date || device.saleDate || '';
            document.getElementById('status').value = device.status;
            document.getElementById('note').value = device.note || '';

            toggleSaleDateField();
        }).catch(error => {
            alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
            console.error(error);
        });
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
async function saveNewDevice(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const deviceData = {
        brand: formData.get('brand'),
        model: formData.get('model'),
        color: formData.get('color'),
        imei: formData.get('imei'),
        ram: formData.get('ram'),
        rom: formData.get('rom'),
        purchase_price: parseFloat(formData.get('purchasePrice')),
        import_date: formData.get('importDate'),
        sale_price: parseFloat(formData.get('salePrice')),
        sale_date: formData.get('saleDate') || null,
        status: formData.get('status'),
        note: formData.get('note') || '',
        store: currentStore
    };

    try {
        if (currentEditId) {
            // Update existing device
            await API.put(`${API_ENDPOINTS.newDevices}/${currentEditId}`, deviceData);
            showNotification('บันทึกข้อมูลสำเร็จ');
        } else {
            // Add new device
            deviceData.id = Date.now().toString();
            await API.post(API_ENDPOINTS.newDevices, deviceData);
            showNotification('เพิ่มเครื่องใหม่สำเร็จ');
        }

        // Reload data
        loadNewDevicesData();

        // Close modal
        closeNewDeviceModal();
    } catch (error) {
        alert('เกิดข้อผิดพลาด: ' + error.message);
        console.error(error);
    }
}

// Load and display new devices data
function loadNewDevicesData() {
    // Apply current filter (which will show current month by default)
    applyNewDevicesFilter();

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
        const purchasePrice = device.purchase_price || device.purchasePrice;
        const salePrice = device.sale_price || device.salePrice;
        const importDate = device.import_date || device.importDate;
        const saleDate = device.sale_date || device.saleDate;

        if (type === 'stock') {
            return `
                <tr>
                    <td>${device.brand}</td>
                    <td>${device.model}</td>
                    <td>${device.color}</td>
                    <td>${device.imei}</td>
                    <td>${device.ram}/${device.rom} GB</td>
                    <td>${formatCurrency(purchasePrice)}</td>
                    <td>${formatDate(importDate)}</td>
                    <td>${formatCurrency(salePrice)}</td>
                    <td>
                        <button class="action-btn btn-sell" onclick="markAsSold('${device.id}')">ขาย</button>
                        <button class="action-btn btn-installment" onclick="transferToInstallment('${device.id}')" style="background: #8b5cf6;">ผ่อน</button>
                        <button class="action-btn btn-remove" onclick="markAsRemoved('${device.id}')">ตัด</button>
                        <button class="action-btn btn-edit" onclick="openNewDeviceModal('${device.id}')">แก้ไข</button>
                        <button class="action-btn btn-delete" onclick="deleteDevice('${device.id}')">ลบ</button>
                    </td>
                </tr>
            `;
        } else if (type === 'sold') {
            const profit = salePrice - purchasePrice;
            const profitColor = profit >= 0 ? '#10b981' : '#ef4444';
            return `
                <tr>
                    <td>${device.brand}</td>
                    <td>${device.model}</td>
                    <td>${device.color}</td>
                    <td>${device.imei}</td>
                    <td>${device.ram}/${device.rom} GB</td>
                    <td>${formatCurrency(purchasePrice)}</td>
                    <td>${formatCurrency(salePrice)}</td>
                    <td>${formatDate(saleDate)}</td>
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
                    <td>${formatCurrency(purchasePrice)}</td>
                    <td>${formatDate(importDate)}</td>
                    <td>${formatDate(saleDate)}</td>
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
async function markAsSold(deviceId) {
    if (confirm('ต้องการบันทึกการขายเครื่องนี้หรือไม่?')) {
        try {
            await API.put(`${API_ENDPOINTS.newDevices}/${deviceId}`, {
                status: 'sold',
                sale_date: new Date().toISOString().split('T')[0]
            });
            loadNewDevicesData();
            showNotification('บันทึกการขายสำเร็จ');
        } catch (error) {
            alert('เกิดข้อผิดพลาด: ' + error.message);
            console.error(error);
        }
    }
}

// Mark device as removed
async function markAsRemoved(deviceId) {
    try {
        const device = await API.get(`${API_ENDPOINTS.newDevices}/${deviceId}`);

        // Ask for removal type
        const choice = confirm('กดตกลงเพื่อ "ตัดขายให้เจ้าอื่น"\nกดยกเลิกเพื่อ "ตัดสลับในร้านตัวเอง"');

        if (choice) {
            // ตัดขายให้เจ้าอื่น
            const note = prompt('กรุณาระบุเหตุผลในการตัดขายให้เจ้าอื่น:');
            if (note !== null) {
                await API.put(`${API_ENDPOINTS.newDevices}/${deviceId}`, {
                    status: 'removed',
                    sale_date: new Date().toISOString().split('T')[0],
                    note: note
                });
                loadNewDevicesData();
                showNotification('ตัดออกสำเร็จ');
            }
        } else {
            // ตัดสลับในร้านตัวเอง
            const otherStore = device.store === 'salaya' ? 'klongyong' : 'salaya';
            const otherStoreName = stores[otherStore];

            if (confirm(`ต้องการย้ายเครื่องนี้ไปยัง ${otherStoreName} ใช่หรือไม่?`)) {
                await API.put(`${API_ENDPOINTS.newDevices}/${deviceId}`, {
                    store: otherStore
                });
                loadNewDevicesData();
                showNotification(`ย้ายเครื่องไปยัง ${otherStoreName} สำเร็จ`);
            }
        }
    } catch (error) {
        alert('เกิดข้อผิดพลาด: ' + error.message);
        console.error(error);
    }
}

// Delete device
async function deleteDevice(deviceId) {
    if (confirm('ต้องการลบข้อมูลนี้หรือไม่? (ไม่สามารถกู้คืนได้)')) {
        try {
            await API.delete(`${API_ENDPOINTS.newDevices}/${deviceId}`);
            loadNewDevicesData();
            showNotification('ลบข้อมูลสำเร็จ');
        } catch (error) {
            alert('เกิดข้อผิดพลาด: ' + error.message);
            console.error(error);
        }
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
            // Convert date to YYYY-MM-DD format
            const importDate = accessory.import_date ? new Date(accessory.import_date).toISOString().split('T')[0] : '';
            document.getElementById('accessoryImportDate').value = importDate;
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
// Use accessory (decrease quantity by 1)
async function useAccessory(accessoryId) {
    if (!confirm('ต้องการใช้งานอะไหล่นี้ใช่หรือไม่? (จำนวนจะลดลง 1)')) return;

    try {
        // Get current accessory data
        const accessory = await API.get(`${API_ENDPOINTS.accessories}/${accessoryId}`);

        if (!accessory) {
            alert('ไม่พบข้อมูลอะไหล่');
            return;
        }

        const claimQuantity = Number(accessory.claim_quantity) || 0;
        const availableQuantity = Number(accessory.quantity) - claimQuantity;

        if (availableQuantity <= 0) {
            alert('อะไหล่หมด ไม่สามารถใช้งานได้');
            return;
        }

        // Decrease quantity by 1
        const newQuantity = Number(accessory.quantity) - 1;

        // Convert import_date to YYYY-MM-DD format
        const importDate = accessory.import_date ? new Date(accessory.import_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

        // Update accessory
        await API.put(`${API_ENDPOINTS.accessories}/${accessoryId}`, {
            type: accessory.type,
            code: accessory.code,
            brand: accessory.brand,
            models: accessory.models,
            quantity: newQuantity,
            cost_price: accessory.cost_price,
            repair_price: accessory.repair_price,
            import_date: importDate,
            note: accessory.note,
            store: accessory.store
        });

        loadAccessoriesData();
        showNotification('ใช้งานอะไหล่สำเร็จ จำนวนเหลือ: ' + newQuantity);
    } catch (error) {
        alert('เกิดข้อผิดพลาด: ' + error.message);
        console.error(error);
    }
}

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
    console.log(`[loadAccessoriesData] Loading for store: ${currentStore}`);
    try {
        // Get accessories from API
        const allAccessories = await API.get(API_ENDPOINTS.accessories, { store: currentStore });
        console.log(`[loadAccessoriesData] Loaded ${allAccessories.length} accessories`);

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
        const batteryAccessories = filteredAccessories.filter(a => a.type === 'battery' && Number(a.quantity) > 0);
        const screenAccessories = filteredAccessories.filter(a => a.type === 'screen' && Number(a.quantity) > 0);
        const chargingAccessories = filteredAccessories.filter(a => a.type === 'charging' && Number(a.quantity) > 0);
        const switchAccessories = filteredAccessories.filter(a => a.type === 'switch' && Number(a.quantity) > 0);
        const outOfStockAccessories = filteredAccessories.filter(a => Number(a.quantity) === 0);
        const claimAccessories = filteredAccessories.filter(a => (Number(a.claim_quantity) || 0) > 0);

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
    console.log(`[displayAccessories] ${tableBodyId}: ${accessoriesList.length} items`);
    
    const tbody = document.getElementById(tableBodyId);
    if (!tbody) {
        console.error(`[displayAccessories] Table body not found: ${tableBodyId}`);
        return;
    }

    if (accessoriesList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-state">ไม่มีข้อมูล</td></tr>';
        console.log(`[displayAccessories] ${tableBodyId}: No data, set empty state`);
        return;
    }

    tbody.innerHTML = accessoriesList.map(acc => {
        const claimQuantity = Number(acc.claim_quantity) || 0;
        const availableQuantity = Number(acc.quantity) - claimQuantity;

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
                ${availableQuantity > 0 ? `<button class="action-btn btn-success" onclick="useAccessory('${acc.id}')">ใช้งาน</button>` : ''}
                ${availableQuantity > 0 ? `<button class="action-btn btn-warning" onclick="openClaimModal('${acc.id}')">เคลม</button>` : ''}
                <button class="action-btn btn-edit" onclick="openAccessoryModal('${acc.id}')">แก้ไข</button>
                <button class="action-btn btn-delete" onclick="deleteAccessory('${acc.id}')">ลบ</button>
            </td>
        </tr>
    `;
    }).join('');
    
    console.log(`[displayAccessories] ${tableBodyId}: Done! Set ${accessoriesList.length} rows`);
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
                <button class="action-btn btn-edit" onclick="openAccessoryModal('${acc.id}')">แก้ไข</button>
                <button class="action-btn btn-delete" onclick="deleteAccessory('${acc.id}')">ลบ</button>
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
        const claimQuantity = Number(acc.claim_quantity) || 0;
        const availableQuantity = Number(acc.quantity) - claimQuantity;

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
                <button class="action-btn btn-success" onclick="openReturnStockModal('${acc.id}')">คืนสต็อก</button>
                <button class="action-btn btn-edit" onclick="openAccessoryModal('${acc.id}')">แก้ไข</button>
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
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">ไม่มีข้อมูลในเดือนนี้</td></tr>';
    } else {
        tbody.innerHTML = filteredPawns.map(pawn => {
            const storeName = stores[pawn.store] || pawn.store;
            const interestMethod = (pawn.interestCollectionMethod || pawn.interest_collection_method) === 'deducted' ? 'หักดอก' : 'ยังไม่หักดอก';
            const redemptionAmount = pawn.redemptionAmount || pawn.redemption_amount || 0;
            return `
                <tr>
                    <td>${storeName}</td>
                    <td>${pawn.brand} ${pawn.model} (${pawn.color})</td>
                    <td class="expense-amount-cell">${formatCurrency(pawn.pawnAmount)}</td>
                    <td>${formatDate(pawn.receiveDate)}</td>
                    <td>${formatCurrency(pawn.interest)}</td>
                    <td>${interestMethod}</td>
                    <td>${formatCurrency(redemptionAmount)}</td>
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
