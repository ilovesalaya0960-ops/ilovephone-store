// Store data
const stores = {
    salaya: 'ร้านไอเลิฟโฟน - ศาลายา',
    klongyong: 'ร้านไอเลิฟโฟน - คลองโยง'
};

let currentStore = 'salaya';
let currentMonth = new Date().toISOString().slice(0, 7); // Format: YYYY-MM

// API Endpoints
const API_ENDPOINTS = {
    newDevices: 'http://localhost:5001/api/new-devices',
    usedDevices: 'http://localhost:5001/api/used-devices',
    repairs: 'http://localhost:5001/api/repairs',
    installment: 'http://localhost:5001/api/installments',
    installments: 'http://localhost:5001/api/installments', // alias
    pawn: 'http://localhost:5001/api/pawn',
    accessories: 'http://localhost:5001/api/accessories',
    equipment: 'http://localhost:5001/api/equipment',
    accessoryClaim: (id) => `http://localhost:5001/api/accessories/${id}/claim`,
    accessoryReturnStock: (id) => `http://localhost:5001/api/accessories/${id}/return-stock`,
    accessoryCut: (id) => `http://localhost:5001/api/accessories/${id}/cut`,
    accessoryCutList: 'http://localhost:5001/api/accessories/cut/list'
};

// ========================================
// Custom Alert/Confirm Dialog Functions
// ========================================

/**
 * แสดง Custom Alert Dialog
 * @param {Object} options - ตัวเลือกสำหรับ alert
 * @param {string} options.title - หัวข้อ
 * @param {string} options.message - ข้อความ
 * @param {Array} options.list - รายการแบบ list (optional)
 * @param {string} options.icon - ประเภท icon: 'success', 'error', 'warning', 'info', 'question'
 * @param {string} options.confirmText - ข้อความปุ่มยืนยัน (default: 'ตกลง')
 * @param {string} options.confirmType - ประเภทปุ่ม: 'success', 'danger', 'primary'
 * @returns {Promise<void>}
 */
function customAlert(options) {
    return new Promise((resolve) => {
        const {
            title = 'แจ้งเตือน',
            message = '',
            list = [],
            icon = 'info',
            confirmText = 'ตกลง',
            confirmType = 'primary'
        } = options;

        const dialog = document.getElementById('customDialog');
        const dialogIcon = document.getElementById('customDialogIcon');
        const dialogTitle = document.getElementById('customDialogTitle');
        const dialogMessage = document.getElementById('customDialogMessage');
        const dialogList = document.getElementById('customDialogList');
        const dialogFooter = dialog.querySelector('.custom-dialog-footer');
        const cancelBtn = document.getElementById('customDialogCancel');
        const confirmBtn = document.getElementById('customDialogConfirm');

        // ตั้งค่า icon
        const iconSymbols = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️',
            question: '❓'
        };

        dialogIcon.className = `custom-dialog-icon ${icon}`;
        dialogIcon.querySelector('.dialog-icon-symbol').textContent = iconSymbols[icon] || iconSymbols.info;

        // ตั้งค่าเนื้อหา
        dialogTitle.textContent = title;
        dialogMessage.textContent = message;

        // ตั้งค่า list
        if (list.length > 0) {
            dialogList.style.display = 'block';
            dialogList.innerHTML = list.map(item => {
                const iconClass = item.icon || 'check';
                const iconSymbol = item.iconSymbol || '✓';
                return `
                    <div class="custom-dialog-list-item">
                        <div class="icon ${iconClass}">${iconSymbol}</div>
                        <div class="text">${item.text}</div>
                    </div>
                `;
            }).join('');
        } else {
            dialogList.style.display = 'none';
            dialogList.innerHTML = '';
        }

        // ซ่อนปุ่มยกเลิก (สำหรับ alert)
        cancelBtn.style.display = 'none';
        dialogFooter.classList.add('single-button');

        // ตั้งค่าปุ่มยืนยัน
        confirmBtn.textContent = confirmText;
        confirmBtn.className = `custom-dialog-btn btn-confirm ${confirmType}`;

        // Event handlers
        const handleConfirm = () => {
            closeCustomDialog();
            resolve();
        };

        const handleOverlayClick = (e) => {
            if (e.target.classList.contains('custom-dialog-overlay')) {
                closeCustomDialog();
                resolve();
            }
        };

        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeCustomDialog();
                resolve();
            }
        };

        // ผูก event listeners
        confirmBtn.onclick = handleConfirm;
        dialog.querySelector('.custom-dialog-overlay').onclick = handleOverlayClick;
        document.addEventListener('keydown', handleEscape);

        // เก็บ handlers ไว้สำหรับ cleanup
        dialog._cleanup = () => {
            confirmBtn.onclick = null;
            dialog.querySelector('.custom-dialog-overlay').onclick = null;
            document.removeEventListener('keydown', handleEscape);
        };

        // แสดง dialog
        dialog.classList.add('show');
    });
}

/**
 * แสดง Custom Confirm Dialog
 * @param {Object} options - ตัวเลือกสำหรับ confirm
 * @param {string} options.title - หัวข้อ
 * @param {string} options.message - ข้อความ
 * @param {Array} options.list - รายการแบบ list (optional)
 * @param {string} options.icon - ประเภท icon: 'success', 'error', 'warning', 'info', 'question'
 * @param {string} options.confirmText - ข้อความปุ่มยืนยัน (default: 'ตกลง')
 * @param {string} options.cancelText - ข้อความปุ่มยกเลิก (default: 'ยกเลิก')
 * @param {string} options.confirmType - ประเภทปุ่ม: 'success', 'danger', 'primary'
 * @returns {Promise<boolean>} - true ถ้ากดยืนยัน, false ถ้ายกเลิก
 */
function customConfirm(options) {
    return new Promise((resolve) => {
        const {
            title = 'ยืนยันการทำงาน',
            message = '',
            list = [],
            icon = 'question',
            confirmText = 'ตกลง',
            cancelText = 'ยกเลิก',
            confirmType = 'primary'
        } = options;

        const dialog = document.getElementById('customDialog');
        const dialogIcon = document.getElementById('customDialogIcon');
        const dialogTitle = document.getElementById('customDialogTitle');
        const dialogMessage = document.getElementById('customDialogMessage');
        const dialogList = document.getElementById('customDialogList');
        const dialogFooter = dialog.querySelector('.custom-dialog-footer');
        const cancelBtn = document.getElementById('customDialogCancel');
        const confirmBtn = document.getElementById('customDialogConfirm');

        // ตั้งค่า icon
        const iconSymbols = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️',
            question: '❓'
        };

        dialogIcon.className = `custom-dialog-icon ${icon}`;
        dialogIcon.querySelector('.dialog-icon-symbol').textContent = iconSymbols[icon] || iconSymbols.question;

        // ตั้งค่าเนื้อหา
        dialogTitle.textContent = title;
        dialogMessage.innerHTML = message; // ใช้ innerHTML เพื่อรองรับ HTML

        // ตั้งค่า list
        if (list.length > 0) {
            dialogList.style.display = 'block';
            dialogList.innerHTML = list.map(item => {
                const iconClass = item.icon || 'check';
                const iconSymbol = item.iconSymbol || '✓';
                return `
                    <div class="custom-dialog-list-item">
                        <div class="icon ${iconClass}">${iconSymbol}</div>
                        <div class="text">${item.text}</div>
                    </div>
                `;
            }).join('');
        } else {
            dialogList.style.display = 'none';
            dialogList.innerHTML = '';
        }

        // แสดงปุ่มยกเลิก (สำหรับ confirm)
        cancelBtn.style.display = 'block';
        dialogFooter.classList.remove('single-button');

        // ตั้งค่าปุ่ม
        cancelBtn.textContent = cancelText;
        confirmBtn.textContent = confirmText;
        confirmBtn.className = `custom-dialog-btn btn-confirm ${confirmType}`;

        // Event handlers
        const handleConfirm = () => {
            closeCustomDialog();
            resolve(true);
        };

        const handleCancel = () => {
            closeCustomDialog();
            resolve(false);
        };

        const handleOverlayClick = (e) => {
            if (e.target.classList.contains('custom-dialog-overlay')) {
                closeCustomDialog();
                resolve(false);
            }
        };

        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeCustomDialog();
                resolve(false);
            }
        };

        // ผูก event listeners
        confirmBtn.onclick = handleConfirm;
        cancelBtn.onclick = handleCancel;
        dialog.querySelector('.custom-dialog-overlay').onclick = handleOverlayClick;
        document.addEventListener('keydown', handleEscape);

        // เก็บ handlers ไว้สำหรับ cleanup
        dialog._cleanup = () => {
            confirmBtn.onclick = null;
            cancelBtn.onclick = null;
            dialog.querySelector('.custom-dialog-overlay').onclick = null;
            document.removeEventListener('keydown', handleEscape);
        };

        // แสดง dialog
        dialog.classList.add('show');
    });
}

/**
 * ปิด Custom Dialog
 */
function closeCustomDialog() {
    const dialog = document.getElementById('customDialog');
    
    // Cleanup event listeners
    if (dialog._cleanup) {
        dialog._cleanup();
        delete dialog._cleanup;
    }
    
    dialog.classList.remove('show');
}

// ===== GLOBAL DATA ARRAYS =====
let newDevices = [];
let usedDevices = [];
let repairDevices = [];
let installmentDevices = [];

// ===== GLOBAL EDIT IDs =====
let currentPawnEditId = null;
let currentEditId = null;
let currentInstallmentEditId = null;

// ===== TRANSFER VARIABLES =====
let transferSourceDeviceId = null;
let transferSourceDeviceType = null; // 'new' or 'used'
let transferTargetStore = null; // ร้านที่จะย้ายไปผ่อน

// ===== OTHER EDIT IDs =====
let currentUsedEditId = null;
let currentRepairEditId = null;
let currentAccessoryEditId = null;

// ===== EXPENSE DETAIL DATA =====
let usedDevicesExpenseDetailData = {
    devices: [],
    month: '',
    year: '',
    total: 0
};

// ===== GLOBAL FILTERS =====
let currentPawnFilter = { startDate: '', endDate: '' };
let currentNewDevicesFilter = { startDate: '', endDate: '' };
let currentUsedDevicesFilter = { startDate: '', endDate: '' };
let currentRepairFilter = { startDate: '', endDate: '' };
let currentInstallmentFilter = { startDate: '', endDate: '' };
let currentDashboardFilter = { startDate: '', endDate: '' };
let currentAccessoryFilter = {
    search: '',
    startDate: '',
    endDate: ''
};

// ===== GLOBAL TABS =====
let currentAccessoryTab = 'battery';
let currentInstallmentType = 'partner';

// ===== PAWN DETAIL DATA =====
let pawnDetailData = {
    activePawns: [],
    allPawns: [],
    returnedPawns: [],
    interestTransactions: [],
    totalExpense: 0,
    totalIncome: 0,
    totalProfit: 0
};

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
                const error = new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
                // Preserve all error data properties
                Object.assign(error, errorData);
                throw error;
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
                const error = new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
                // Preserve all error data properties
                Object.assign(error, errorData);
                throw error;
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
    'expenses': 'รายรับ-รายจ่าย',
    'settings': 'ตั้งค่า',
    'settings-notifications': 'ตั้งค่าแจ้งเตือน',
    'settings-employees': 'ตั้งค่าพนักงาน'
};

// ===== REAL DATA ONLY - NO MOCK DATA =====
// All data is now fetched from the database via API

// Thai month names
const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

// ===== EXPENSE FORM MANAGEMENT =====

// Store expenses data
let expenses = [];
let currentExpenseEditId = null;

// Open expense modal
function openExpenseModal(type = null, expenseId = null) {
    const modal = document.getElementById('expenseModal');
    const modalTitle = document.getElementById('expenseModalTitle');
    const form = document.getElementById('expenseForm');
    
    form.reset();
    currentExpenseEditId = expenseId;
    
    if (expenseId) {
        // Edit mode
        modalTitle.textContent = 'แก้ไขรายการ';
        const expense = expenses.find(e => e.id === expenseId);
        
        if (expense) {
            document.getElementById('expenseType').value = expense.type || 'expense';
            document.getElementById('expenseCategory').value = expense.category;
            document.getElementById('expenseDescription').value = expense.description;
            document.getElementById('expenseAmount').value = expense.amount;
            document.getElementById('expenseDate').value = expense.date;
            document.getElementById('expenseStore').value = expense.store;
            document.getElementById('expenseNote').value = expense.note || '';
        }
    } else {
        // Add mode
        if (type === 'income') {
            modalTitle.textContent = 'เพิ่มรายรับ';
            document.getElementById('expenseType').value = 'income';
        } else if (type === 'expense') {
            modalTitle.textContent = 'เพิ่มรายจ่าย';
            document.getElementById('expenseType').value = 'expense';
        } else {
            modalTitle.textContent = 'เพิ่มรายการ';
        }
        
        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('expenseDate').value = today;
        
        // Set default store to current store
        document.getElementById('expenseStore').value = currentStore;
    }
    
    handleExpenseTypeChange();
    modal.classList.add('show');
}

// Handle expense type change (income/expense)
function handleExpenseTypeChange() {
    const typeSelect = document.getElementById('expenseType');
    const categorySelect = document.getElementById('expenseCategory');
    
    if (!typeSelect || !categorySelect) return;
    
    const selectedType = typeSelect.value;
    
    // Clear current options
    categorySelect.innerHTML = '<option value="">-- เลือกหมวดหมู่ --</option>';
    
    if (selectedType === 'income') {
        // Income categories
        categorySelect.innerHTML += `
            <option value="sales">รายได้จากขาย</option>
            <option value="service">รายได้จากบริการซ่อม</option>
            <option value="interest">ดอกเบี้ย</option>
            <option value="commission">ค่าคอมมิชชั่น</option>
            <option value="other">อื่นๆ</option>
        `;
    } else if (selectedType === 'expense') {
        // Expense categories
        categorySelect.innerHTML += `
            <option value="salary">ค่าแรงพนักงาน</option>
            <option value="rent">ค่าเช่าร้าน</option>
            <option value="utilities">ค่าน้ำ-ค่าไฟ</option>
            <option value="internet">ค่าอินเทอร์เน็ต</option>
            <option value="transport">ค่าขนส่ง</option>
            <option value="marketing">ค่าโฆษณา/การตลาด</option>
            <option value="maintenance">ค่าซ่อมบำรุง</option>
            <option value="supplies">ค่าวัสดุสิ้นเปลือง</option>
            <option value="other">อื่นๆ</option>
        `;
    }
}

// Close expense modal
function closeExpenseModal() {
    const modal = document.getElementById('expenseModal');
    modal.classList.remove('show');
    currentExpenseEditId = null;
}

// Save expense
async function saveExpense(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    const expenseData = {
        id: currentExpenseEditId || 'EXP' + Date.now().toString(),
        type: formData.get('type') || 'expense',
        category: formData.get('category'),
        description: formData.get('description'),
        amount: parseFloat(formData.get('amount')),
        date: formData.get('date'),
        store: formData.get('store'),
        note: formData.get('note') || '',
        created_at: currentExpenseEditId ? 
            expenses.find(e => e.id === currentExpenseEditId)?.created_at : 
            new Date().toISOString()
    };
    
    try {
        if (currentExpenseEditId) {
            // Update existing expense
            const index = expenses.findIndex(e => e.id === currentExpenseEditId);
            if (index !== -1) {
                expenses[index] = expenseData;
            }
            const typeText = expenseData.type === 'income' ? 'รายรับ' : 'รายจ่าย';
            showNotification(`แก้ไข${typeText}สำเร็จ`, 'success');
        } else {
            // Add new expense
            expenses.push(expenseData);
            const typeText = expenseData.type === 'income' ? 'รายรับ' : 'รายจ่าย';
            showNotification(`เพิ่ม${typeText}สำเร็จ`, 'success');
        }
        
        // Save to localStorage
        localStorage.setItem('expenses', JSON.stringify(expenses));
        
        // Reload expense table
        loadExpenseTable();
        
        // Close modal
        closeExpenseModal();
        
    } catch (error) {
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: error.message,
            icon: 'error',
            confirmType: 'danger'
        });
        console.error(error);
    }
}

// Load expense table
function loadExpenseTable() {
    const incomeTbody = document.getElementById('incomeDetailsTableBody');
    const expenseTbody = document.getElementById('expenseDetailsTableBody');
    
    if (!incomeTbody || !expenseTbody) return;
    
    // Get selected month
    const selectedMonth = document.getElementById('expenseMonthSelect')?.value;
    
    // Filter by month (if selected)
    let filteredExpenses = expenses;
    if (selectedMonth) {
        filteredExpenses = expenses.filter(expense => {
            const expenseMonth = expense.date.slice(0, 7);
            return expenseMonth === selectedMonth;
        });
    }
    
    // Separate income and expenses
    const incomeItems = filteredExpenses.filter(item => item.type === 'income');
    const expenseItems = filteredExpenses.filter(item => item.type !== 'income');
    
    // Category labels
    const categoryLabels = {
        // Income categories
        'sales': 'รายได้จากขาย',
        'service': 'รายได้จากบริการซ่อม',
        'interest': 'ดอกเบี้ย',
        'commission': 'ค่าคอมมิชชั่น',
        // Expense categories
        'salary': 'ค่าแรงพนักงาน',
        'rent': 'ค่าเช่าร้าน',
        'utilities': 'ค่าน้ำ-ค่าไฟ',
        'internet': 'ค่าอินเทอร์เน็ต',
        'transport': 'ค่าขนส่ง',
        'marketing': 'ค่าโฆษณา/การตลาด',
        'maintenance': 'ค่าซ่อมบำรุง',
        'supplies': 'ค่าวัสดุสิ้นเปลือง',
        'other': 'อื่นๆ'
    };
    
    // Display income items
    if (incomeItems.length === 0) {
        incomeTbody.innerHTML = '<tr><td colspan="6" class="empty-state">ไม่มีข้อมูล</td></tr>';
    } else {
        incomeItems.sort((a, b) => new Date(b.date) - new Date(a.date));
        incomeTbody.innerHTML = incomeItems.map(item => `
            <tr>
                <td>${categoryLabels[item.category] || item.category}</td>
                <td>${item.description}</td>
                <td>${formatCurrency(item.amount)}</td>
                <td>${formatDate(item.date)}</td>
                <td>${item.note || '-'}</td>
                <td>
                    <button class="action-btn btn-edit" onclick="openExpenseModal(null, '${item.id}')">แก้ไข</button>
                    <button class="action-btn btn-delete" onclick="deleteExpense('${item.id}')">ลบ</button>
                </td>
            </tr>
        `).join('');
    }
    
    // Display expense items
    if (expenseItems.length === 0) {
        expenseTbody.innerHTML = '<tr><td colspan="6" class="empty-state">ไม่มีข้อมูล</td></tr>';
    } else {
        expenseItems.sort((a, b) => new Date(b.date) - new Date(a.date));
        expenseTbody.innerHTML = expenseItems.map(item => `
            <tr>
                <td>${categoryLabels[item.category] || item.category}</td>
                <td>${item.description}</td>
                <td>${formatCurrency(item.amount)}</td>
                <td>${formatDate(item.date)}</td>
                <td>${item.note || '-'}</td>
                <td>
                    <button class="action-btn btn-edit" onclick="openExpenseModal(null, '${item.id}')">แก้ไข</button>
                    <button class="action-btn btn-delete" onclick="deleteExpense('${item.id}')">ลบ</button>
                </td>
            </tr>
        `).join('');
    }
    
    // Calculate total
    const total = expenseItems.reduce((sum, item) => sum + item.amount, 0);
    updateExpenseTotal(total);
}

// Update expense total
function updateExpenseTotal(total) {
    const totalElement = document.getElementById('totalExpenseAmount');
    if (totalElement) {
        totalElement.textContent = formatCurrency(total);
    }
}

// Delete expense
async function deleteExpense(expenseId) {
    const confirmed = await customConfirm({
        title: 'ยืนยันการลบ',
        message: 'คุณต้องการลบรายการค่าใช้จ่ายนี้หรือไม่?',
        icon: 'warning',
        confirmText: 'ลบ',
        cancelText: 'ยกเลิก',
        confirmType: 'danger'
    });
    
    if (!confirmed) return;
    
    try {
        // Remove from array
        expenses = expenses.filter(e => e.id !== expenseId);
        
        // Save to localStorage
        localStorage.setItem('expenses', JSON.stringify(expenses));
        
        // Reload table
        loadExpenseTable();
        
        showNotification('ลบค่าใช้จ่ายสำเร็จ', 'success');
    } catch (error) {
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: error.message,
            icon: 'error',
            confirmType: 'danger'
        });
        console.error(error);
    }
}

// Load expenses from localStorage
function loadExpensesFromStorage() {
    const stored = localStorage.getItem('expenses');
    if (stored) {
        expenses = JSON.parse(stored);
    }
    loadExpenseTable();
}

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
                // Ensure accessories tabs work when navigating via sidebar
                switchAccessoryTab(currentAccessoryTab || 'battery');
            } else if (page === 'equipment') {
                loadEquipmentData();
                // Ensure equipment tabs work when navigating via sidebar
                switchEquipmentTab(currentAccessoryTab || 'charger-set');
            } else if (page === 'new-devices') {
                loadNewDevicesData();
                // Ensure new devices tabs work when navigating via sidebar
                initializeNewTabs();
                // Initialize date filter
                initializeNewDevicesDateFilter();
                // Initialize search
                initializeSearch();
            } else if (page === 'used-devices') {
                loadUsedDevicesData();
                // Ensure used-devices tabs work when navigating via sidebar
                initializeUsedTabs();
                // Initialize date filter
                initializeUsedDevicesDateFilter();
                // Initialize search
                initializeUsedSearch();
            } else if (page === 'repair') {
                loadRepairData();
                // Ensure repair tabs work when navigating via sidebar
                initializeRepairTabs();
            } else if (page === 'installment') {
                loadInstallmentData();
                // Ensure installment tabs work when navigating via sidebar
                initializeInstallmentTabs();
            } else if (page === 'pawn') {
                loadPawnData();
                // Ensure pawn tabs work when navigating via sidebar
                initializePawnTabs();
                // Initialize date filter
                initializePawnDateFilter();
            } else if (page === 'expenses') {
                loadExpensesFromStorage();
                initializeExpenseMonthSelector();
            } else if (page === 'settings-notifications') {
                loadNotificationSettings();
            } else if (page === 'settings-employees') {
                loadEmployeesData();
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
            .reduce((sum, d) => sum + (parseFloat(d.sale_price || d.salePrice) || 0), 0);
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
            .reduce((sum, d) => sum + (parseFloat(d.sale_price || d.salePrice) || 0), 0);
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
            .reduce((sum, i) => {
                const salePrice = parseFloat(i.sale_price || i.salePrice) || 0;
                const commission = parseFloat(i.commission) || 0;
                const installmentType = i.installment_type || i.installmentType || 'partner';

                // Partner: รายรับ = ยอดจัด + ค่าคอม
                // ร้าน: รายรับ = ยอดจัด
                if (installmentType === 'partner') {
                    return sum + salePrice + commission;
                } else {
                    return sum + salePrice;
                }
            }, 0);
    }

    // Income from pawn (interest + returned amount)
    let incomePawn = 0;

    // 1. Income from pawn interest (use data from pawnDetailData if available)
    let pawnInterestAmount = 0;
    
    // ใช้ข้อมูลจาก pawnDetailData ที่คำนวณแล้วใน updatePawnDashboard()
    if (pawnDetailData && pawnDetailData.totalIncome !== undefined) {
        pawnInterestAmount = parseFloat(pawnDetailData.totalIncome) || 0;
        console.log('✅ Using pawn income from pawnDetailData:', pawnInterestAmount);
        console.log('   Type:', typeof pawnInterestAmount);
    } else {
        // Fallback: ใช้ API summary เหมือนเดิม
    try {
        const [year, month] = currentMonth.split('-');
        const pawnInterest = await API.get('http://localhost:5001/api/pawn-interest/summary', {
            store: currentStore,
            year: year,
            month: month
        });
        pawnInterestAmount = parseFloat(pawnInterest.total_interest) || 0;
            console.log('⚠️ Using pawn interest from API summary:', pawnInterestAmount);
    } catch (error) {
        console.error('Error loading pawn interest:', error);
        }
    }

    // 2. Income from returned pawn devices - ไม่นับเพราะ pawnDetailData.totalIncome รวมแล้ว
    let returnedPawnAmount = 0;
    
    // ถ้าใช้ข้อมูลจาก pawnDetailData แล้ว ไม่ต้องบวกยอดไถ่ถอนอีก เพราะรวมแล้ว
    if (pawnDetailData && pawnDetailData.totalIncome !== undefined) {
        console.log('ℹ️ Pawn income already includes redemption amount from pawnDetailData');
        // incomePawn = pawnInterestAmount already includes everything
        incomePawn = parseFloat(pawnInterestAmount) || 0;
        console.log('✅ Final incomePawn (as number):', incomePawn);
    } else {
        // ถ้าใช้ API summary ต้องบวกยอดไถ่ถอนเอง
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
    }
    
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
            .reduce((sum, r) => sum + (parseFloat(r.repairCost) || 0), 0);
    }

    // Calculate total income (ensure all values are numbers)
    const totalIncomeAmount = parseFloat(incomeNewDevices || 0) + 
                              parseFloat(incomeUsedDevices || 0) + 
                              parseFloat(incomeInstallment || 0) + 
                              parseFloat(incomePawn || 0) + 
                              parseFloat(incomeRepair || 0);

    // Update Main Dashboard Cards (4 การ์ดหลัก)
    const statPawnCount = document.getElementById('statPawnCount');
    const statTotalExpense = document.getElementById('statTotalExpense');
    const statTotalIncome = document.getElementById('statTotalIncome');
    const statProfit = document.getElementById('statProfit');

    // Update จำนวนเครื่องฝาก
    if (statPawnCount) statPawnCount.textContent = realPawnDevicesCount;

    // Update Quick Access Menu counts
    const quickNewDevices = document.getElementById('quickNewDevices');
    const quickUsedDevices = document.getElementById('quickUsedDevices');
    const quickRepair = document.getElementById('quickRepair');
    const quickAccessories = document.getElementById('quickAccessories');
    const quickEquipment = document.getElementById('quickEquipment');

    if (quickNewDevices) quickNewDevices.textContent = `${realNewDevicesCount} เครื่อง`;
    if (quickUsedDevices) quickUsedDevices.textContent = `${realUsedDevicesCount} เครื่อง`;

    // Count repair devices (pending/in-progress)
    const realRepairCount = repairDevices ? repairDevices.filter(r =>
        r.store === currentStore && (r.status === 'pending' || r.status === 'in-progress')
    ).length : 0;
    if (quickRepair) quickRepair.textContent = `${realRepairCount} รายการ`;

    // Note: Accessories and Equipment counts will be updated by their respective load functions

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
            .reduce((sum, d) => sum + (parseFloat(d.purchase_price || d.purchasePrice) || 0), 0);
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
            .reduce((sum, d) => sum + (parseFloat(d.purchase_price || d.purchasePrice) || 0), 0);
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
            .reduce((sum, i) => sum + (parseFloat(i.costPrice) || 0), 0);
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

    // Update Main Dashboard Cards (รายจ่าย, รายรับ, รายได้)
    if (statTotalExpense) {
        statTotalExpense.textContent = formatCurrency(totalExpenseAmount);
    }
    
    if (statTotalIncome) {
        statTotalIncome.textContent = formatCurrency(totalIncomeAmount);
    }
    
    const profit = totalIncomeAmount - totalExpenseAmount;
    if (statProfit) {
        statProfit.textContent = formatCurrency(profit);
    }

    // Update old total cards (for other pages)
    if (totalExpense) {
        totalExpense.textContent = formatCurrency(totalExpenseAmount);
        console.log('Total expense updated:', totalExpenseAmount);
    }

    // Recalculate net profit with real data
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

    // Initialize tabs for specific pages
    if (pageName === 'pawn') {
        loadPawnData();
        initializePawnTabs();
    } else if (pageName === 'used-devices') {
        initializeUsedTabs();
    } else if (pageName === 'installment') {
        initializeInstallmentTabs();
    } else if (pageName === 'new-devices') {
        initializeNewTabs();
    } else if (pageName === 'repair') {
        initializeRepairTabs();
    } else if (pageName === 'accessories') {
        switchAccessoryTab(currentAccessoryTab || 'battery');
    } else if (pageName === 'equipment') {
        loadEquipmentData();
        // Ensure equipment tabs work when navigating via quick access
        switchEquipmentTab(currentAccessoryTab || 'charger-set');
    }

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

// Data storage

// Initialize new devices database
async function initializeNewDevicesDatabase() {
    try {
        // โหลดข้อมูลจาก API แทน localStorage
        newDevices = await API.get(API_ENDPOINTS.newDevices);
        console.log('✅ โหลดข้อมูลเครื่องใหม่จาก API สำเร็จ');
        console.log(`📊 มีข้อมูลทั้งหมด ${newDevices.length} รายการ`);
        loadNewDevicesData();
    } catch (error) {
        console.error('Error loading new devices from API:', error);
        newDevices = [];
    }
}

// ===== NEW DEVICES CRUD FUNCTIONS =====

// Initialize new devices tabs
function initializeNewTabs() {
    const tabButtons = document.querySelectorAll('#new-devices .tab-btn');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');

            // Remove active class from all new devices tabs and contents
            document.querySelectorAll('#new-devices .tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('#new-devices .tab-content').forEach(content => content.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(tabName + '-tab').classList.add('active');
        });
    });
}

// ===== USED DEVICES DATABASE =====

// Mock database for used devices

// Initialize used devices database
async function initializeUsedDevicesDatabase() {
    try {
        // โหลดข้อมูลจาก API แทน localStorage
        usedDevices = await API.get(API_ENDPOINTS.usedDevices);
        console.log('✅ โหลดข้อมูลเครื่องมือสองจาก API สำเร็จ');
        console.log(`📊 มีข้อมูลทั้งหมด ${usedDevices.length} รายการ`);
        loadUsedDevicesData();
    } catch (error) {
        console.error('Error loading used devices from API:', error);
        usedDevices = [];
    }
}

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
                document.getElementById('usedPurchasedFrom').value = device.purchased_from || '';
                document.getElementById('usedDeviceCategory').value = device.device_category || 'No Active';
                document.getElementById('usedPurchasePrice').value = device.purchase_price || device.purchasePrice;
                document.getElementById('usedPurchaseDate').value = device.import_date || device.purchase_date || device.purchaseDate;
                document.getElementById('usedSalePrice').value = device.sale_price || device.salePrice;
                document.getElementById('usedSaleDate').value = device.sale_date || device.saleDate || '';
                document.getElementById('usedCondition').value = device.device_condition || device.condition;
                document.getElementById('usedStatus').value = device.status;
                document.getElementById('usedNote').value = device.note || '';

                toggleUsedSaleDateField();
            }
        } catch (error) {
            console.error('Error loading device:', error);
            await customAlert({
                title: 'เกิดข้อผิดพลาด',
                message: 'ไม่สามารถโหลดข้อมูลได้',
                icon: 'error',
                confirmType: 'danger'
            });
        }
    } else {
        // Add mode
        modalTitle.textContent = 'เพิ่มเครื่องมือสอง';
        // Set default purchase date to today
        document.getElementById('usedPurchaseDate').value = new Date().toISOString().split('T')[0];
        // Set default device category
        document.getElementById('usedDeviceCategory').value = 'No Active';
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
        purchased_from: formData.get('purchasedFrom') || '',
        device_category: formData.get('deviceCategory') || 'No Active',
        device_condition: formData.get('condition'),
        purchase_price: parseFloat(formData.get('purchasePrice')),
        import_date: formData.get('purchaseDate'),
        sale_price: parseFloat(formData.get('salePrice')),
        sale_date: formData.get('saleDate') || null,
        status: formData.get('status'),
        note: formData.get('note') || '',
        store: currentStore
    };

    // 🛡️ ตรวจสอบความขัดแย้งระหว่างสถานะและหมายเหตุ
    if (deviceData.status === 'sold' && deviceData.note) {
        const hasConflict = deviceData.note.includes('ตัดสลับ') || 
                           deviceData.note.includes('โอน') || 
                           deviceData.note.includes('ย้าย');
        
        if (hasConflict) {
            await customAlert({
                title: '⚠️ ข้อมูลขัดแย้ง',
                message: 'ไม่สามารถบันทึกการขายพร้อมกับหมายเหตุการโอนสต็อกได้\n\n' +
                        'กรุณาเลือกอย่างใดอย่างหนึ่ง:\n' +
                        '• สถานะ "ขายแล้ว" (sold) - ถ้าสินค้าถูกขายจริง\n' +
                        '• สถานะ "ตัดออก" (removed) + หมายเหตุ "ตัดสลับ/โอน" - ถ้าสินค้าโอนไปร้านอื่น',
                icon: 'error'
            });
            return; // หยุดการบันทึก
        }
    }

    // ตรวจสอบการ removed พร้อมกับหมายเหตุขาย
    if (deviceData.status === 'removed' && deviceData.note) {
        const hasConflict = deviceData.note.includes('ขาย') || deviceData.note.includes('sold');
        
        if (hasConflict) {
            await customAlert({
                title: '⚠️ ข้อมูลขัดแย้ง',
                message: 'ไม่สามารถบันทึกการโอนสต็อกพร้อมกับหมายเหตุการขายได้',
                icon: 'error'
            });
            return; // หยุดการบันทึก
        }
    }

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
        console.error('Error saving used device:', error);

        // Check if it's a duplicate IMEI error
        if (error.duplicate || (error.message && error.message.includes('IMEI'))) {
            await customAlert({
                title: '❌ IMEI ซ้ำ',
                message: `IMEI "${deviceData.imei}" มีอยู่ในระบบแล้ว\n\nกรุณาตรวจสอบ IMEI อีกครั้ง หรือตรวจสอบว่าเครื่องนี้ถูกบันทึกไปแล้วหรือไม่`,
                icon: 'error'
            });
        }
        // ตรวจสอบข้อผิดพลาดจากความขัดแย้ง
        else if (error.conflict || (error.message && error.message.includes('ขัดแย้ง'))) {
            await customAlert({
                title: '⚠️ ข้อมูลขัดแย้ง',
                message: error.message || 'พบความขัดแย้งในข้อมูลที่บันทึก',
                icon: 'error'
            });
        }
        else {
            await customAlert({
                title: 'เกิดข้อผิดพลาด',
                message: 'ไม่สามารถบันทึกข้อมูลได้: ' + error.message,
                icon: 'error'
            });
        }
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
        const colspan = type === 'stock' ? '10' : type === 'sold' ? '11' : '12';
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
        const purchaseDate = device.purchase_date || device.purchaseDate || device.import_date;
        const saleDate = device.sale_date || device.saleDate;
        const condition = device.device_condition || device.condition;

        if (type === 'stock') {
            return `
                <tr>
                    <td>${device.brand}</td>
                    <td>${device.model}</td>
                    <td>${device.color}</td>
                    <td>${device.imei}</td>
                    <td>${device.ram}/${device.rom} GB</td>
                    <td>${conditionLabels[condition] || condition}</td>
                    <td>${formatCurrency(purchasePrice)}</td>
                    <td>${formatDate(purchaseDate)}</td>
                    <td>${formatCurrency(salePrice)}</td>
                    <td>
                        <button class="action-btn btn-sell" onclick="markUsedAsSold('${device.id}')">ขาย</button>
                        <button class="action-btn btn-installment" onclick="transferUsedToInstallment('${device.id}')" style="background: #8b5cf6;">ผ่อน</button>
                        <button class="action-btn btn-remove" onclick="markUsedAsRemoved('${device.id}')">ตัด</button>
                        <button class="action-btn btn-edit" onclick="openUsedDeviceModal('${device.id}')">แก้ไข</button>
                        <button class="action-btn btn-delete" onclick="deleteUsedDevice('${device.id}')">ลบ</button>
                    </td>
                </tr>
            `;
        } else if (type === 'sold') {
            const profit = salePrice - purchasePrice;
            const profitColor = profit >= 0 ? '#10b981' : '#ef4444';
            const note = device.note || '-';
            return `
                <tr>
                    <td>${device.brand}</td>
                    <td>${device.model}</td>
                    <td>${device.color}</td>
                    <td>${device.imei}</td>
                    <td>${device.ram}/${device.rom} GB</td>
                    <td>${conditionLabels[condition] || condition}</td>
                    <td>${formatCurrency(purchasePrice)}</td>
                    <td>${formatCurrency(salePrice)}</td>
                    <td>${formatDate(saleDate)}</td>
                    <td style="color: ${profitColor}; font-weight: 600;">${formatCurrency(profit)}</td>
                    <td>${note}</td>
                    <td>
                        <button class="action-btn btn-warning" onclick="moveUsedBackToStock('${device.id}')" title="ป้องกันการกดผิด">↩ ย้ายกลับสต๊อค</button>
                        <button class="action-btn btn-edit" onclick="openUsedDeviceModal('${device.id}')">แก้ไข</button>
                        <button class="action-btn btn-delete" onclick="deleteUsedDevice('${device.id}')">ลบ</button>
                    </td>
                </tr>
            `;
        } else {
            // Removed tab
            const profit = salePrice - purchasePrice;
            const profitColor = profit >= 0 ? '#10b981' : '#ef4444';
            return `
                <tr>
                    <td>${device.brand}</td>
                    <td>${device.model}</td>
                    <td>${device.color}</td>
                    <td>${device.imei}</td>
                    <td>${device.ram}/${device.rom} GB</td>
                    <td>${conditionLabels[condition] || condition}</td>
                    <td>${formatCurrency(purchasePrice)}</td>
                    <td>${formatCurrency(salePrice)}</td>
                    <td>${formatDate(saleDate)}</td>
                    <td style="color: ${profitColor}; font-weight: 600;">${formatCurrency(profit)}</td>
                    <td>${device.note || '-'}</td>
                    <td>
                        <button class="action-btn btn-warning" onclick="moveUsedBackToStock('${device.id}')" title="ป้องกันการกดผิด">↩ ย้ายกลับสต๊อค</button>
                        <button class="action-btn btn-edit" onclick="openUsedDeviceModal('${device.id}')">แก้ไข</button>
                        <button class="action-btn btn-delete" onclick="deleteUsedDevice('${device.id}')">ลบ</button>
                    </td>
                </tr>
            `;
        }
    }).join('');
}

// Mark used device as sold - Open confirmation modal (เหมือนเครื่องใหม่)
async function markUsedAsSold(deviceId) {
    try {
        // ดึงข้อมูลเครื่อง
        const device = await API.get(`${API_ENDPOINTS.usedDevices}/${deviceId}`);
        if (!device) {
            await customAlert({
                title: 'ไม่พบข้อมูล',
                message: 'ไม่พบข้อมูลเครื่อง',
                icon: 'error',
                confirmType: 'danger'
            });
            return;
        }

        // เก็บข้อมูลเครื่องไว้ใช้
        window.currentSaleDevice = device;
        window.currentSaleDeviceType = 'used'; // ระบุว่าเป็นเครื่องมือสอง

        // แสดงข้อมูลใน Modal (ใช้ Modal เดียวกับเครื่องใหม่)
        const deviceInfo = `${device.brand} ${device.model} (${device.color})`;
        const purchasePrice = parseFloat(device.purchase_price || device.purchasePrice || 0);
        const originalSalePrice = parseFloat(device.sale_price || device.salePrice || 0);

        document.getElementById('saleDeviceInfo').textContent = deviceInfo;
        document.getElementById('salePurchasePrice').textContent = formatCurrency(purchasePrice);
        document.getElementById('saleOriginalPrice').textContent = formatCurrency(originalSalePrice);
        document.getElementById('actualSalePrice').value = originalSalePrice;
        document.getElementById('saleDeviceId').value = deviceId;
        
        // ตั้งค่าวันที่เป็นวันปัจจุบัน
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('saleDateInput').value = today;

        // คำนวณกำไรเริ่มต้น
        updateSaleProfit(originalSalePrice, purchasePrice);

        // เพิ่ม event listener สำหรับคำนวณกำไรแบบ real-time
        const priceInput = document.getElementById('actualSalePrice');
        priceInput.oninput = function() {
            const salePrice = parseFloat(this.value) || 0;
            updateSaleProfit(salePrice, purchasePrice);
        };

        // เปิด Modal
        document.getElementById('confirmSalePriceModal').style.display = 'block';

        } catch (error) {
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: error.message,
            icon: 'error',
            confirmType: 'danger'
        });
            console.error(error);
    }
}

// Mark used device as removed (เหมือนเครื่องใหม่)
async function markUsedAsRemoved(deviceId) {
    try {
        const device = await API.get(`${API_ENDPOINTS.usedDevices}/${deviceId}`);
        if (!device) {
            await customAlert({
                title: 'ไม่พบข้อมูล',
                message: 'ไม่พบข้อมูลเครื่อง',
                icon: 'error',
                confirmType: 'danger'
            });
            return;
        }

        // เก็บข้อมูลเครื่องไว้ใช้
        window.currentRemoveDevice = device;
        window.currentRemoveDeviceType = 'used'; // ระบุว่าเป็นเครื่องมือสอง

        // แสดงข้อมูลใน Modal
        const deviceInfo = `${device.brand} ${device.model} (${device.color})`;
        const purchasePrice = parseFloat(device.purchase_price || device.purchasePrice || 0);
        const originalSalePrice = parseFloat(device.sale_price || device.salePrice || 0);

        document.getElementById('removeDeviceInfo').textContent = deviceInfo;
        document.getElementById('removePurchasePrice').textContent = formatCurrency(purchasePrice);
        document.getElementById('removeOriginalPrice').textContent = formatCurrency(originalSalePrice);
        document.getElementById('removeDeviceId').value = deviceId;

        // แสดงชื่อร้านปลายทาง
            const otherStore = device.store === 'salaya' ? 'klongyong' : 'salaya';
            const otherStoreName = stores[otherStore];
        document.getElementById('transferStoreName').textContent = `ย้ายไป: ${otherStoreName}`;

        // แสดง Modal
        document.getElementById('confirmRemoveModal').style.display = 'block';

    } catch (error) {
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: error.message,
            icon: 'error',
            confirmType: 'danger'
        });
        console.error(error);
    }
}

// Delete used device
async function deleteUsedDevice(deviceId) {
    const confirmed = await customConfirm({
        title: 'ยืนยันการลบ',
        message: 'ต้องการลบข้อมูลนี้หรือไม่?',
        icon: 'warning',
        confirmText: 'ลบ',
        cancelText: 'ยกเลิก',
        confirmType: 'danger',
        list: [
            { icon: 'warning', iconSymbol: '⚠️', text: 'ไม่สามารถกู้คืนได้' },
            { icon: 'info', iconSymbol: 'ℹ️', text: 'ข้อมูลจะถูกลบออกจากระบบถาวร' }
        ]
    });

    if (confirmed) {
        try {
            await API.delete(`${API_ENDPOINTS.usedDevices}/${deviceId}`);
            
            await customAlert({
                title: 'สำเร็จ',
                message: 'ลบข้อมูลสำเร็จ',
                icon: 'success',
                confirmType: 'success'
            });
            
            await applyUsedDevicesFilter();
        } catch (error) {
            await customAlert({
                title: 'เกิดข้อผิดพลาด',
                message: error.message,
                icon: 'error',
                confirmType: 'danger'
            });
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

// Note: Reset function removed - now using MySQL API instead of localStorage mock data

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

// ========================================
// EXCEL EXPORT FUNCTIONS
// ========================================

/**
 * Export stock data to Excel file
 * @param {string} type - Type of data: 'new-devices', 'used-devices', 'accessories', 'equipment'
 * @param {Array} stockData - Array of stock items
 * @param {string} storeName - Store name for filename
 */
async function exportStockToExcel(type, stockData, storeName = '') {
    try {
        if (!stockData || stockData.length === 0) {
            showNotification('ไม่มีข้อมูลสต็อคให้ export', 'warning');
            return;
        }

        // Prepare data based on type
        let worksheetData = [];
        let fileName = '';
        let sheetName = '';

        const today = new Date().toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        switch (type) {
            case 'new-devices':
                fileName = `สต็อคเครื่องใหม่_${storeName}_${new Date().toISOString().split('T')[0]}.xlsx`;
                sheetName = 'เครื่องใหม่';

                // Header row
                worksheetData.push([
                    `รายงานสต็อคเครื่องใหม่ - ${storeName}`,
                    '', '', '', '', '', '', '', ''
                ]);
                worksheetData.push([`วันที่: ${today}`, '', '', '', '', '', '', '', '']);
                worksheetData.push([]); // Empty row

                // Column headers
                worksheetData.push([
                    'ยี่ห้อ', 'รุ่น', 'สี', 'IMEI', 'RAM', 'ROM',
                    'ซื้อจาก', 'หมวดเครื่อง', 'ราคาซื้อ', 'ราคาขาย',
                    'วันที่นำเข้า', 'หมายเหตุ'
                ]);

                // Data rows
                stockData.forEach(item => {
                    worksheetData.push([
                        item.brand || '',
                        item.model || '',
                        item.color || '',
                        item.imei || '',
                        item.ram || '',
                        item.rom || '',
                        item.purchased_from || '',
                        item.device_category || '',
                        parseFloat(item.purchase_price) || 0,
                        parseFloat(item.sale_price) || 0,
                        item.import_date || '',
                        item.note || ''
                    ]);
                });

                // Summary rows
                worksheetData.push([]); // Empty row
                const totalPurchase = stockData.reduce((sum, item) => sum + (parseFloat(item.purchase_price) || 0), 0);
                const totalSale = stockData.reduce((sum, item) => sum + (parseFloat(item.sale_price) || 0), 0);

                worksheetData.push(['สรุปยอดรวม', '', '', '', '', '', '', '', '', '', '', '']);
                worksheetData.push(['จำนวนเครื่องทั้งหมด:', stockData.length, 'เครื่อง', '', '', '', '', '', '', '', '', '']);
                worksheetData.push(['มูลค่าซื้อรวม:', totalPurchase.toLocaleString(), 'บาท', '', '', '', '', '', '', '', '', '']);
                worksheetData.push(['มูลค่าขายรวม:', totalSale.toLocaleString(), 'บาท', '', '', '', '', '', '', '', '', '']);
                break;

            case 'used-devices':
                fileName = `สต็อคเครื่องมือสอง_${storeName}_${new Date().toISOString().split('T')[0]}.xlsx`;
                sheetName = 'เครื่องมือสอง';

                worksheetData.push([
                    `รายงานสต็อคเครื่องมือสอง - ${storeName}`,
                    '', '', '', '', '', '', '', '', ''
                ]);
                worksheetData.push([`วันที่: ${today}`, '', '', '', '', '', '', '', '', '']);
                worksheetData.push([]);

                worksheetData.push([
                    'ยี่ห้อ', 'รุ่น', 'สี', 'IMEI', 'RAM', 'ROM',
                    'สภาพเครื่อง', 'ซื้อจาก', 'หมวดเครื่อง', 'ราคาซื้อ',
                    'ราคาขาย', 'วันที่นำเข้า', 'หมายเหตุ'
                ]);

                stockData.forEach(item => {
                    worksheetData.push([
                        item.brand || '',
                        item.model || '',
                        item.color || '',
                        item.imei || '',
                        item.ram || '',
                        item.rom || '',
                        item.device_condition || item.condition || '',
                        item.purchased_from || '',
                        item.device_category || '',
                        parseFloat(item.purchase_price) || 0,
                        parseFloat(item.sale_price) || 0,
                        item.import_date || '',
                        item.note || ''
                    ]);
                });

                worksheetData.push([]);
                const totalPurchaseUsed = stockData.reduce((sum, item) => sum + (parseFloat(item.purchase_price) || 0), 0);
                const totalSaleUsed = stockData.reduce((sum, item) => sum + (parseFloat(item.sale_price) || 0), 0);

                worksheetData.push(['สรุปยอดรวม', '', '', '', '', '', '', '', '', '', '', '', '']);
                worksheetData.push(['จำนวนเครื่องทั้งหมด:', stockData.length, 'เครื่อง', '', '', '', '', '', '', '', '', '', '']);
                worksheetData.push(['มูลค่าซื้อรวม:', totalPurchaseUsed.toLocaleString(), 'บาท', '', '', '', '', '', '', '', '', '', '']);
                worksheetData.push(['มูลค่าขายรวม:', totalSaleUsed.toLocaleString(), 'บาท', '', '', '', '', '', '', '', '', '', '']);
                break;

            case 'accessories':
                fileName = `สต็อคอะไหล่_${storeName}_${new Date().toISOString().split('T')[0]}.xlsx`;
                sheetName = 'อะไหล่';

                worksheetData.push([
                    `รายงานสต็อคอะไหล่ - ${storeName}`,
                    '', '', '', '', ''
                ]);
                worksheetData.push([`วันที่: ${today}`, '', '', '', '', '']);
                worksheetData.push([]);

                worksheetData.push([
                    'รหัสสินค้า', 'ชื่ออะไหล่', 'ประเภท', 'จำนวน',
                    'ราคาซื้อ', 'ราคาขาย', 'หมายเหตุ'
                ]);

                stockData.forEach(item => {
                    worksheetData.push([
                        item.id || item.code || '',
                        item.name || '',
                        item.category || item.type || '',
                        item.quantity || 0,
                        parseFloat(item.cost_price || item.costPrice) || 0,
                        parseFloat(item.sale_price || item.salePrice) || 0,
                        item.note || ''
                    ]);
                });

                worksheetData.push([]);
                const totalQty = stockData.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
                const totalValue = stockData.reduce((sum, item) =>
                    sum + ((parseInt(item.quantity) || 0) * (parseFloat(item.cost_price || item.costPrice) || 0)), 0
                );

                worksheetData.push(['สรุปยอดรวม', '', '', '', '', '', '']);
                worksheetData.push(['จำนวนรายการ:', stockData.length, 'รายการ', '', '', '', '']);
                worksheetData.push(['จำนวนชิ้นทั้งหมด:', totalQty, 'ชิ้น', '', '', '', '']);
                worksheetData.push(['มูลค่ารวม:', totalValue.toLocaleString(), 'บาท', '', '', '', '']);
                break;

            case 'equipment':
                fileName = `สต็อคอุปกรณ์_${storeName}_${new Date().toISOString().split('T')[0]}.xlsx`;
                sheetName = 'อุปกรณ์';

                worksheetData.push([
                    `รายงานสต็อคอุปกรณ์ - ${storeName}`,
                    '', '', '', '', ''
                ]);
                worksheetData.push([`วันที่: ${today}`, '', '', '', '', '']);
                worksheetData.push([]);

                worksheetData.push([
                    'รหัสสินค้า', 'ชื่ออุปกรณ์', 'ประเภท', 'จำนวน',
                    'ราคาซื้อ', 'ราคาขาย', 'หมายเหตุ'
                ]);

                stockData.forEach(item => {
                    worksheetData.push([
                        item.id || item.code || '',
                        item.name || '',
                        item.category || item.type || '',
                        item.quantity || 0,
                        parseFloat(item.cost_price || item.costPrice) || 0,
                        parseFloat(item.sale_price || item.salePrice) || 0,
                        item.note || ''
                    ]);
                });

                worksheetData.push([]);
                const totalQtyEq = stockData.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
                const totalValueEq = stockData.reduce((sum, item) =>
                    sum + ((parseInt(item.quantity) || 0) * (parseFloat(item.cost_price || item.costPrice) || 0)), 0
                );

                worksheetData.push(['สรุปยอดรวม', '', '', '', '', '', '']);
                worksheetData.push(['จำนวนรายการ:', stockData.length, 'รายการ', '', '', '', '']);
                worksheetData.push(['จำนวนชิ้นทั้งหมด:', totalQtyEq, 'ชิ้น', '', '', '', '']);
                worksheetData.push(['มูลค่ารวม:', totalValueEq.toLocaleString(), 'บาท', '', '', '', '']);
                break;

            default:
                showNotification('ประเภทข้อมูลไม่ถูกต้อง', 'error');
                return;
        }

        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(worksheetData);

        // Set column widths
        const colWidths = [];
        for (let i = 0; i < 13; i++) {
            colWidths.push({ wch: 15 });
        }
        ws['!cols'] = colWidths;

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, sheetName);

        // Generate and download file
        XLSX.writeFile(wb, fileName);

        showNotification(`Export Excel สำเร็จ: ${fileName}`, 'success');
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        showNotification('เกิดข้อผิดพลาดในการ export Excel', 'error');
    }
}

// ===== EXPORT WRAPPER FUNCTIONS FOR EACH PAGE =====

// Export New Devices Stock
async function exportNewDevicesStock() {
    try {
        const storeName = currentStore === 'salaya' ? 'ศาลายา' : 'คลองโยง';

        // Fetch stock data from API
        const allDevices = await API.get(API_ENDPOINTS.newDevices, { store: currentStore });
        const stockData = allDevices.filter(device => device.status === 'stock');

        if (stockData.length === 0) {
            showNotification('ไม่มีข้อมูลสต็อคเครื่องใหม่ในร้าน' + storeName, 'warning');
            return;
        }

        await exportStockToExcel('new-devices', stockData, storeName);
    } catch (error) {
        console.error('Error exporting new devices:', error);
        showNotification('เกิดข้อผิดพลาดในการ export เครื่องใหม่', 'error');
    }
}

// Export Used Devices Stock
async function exportUsedDevicesStock() {
    try {
        const storeName = currentStore === 'salaya' ? 'ศาลายา' : 'คลองโยง';

        // Fetch stock data from API
        const allDevices = await API.get(API_ENDPOINTS.usedDevices, { store: currentStore });
        const stockData = allDevices.filter(device => device.status === 'stock');

        if (stockData.length === 0) {
            showNotification('ไม่มีข้อมูลสต็อคเครื่องมือสองในร้าน' + storeName, 'warning');
            return;
        }

        await exportStockToExcel('used-devices', stockData, storeName);
    } catch (error) {
        console.error('Error exporting used devices:', error);
        showNotification('เกิดข้อผิดพลาดในการ export เครื่องมือสอง', 'error');
    }
}

// Export Accessories Stock
async function exportAccessoriesStock() {
    try {
        const storeName = currentStore === 'salaya' ? 'ศาลายา' : 'คลองโยง';
        
        // Get current active tab
        const activeTab = currentAccessoryTab || 'battery';
        const tabNames = {
            'battery': 'แบตเตอรี่',
            'screen': 'จอ',
            'charging': 'แพชาร์ต',
            'switch': 'สวิตช์',
            'flex': 'สายแพ',
            'speaker': 'ลำโพง',
            'outofstock': 'อะไหล่หมด',
            'claim': 'ส่งเคลม'
        };

        // Fetch all accessories data
        const allAccessories = await API.get(API_ENDPOINTS.accessories, { store: currentStore });

        // Filter stock data based on active tab
        let stockData = [];
        if (activeTab === 'outofstock') {
            stockData = allAccessories.filter(item => Number(item.quantity) === 0);
        } else if (activeTab === 'claim') {
            stockData = allAccessories.filter(item => (Number(item.claim_quantity) || 0) > 0);
        } else {
            stockData = allAccessories.filter(item => 
                item.type === activeTab && Number(item.quantity) > 0
            );
        }

        if (stockData.length === 0) {
            showNotification(`ไม่มีข้อมูลอะไหล่${tabNames[activeTab] || 'ในหมวดนี้'}`, 'warning');
            return;
        }

        // Prepare export data
        const exportData = stockData.map((acc, index) => ({
            'ลำดับ': index + 1,
            'รหัส': acc.code,
            'ยี่ห้อ': acc.brand,
            'รุ่นที่ใช้ได้': acc.models || '-',
            'จำนวน': acc.quantity,
            'เคลม': acc.claim_quantity || 0,
            'ราคาทุน': acc.cost_price || 0,
            'ราคาซ่อม': acc.repair_price || 0,
            'วันที่นำเข้า': formatDate(acc.import_date),
            'หมายเหตุ': acc.note || '-',
            'ร้าน': storeName
        }));

        // Create workbook
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, `อะไหล่${tabNames[activeTab] || ''}`);

        // Set column widths
        ws['!cols'] = [
            { wch: 8 },  // ลำดับ
            { wch: 15 }, // รหัส
            { wch: 15 }, // ยี่ห้อ
            { wch: 25 }, // รุ่นที่ใช้ได้
            { wch: 10 }, // จำนวน
            { wch: 10 }, // เคลม
            { wch: 12 }, // ราคาทุน
            { wch: 12 }, // ราคาซ่อม
            { wch: 15 }, // วันที่นำเข้า
            { wch: 25 }, // หมายเหตุ
            { wch: 10 }  // ร้าน
        ];

        // Generate filename with timestamp
        const timestamp = new Date().toLocaleString('th-TH', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(/\//g, '-').replace(',', '');
        
        const filename = `อะไหล่${tabNames[activeTab] || ''}_${storeName}_${timestamp}.xlsx`;

        // Export file
        XLSX.writeFile(wb, filename);
        
        showNotification(`Export สำเร็จ: ${stockData.length} รายการ`, 'success');
    } catch (error) {
        console.error('Error exporting accessories:', error);
        showNotification('เกิดข้อผิดพลาดในการ export อะไหล่', 'error');
    }
}

// Export Equipment Stock
async function exportEquipmentStock() {
    try {
        // Fetch all equipment data
        const allEquipment = await API.get(API_ENDPOINTS.equipment);

        // Filter stock data (exclude outofstock)
        const stockData = allEquipment.filter(item =>
            item.quantity > 0 &&
            (item.status || item.category?.toLowerCase()) !== 'outofstock'
        );

        if (stockData.length === 0) {
            showNotification('ไม่มีข้อมูลสต็อคอุปกรณ์', 'warning');
            return;
        }

        await exportStockToExcel('equipment', stockData, 'อุปกรณ์');
    } catch (error) {
        console.error('Error exporting equipment:', error);
        showNotification('เกิดข้อผิดพลาดในการ export อุปกรณ์', 'error');
    }
}

// Export Pawn Stock
async function exportPawnStock() {
    try {
        const storeName = currentStore === 'salaya' ? 'ศาลายา' : 'คลองโยง';

        // Fetch all pawn data for current store
        const allPawns = await API.get(API_ENDPOINTS.pawn, { store: currentStore });

        // Filter only active pawns (ขายฝากอยู่)
        const activePawns = allPawns.filter(pawn => pawn.status === 'active');

        if (activePawns.length === 0) {
            showNotification('ไม่มีข้อมูลเครื่องขายฝากในร้าน' + storeName, 'warning');
            return;
        }

        // Prepare data for export
        const exportData = activePawns.map((pawn, index) => ({
            'ลำดับ': index + 1,
            'ชื่อลูกค้า': pawn.customer_name || pawn.customerName || '-',
            'ยี่ห้อ': pawn.brand || '-',
            'รุ่น': pawn.model || '-',
            'สี': pawn.color || '-',
            'IMEI': pawn.imei || '-',
            'RAM/ROM': `${pawn.ram || 0}/${pawn.rom || 0} GB`,
            'ยอดขายฝาก': pawn.pawn_amount || pawn.pawnAmount || 0,
            'ดอกเบี้ย (%)': pawn.interest || 0,
            'วิธีคิดดอก': pawn.interest_collection_method === 'deduct' ? 'หักดอก' : 'เก็บดอก',
            'ยอดไถ่ถอน': pawn.redemption_amount || pawn.redemptionAmount || 0,
            'วันรับเครื่อง': formatDate(pawn.receive_date || pawn.receiveDate),
            'วันครบกำหนด': formatDate(pawn.due_date || pawn.dueDate),
            'หมายเหตุ': pawn.note || '-',
            'ร้าน': storeName
        }));

        // Create workbook
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'ขายฝากอยู่');

        // Set column widths
        ws['!cols'] = [
            { wch: 8 },  // ลำดับ
            { wch: 20 }, // ชื่อลูกค้า
            { wch: 12 }, // ยี่ห้อ
            { wch: 20 }, // รุ่น
            { wch: 12 }, // สี
            { wch: 18 }, // IMEI
            { wch: 12 }, // RAM/ROM
            { wch: 12 }, // ยอดขายฝาก
            { wch: 10 }, // ดอกเบี้ย
            { wch: 12 }, // วิธีคิดดอก
            { wch: 12 }, // ยอดไถ่ถอน
            { wch: 15 }, // วันรับเครื่อง
            { wch: 15 }, // วันครบกำหนด
            { wch: 25 }, // หมายเหตุ
            { wch: 10 }  // ร้าน
        ];

        // Generate filename with timestamp
        const timestamp = new Date().toLocaleString('th-TH', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(/\//g, '-').replace(',', '');
        
        const filename = `เครื่องขายฝาก_${storeName}_${timestamp}.xlsx`;

        // Export file
        XLSX.writeFile(wb, filename);
        
        showNotification(`Export สำเร็จ: ${activePawns.length} รายการ`, 'success');
    } catch (error) {
        console.error('Error exporting pawn data:', error);
        showNotification('เกิดข้อผิดพลาดในการ export ข้อมูลขายฝาก', 'error');
    }
}

// Show used devices database statistics in console
function showUsedDatabaseStats() {
    console.log('📊 สถิติฐานข้อมูลเครื่องมือสอง');
    console.log('─────────────────────────────');

    const salayaDevices = usedDevices.filter(d => d.store === 'salaya');
    const klongyongDevices = usedDevices.filter(d => d.store === 'klongyong');

    console.log(`📍 ร้านศาลายา: ${salayaDevices.length} รายการ`);
    console.log(`   - สต๊อค: ${salayaDevices.filter(d => d.status === 'stock').length}`);
    console.log(`   - ขายแล้ว: ${salayaDevices.filter(d => d.status === 'sold').length}`);
    console.log(`   - ตัดออก: ${salayaDevices.filter(d => d.status === 'removed').length}`);

    console.log(`📍 ร้านคลองโยง: ${klongyongDevices.length} รายการ`);
    console.log(`   - สต๊อค: ${klongyongDevices.filter(d => d.status === 'stock').length}`);
    console.log(`   - ขายแล้ว: ${klongyongDevices.filter(d => d.status === 'sold').length}`);
    console.log(`   - ตัดออก: ${klongyongDevices.filter(d => d.status === 'removed').length}`);

    console.log(`\n💰 มูลค่าสต๊อคทั้งหมด: ${formatCurrency(
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

// ==================== INSTALLMENT DETAILS FUNCTIONS ====================

// Show installment details
async function showInstallmentDetails(type) {
    const section = document.getElementById('installmentDetailsSection');
    const content = document.getElementById('installmentDetailsContent');
    const pagination = document.getElementById('installmentDetailsPagination');

    if (!section || !content) return;

    content.innerHTML = '<div class="loading">กำลังโหลดข้อมูล...</div>';
    section.style.display = 'block';
    section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    try {
        const items = await getInstallmentItems();
        displayInstallmentDetailsItems(items);
    } catch (error) {
        content.innerHTML = '<div class="error">เกิดข้อผิดพลาดในการโหลดข้อมูลรายการผ่อน</div>';
        console.error('Error loading installment details:', error);
    }
}

// Get installment items (completed in current month)
async function getInstallmentItems() {
    // Use global currentStore and currentMonth variables
    const [currentYear, currentMonthNum] = currentMonth.split('-');

    let items = [];

    try {
        const installmentDevices = await API.get(API_ENDPOINTS.installment, { store: currentStore });

        items = installmentDevices
            .filter(i => i.status === 'completed' && (i.completed_date || i.completedDate))
            .filter(i => {
                const completedDate = new Date(i.completed_date || i.completedDate);
                return completedDate.getFullYear().toString() === currentYear &&
                       (completedDate.getMonth() + 1).toString().padStart(2, '0') === currentMonthNum;
            })
            .map(i => {
                const salePrice = parseFloat(i.sale_price || i.salePrice) || 0;
                const commission = parseFloat(i.commission) || 0;
                const installmentType = i.installment_type || i.installmentType || 'partner';

                // Calculate total income based on type
                const totalIncome = installmentType === 'partner' ? salePrice + commission : salePrice;

                return {
                    id: i.id,
                    date: i.completed_date || i.completedDate,
                    customer: i.customer_name || i.customerName || '-',
                    device: `${i.brand} ${i.model}`,
                    installmentType: installmentType,
                    salePrice: salePrice,
                    commission: commission,
                    totalIncome: totalIncome
                };
            });
    } catch (error) {
        console.error('Error loading installment items:', error);
    }

    items.sort((a, b) => new Date(b.date) - new Date(a.date));
    return items;
}

// Display installment details items
function displayInstallmentDetailsItems(items) {
    const content = document.getElementById('installmentDetailsContent');
    const pagination = document.getElementById('installmentDetailsPagination');

    if (!content) return;

    if (items.length === 0) {
        content.innerHTML = '<div class="no-data">ไม่มีรายการผ่อนที่ชำระครบในเดือนนี้</div>';
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
    html += '<th>ประเภท</th>';
    html += '<th>ยอดจัด</th>';
    html += '<th>ค่าคอม</th>';
    html += '<th>รายรับรวม</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';

    items.forEach(item => {
        const typeText = item.installmentType === 'store' ? 'ร้าน' : 'Partner';
        const typeBadge = item.installmentType === 'store' ?
            '<span class="badge badge-success">ร้าน</span>' :
            '<span class="badge badge-primary">Partner</span>';

        html += '<tr>';
        html += `<td>${formatDate(item.date)}</td>`;
        html += `<td>${item.customer}</td>`;
        html += `<td>${item.device}</td>`;
        html += `<td>${typeBadge}</td>`;
        html += `<td>${formatCurrency(item.salePrice)}</td>`;
        html += `<td>${item.installmentType === 'partner' ? formatCurrency(item.commission) : '-'}</td>`;
        html += `<td class="income"><strong>${formatCurrency(item.totalIncome)}</strong></td>`;
        html += '</tr>';
    });

    html += '</tbody>';
    html += '<tfoot>';
    html += '<tr style="background: #f0fdf4; font-weight: bold;">';
    html += '<td colspan="6" style="text-align: right;">รวมรายรับ:</td>';
    const totalIncome = items.reduce((sum, item) => sum + item.totalIncome, 0);
    html += `<td class="income"><strong>${formatCurrency(totalIncome)}</strong></td>`;
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

// Initialize repair devices database
async function initializeRepairDatabase() {
    try {
        // โหลดข้อมูลจาก API แทน localStorage
        repairDevices = await API.get(API_ENDPOINTS.repairs, { store: currentStore });
        console.log('✅ โหลดข้อมูลเครื่องซ่อมจาก API สำเร็จ');
        console.log(`📊 มีข้อมูลทั้งหมด ${repairDevices.length} รายการ`);
        loadRepairData();
    } catch (error) {
        console.error('Error loading repairs from API:', error);
        repairDevices = [];
        // Update dashboard cards with empty data
        updateRepairDashboardCards([]);
    }
}

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
                document.getElementById('repairNote').value = repair.note || ''; // เพิ่ม note field
            }
        } catch (error) {
            console.error('Error loading repair:', error);
            await customAlert({
                title: 'เกิดข้อผิดพลาด',
                message: 'ไม่สามารถโหลดข้อมูลได้',
                icon: 'error',
                confirmType: 'danger'
            });
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
        note: formData.get('note') || null,
        store: currentStore
    };

    console.log('💾 Saving repair:', repairData);

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
            const result = await API.post(API_ENDPOINTS.repairs, repairData);
            console.log('✅ Repair saved:', result);
            showNotification('เพิ่มรายการซ่อมสำเร็จ');
        }

        loadRepairData();
        closeRepairModal();
    } catch (error) {
        console.error('❌ Error saving repair:', error);
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: error.message || 'ไม่สามารถบันทึกข้อมูลได้',
            icon: 'error',
            confirmType: 'danger'
        });
    }
}

// Load and display repair data
function loadRepairData() {
    // Apply current filter using date range
    filterRepairByDateRange();
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
            // in-repair (ส่งซ่อม): มีปุ่มซ่อมเสร็จ + คืนเครื่อง + กลับไปรอซ่อม
            // completed (ซ่อมเสร็จ): มีปุ่มรับเครื่อง + ยึดเครื่อง + กลับไปรอซ่อม
            let actionButtons = '';
            if (type === 'pending') {
                actionButtons = `<button class="action-btn btn-info" onclick="markAsInRepair('${repair.id}')">ส่งซ่อม</button>
                                <button class="action-btn btn-primary" onclick="markAsCompleted('${repair.id}')">ซ่อมเสร็จ</button>
                                <button class="action-btn btn-warning" onclick="markAsReturned('${repair.id}')">คืนเครื่อง</button>`;
            } else if (type === 'in-repair') {
                actionButtons = `<button class="action-btn btn-primary" onclick="markAsCompleted('${repair.id}')">ซ่อมเสร็จ</button>
                                <button class="action-btn btn-warning" onclick="markAsReturned('${repair.id}')">คืนเครื่อง</button>
                                <button class="action-btn btn-secondary" onclick="markAsPending('${repair.id}')">กลับไปรอซ่อม</button>`;
            } else if (type === 'completed') {
                actionButtons = `<button class="action-btn btn-success" onclick="markAsReceived('${repair.id}')">รับเครื่อง</button>
                                <button class="action-btn btn-danger" onclick="seizeRepair('${repair.id}')">ยึดเครื่อง</button>
                                <button class="action-btn btn-secondary" onclick="markAsPending('${repair.id}')">กลับไปรอซ่อม</button>`;
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
        try {
            // ดึงข้อมูลเดิมมาก่อน
            const repair = await API.get(`${API_ENDPOINTS.repairs}/${repairId}`);
            if (!repair) {
            await customAlert({
                title: 'เกิดข้อผิดพลาด',
                message: 'ไม่พบข้อมูลเครื่องซ่อม',
                icon: 'error'
            });
                return;
            }

        // เปิด modal ส่งซ่อม
        openSendRepairModal(repair);
    } catch (error) {
        console.error('Error loading repair:', error);
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: 'ไม่สามารถโหลดข้อมูลได้: ' + error.message,
            icon: 'error'
        });
    }
}

// Open send repair modal
function openSendRepairModal(repair) {
    const modal = document.getElementById('sendRepairModal');
    const form = document.getElementById('sendRepairForm');

    // Reset form
    form.reset();

    // Set repair ID
    document.getElementById('sendRepairId').value = repair.id;

    // Set default values
    document.getElementById('sendRepairSymptom').value = repair.problem || '';
    document.getElementById('sendRepairCost').value = repair.repair_cost || 0;
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('sendRepairDate').value = today;

    // Clear other fields
    document.getElementById('sendRepairTo').value = '';
    document.getElementById('sendRepairNote').value = '';

    // Show modal
    modal.classList.add('show');
}

// Close send repair modal
function closeSendRepairModal() {
    const modal = document.getElementById('sendRepairModal');
    modal.classList.remove('show');
    document.getElementById('sendRepairForm').reset();
}

// Save send repair
async function saveSendRepair(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const repairId = formData.get('repairId');
    const sendTo = formData.get('sendTo');
    const symptom = formData.get('symptom');
    const cost = parseFloat(formData.get('cost'));
    const sendDate = formData.get('sendDate');
    const note = formData.get('note') || '';

    try {
        // ดึงข้อมูลเดิมมาก่อน
        const repair = await API.get(`${API_ENDPOINTS.repairs}/${repairId}`);
        if (!repair) {
            await customAlert({
                title: 'เกิดข้อผิดพลาด',
                message: 'ไม่พบข้อมูลเครื่องซ่อม',
                icon: 'error'
            });
            return;
        }

        // สร้าง note ที่รวมข้อมูล "ส่งใคร" และหมายเหตุ
        let updatedNote = '';
        if (sendTo) {
            updatedNote = `ส่งไปที่: ${sendTo}`;
        }
        if (note) {
            updatedNote += (updatedNote ? '\n' : '') + note;
        }
        // ถ้ามี note เดิม ให้เพิ่มต่อ
        if (repair.note) {
            updatedNote = repair.note + (updatedNote ? '\n\n' : '') + updatedNote;
            }

            // ส่งข้อมูลครบทุกฟิลด์พร้อมอัพเดท status เป็น in-repair
            await API.put(`${API_ENDPOINTS.repairs}/${repairId}`, {
                brand: repair.brand,
                model: repair.model,
                color: repair.color,
                imei: repair.imei,
                customer_name: repair.customer_name,
                customer_phone: repair.customer_phone,
            problem: symptom, // ใช้อาการที่แก้ไข
            repair_cost: cost, // ใช้ราคาที่แก้ไข
                received_date: repair.received_date ? repair.received_date.split('T')[0] : null,
            appointment_date: sendDate, // เก็บวันที่ส่งซ่อมใน appointment_date
                completed_date: repair.completed_date ? repair.completed_date.split('T')[0] : null,
                returned_date: repair.returned_date ? repair.returned_date.split('T')[0] : null,
                seized_date: repair.seized_date ? repair.seized_date.split('T')[0] : null,
                status: 'in-repair',
            note: updatedNote || null,
                store: repair.store
            });

            loadRepairData();
        closeSendRepairModal();
            showNotification('ส่งซ่อมสำเร็จ');
        } catch (error) {
        console.error('Error saving send repair:', error);
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: error.message || 'ไม่สามารถบันทึกข้อมูลได้',
            icon: 'error',
            confirmType: 'danger'
        });
    }
}

// Mark repair as completed
async function markAsCompleted(repairId) {
        try {
            // ดึงข้อมูลเดิมมาก่อน
            const repair = await API.get(`${API_ENDPOINTS.repairs}/${repairId}`);
            if (!repair) {
            await customAlert({
                title: 'เกิดข้อผิดพลาด',
                message: 'ไม่พบข้อมูลเครื่องซ่อม',
                icon: 'error'
            });
                return;
            }

        // เปิด modal ซ่อมเสร็จ
        openCompleteRepairModal(repair);
    } catch (error) {
        console.error('Error loading repair:', error);
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: 'ไม่สามารถโหลดข้อมูลได้: ' + error.message,
            icon: 'error'
        });
    }
}

// Open complete repair modal
function openCompleteRepairModal(repair) {
    const modal = document.getElementById('completeRepairModal');
    const form = document.getElementById('completeRepairForm');

    // Reset form
    form.reset();

    // Set repair ID
    document.getElementById('completeRepairId').value = repair.id;

    // Set default values from existing repair data
    document.getElementById('completeRepairSymptom').value = repair.problem || '';
    document.getElementById('completeRepairCost').value = repair.repair_cost || 0;
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('completeRepairDate').value = today;

    // Set note if exists
    document.getElementById('completeRepairNote').value = repair.note || '';

    // Clear accessory fields
    document.getElementById('completeRepairAccessoryType').value = '';
    document.getElementById('completeRepairAccessoryCode').innerHTML = '<option value="">เลือกรายการอะไหล่</option>';
    document.getElementById('completeRepairAccessoryCost').value = '';

    // Show modal
    modal.classList.add('show');
}

// Close complete repair modal
function closeCompleteRepairModal() {
    const modal = document.getElementById('completeRepairModal');
    modal.classList.remove('show');
    document.getElementById('completeRepairForm').reset();
    // Clear accessory fields
    document.getElementById('completeRepairAccessoryType').value = '';
    document.getElementById('completeRepairAccessoryCode').innerHTML = '<option value="">เลือกรายการอะไหล่</option>';
    document.getElementById('completeRepairAccessoryCost').value = '';
}

// Update accessory info when type is selected
async function updateCompleteRepairAccessoryInfo() {
    const accessoryType = document.getElementById('completeRepairAccessoryType').value;
    const codeSelect = document.getElementById('completeRepairAccessoryCode');
    const costField = document.getElementById('completeRepairAccessoryCost');

    // Clear fields if no type selected
    if (!accessoryType) {
        codeSelect.innerHTML = '<option value="">เลือกรายการอะไหล่</option>';
        costField.value = '';
        return;
    }

    try {
        // Fetch accessories from API filtered by type and store
        const allAccessories = await API.get(API_ENDPOINTS.accessories, { store: currentStore });
        
        // Filter by type and available quantity (quantity > 0)
        const filteredAccessories = allAccessories.filter(acc => {
            return acc.type === accessoryType && 
                   (acc.quantity || 0) > 0 &&
                   acc.status !== 'claim';
        });

        // Clear and populate dropdown
        codeSelect.innerHTML = '<option value="">เลือกรายการอะไหล่</option>';
        
        if (filteredAccessories.length === 0) {
            costField.value = '';
            await customAlert({
                title: 'ไม่พบข้อมูล',
                message: `ไม่มีอะไหล่ประเภท ${getAccessoryTypeName(accessoryType)} ในสต็อค`,
                icon: 'warning'
            });
            return;
        }

        // Add options to dropdown
        filteredAccessories.forEach(acc => {
            const option = document.createElement('option');
            option.value = acc.id; // Store accessory ID
            option.textContent = `${acc.code} - ${acc.brand} ${acc.models || ''}`.trim();
            option.setAttribute('data-cost', acc.cost_price || 0);
            codeSelect.appendChild(option);
        });
        
        // Clear cost field until user selects an item
        costField.value = '';
    } catch (error) {
        console.error('Error loading accessories:', error);
        codeSelect.innerHTML = '<option value="">เลือกรายการอะไหล่</option>';
        costField.value = '';
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: 'ไม่สามารถโหลดข้อมูลอะไหล่ได้: ' + error.message,
            icon: 'error'
        });
    }
}

// Update cost when accessory is selected
function updateCompleteRepairAccessoryCost() {
    const codeSelect = document.getElementById('completeRepairAccessoryCode');
    const costField = document.getElementById('completeRepairAccessoryCost');
    
    const selectedOption = codeSelect.options[codeSelect.selectedIndex];
    if (selectedOption && selectedOption.value) {
        // ถ้าเลือกอะไหล่ -> ใส่ราคาทุนจากอะไหล่
        const cost = selectedOption.getAttribute('data-cost') || 0;
        costField.value = cost;
    }
    // ถ้าไม่เลือกอะไหล่ -> ปล่อยให้กรอกเอง (ไม่ clear ค่า)
}

// Get accessory type name in Thai
function getAccessoryTypeName(type) {
    const typeNames = {
        'battery': 'แบตเตอรี่',
        'screen': 'จอ',
        'charging': 'แพชาร์ต',
        'switch': 'สวิตช์',
        'flex': 'สายแพ',
        'speaker': 'ลำโพง'
    };
    return typeNames[type] || type;
}

// Save complete repair
async function saveCompleteRepair(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const repairId = formData.get('repairId');
    const symptom = formData.get('symptom');
    const cost = parseFloat(formData.get('cost'));
    const completeDate = formData.get('completeDate');
    const commission = parseFloat(formData.get('commission')) || 0;
    const technician = formData.get('technician') || '';
    const note = formData.get('note') || '';
    const accessoryCode = formData.get('accessoryCode');
    const accessoryCost = parseFloat(formData.get('accessoryCost')) || 0;

    console.log('🔧 Complete Repair Form Data:', {
        repairId,
        symptom,
        cost,
        accessoryCode,
        accessoryCost,
        commission,
        technician
    });

    try {
        // ดึงข้อมูลเดิมมาก่อน
        const repair = await API.get(`${API_ENDPOINTS.repairs}/${repairId}`);
        if (!repair) {
            await customAlert({
                title: 'เกิดข้อผิดพลาด',
                message: 'ไม่พบข้อมูลเครื่องซ่อม',
                icon: 'error'
            });
            return;
        }

        // ถ้ามีการเลือกอะไหล่ ให้ลดสต็อกลง 1
        if (accessoryCode) {
            try {
                // ดึงข้อมูลอะไหล่
                const accessory = await API.get(`${API_ENDPOINTS.accessories}/${accessoryCode}`);
                
                if (accessory) {
                    const totalQuantity = parseInt(accessory.quantity) || 0;
                    const claimQuantity = parseInt(accessory.claim_quantity) || 0;
                    const cutQuantity = parseInt(accessory.cut_quantity) || 0;
                    
                    // คำนวณสต็อกที่สามารถใช้ได้จริง
                    const availableQuantity = totalQuantity - claimQuantity - cutQuantity;
                    
                    // เช็คว่ามีสต็อกเหลือหรือไม่
                    if (availableQuantity <= 0) {
                        await customAlert({
                            title: 'คำเตือน',
                            message: `อะไหล่หมดสต็อก (มีทั้งหมด ${totalQuantity} แต่ส่งเคลม ${claimQuantity} และตัดแล้ว ${cutQuantity})`,
                            icon: 'warning'
                        });
                        return;
                    }
                    
                    // ลดสต็อกทั้งหมดลง 1
                    const newTotalQuantity = totalQuantity - 1;
                    
                    await API.put(`${API_ENDPOINTS.accessories}/${accessoryCode}`, {
                        type: accessory.type,
                        code: accessory.code,
                        brand: accessory.brand,
                        models: accessory.models,
                        quantity: newTotalQuantity,
                        cost_price: accessory.cost_price,
                        repair_price: accessory.repair_price,
                        import_date: accessory.import_date,
                        note: accessory.note,
                        store: accessory.store
                    });
                    
                    const newAvailable = availableQuantity - 1;
                    console.log(`✅ ลดสต็อกอะไหล่ ${accessory.code}: สต็อกคงเหลือ ${newAvailable} (จาก ${totalQuantity} เหลือ ${newTotalQuantity})`);
                    
                    // โหลดข้อมูลอะไหล่ใหม่เพื่ออัปเดตหน้าอะไหล่ (ถ้าเปิดอยู่)
                    if (typeof loadAccessoriesData === 'function') {
                        loadAccessoriesData();
                    }
                }
            } catch (accessoryError) {
                console.error('Error updating accessory stock:', accessoryError);
                // ไม่ throw error เพื่อให้บันทึกซ่อมต่อไปได้
                await customAlert({
                    title: 'คำเตือน',
                    message: 'บันทึกซ่อมสำเร็จ แต่ไม่สามารถลดสต็อกอะไหล่ได้',
                    icon: 'warning'
                });
            }
        }

        // สร้าง note ที่รวมหมายเหตุใหม่
        let updatedNote = '';
        if (note) {
            updatedNote = note;
        }
        // ถ้ามี note เดิม ให้เพิ่มต่อ
        if (repair.note && !note) {
            updatedNote = repair.note;
        } else if (repair.note && note) {
            updatedNote = repair.note + '\n\n' + note;
            }

            // ส่งข้อมูลครบทุกฟิลด์พร้อมอัพเดท status และ completed_date
            await API.put(`${API_ENDPOINTS.repairs}/${repairId}`, {
                brand: repair.brand,
                model: repair.model,
                color: repair.color,
                imei: repair.imei,
                customer_name: repair.customer_name,
                customer_phone: repair.customer_phone,
            problem: symptom, // ใช้อาการที่แก้ไข
            repair_cost: cost, // ใช้ราคาที่แก้ไข
                accessory_cost: accessoryCost, // ราคาทุนอะไหล่
                commission: commission, // ค่าคอม
                technician: technician, // คนซ่อม
                received_date: repair.received_date ? repair.received_date.split('T')[0] : null,
                appointment_date: repair.appointment_date ? repair.appointment_date.split('T')[0] : null,
            completed_date: completeDate, // ใช้วันที่ที่เลือก
                returned_date: repair.returned_date ? repair.returned_date.split('T')[0] : null,
                seized_date: repair.seized_date ? repair.seized_date.split('T')[0] : null,
                status: 'completed',
            note: updatedNote || null,
                store: repair.store
            });

            loadRepairData();
        closeCompleteRepairModal();
            showNotification('บันทึกซ่อมเสร็จสำเร็จ');
        } catch (error) {
        console.error('Error saving complete repair:', error);
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: error.message || 'ไม่สามารถบันทึกข้อมูลได้',
            icon: 'error',
            confirmType: 'danger'
        });
    }
}

// Mark repair as received
async function markAsReceived(repairId) {
        try {
            // ดึงข้อมูลเดิมมาก่อน
            const repair = await API.get(`${API_ENDPOINTS.repairs}/${repairId}`);
            if (!repair) {
            await customAlert({
                title: 'เกิดข้อผิดพลาด',
                message: 'ไม่พบข้อมูลเครื่องซ่อม',
                icon: 'error'
            });
            return;
        }

        // เปิด modal รับเครื่อง
        openReceiveRepairModal(repair);
    } catch (error) {
        console.error('Error loading repair:', error);
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: 'ไม่สามารถโหลดข้อมูลได้: ' + error.message,
            icon: 'error'
        });
    }
}

// Open receive repair modal
function openReceiveRepairModal(repair) {
    const modal = document.getElementById('receiveRepairModal');
    const form = document.getElementById('receiveRepairForm');

    // Reset form
    form.reset();

    // Set repair ID
    document.getElementById('receiveRepairId').value = repair.id;

    // Set default values from existing repair data
    document.getElementById('receiveRepairCost').value = repair.repair_cost || 0;
    
    // Set default date to completed_date if exists, otherwise today
    let defaultDate = new Date().toISOString().split('T')[0];
    if (repair.completed_date) {
        defaultDate = repair.completed_date.split('T')[0];
    }
    document.getElementById('receiveRepairDate').value = defaultDate;

    // Show modal
    modal.classList.add('show');
}

// Close receive repair modal
function closeReceiveRepairModal() {
    const modal = document.getElementById('receiveRepairModal');
    modal.classList.remove('show');
    document.getElementById('receiveRepairForm').reset();
}

// Show repair expense detail modal
async function showRepairExpenseDetail() {
    try {
        const modal = document.getElementById('repairExpenseDetailModal');
        const tableBody = document.getElementById('repairExpenseDetailTableBody');
        
        // Get all repairs
        const allRepairs = await API.get(API_ENDPOINTS.repairs, { store: currentStore });
        
        // Filter completed repairs in current month
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        
        const completedRepairs = allRepairs.filter(r => {
            if (r.status !== 'completed') return false;
            
            const completedDate = r.completed_date || r.completedDate;
            if (!completedDate) return false;
            
            const date = new Date(completedDate);
            return date.getMonth() + 1 === currentMonth && 
                   date.getFullYear() === currentYear;
        });
        
        // Calculate totals
        let totalAccessoryCost = 0;
        let totalCommission = 0;
        
        // Build table rows
        if (completedRepairs.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="8" class="text-center">ไม่มีข้อมูลรายจ่ายในเดือนนี้</td></tr>';
        } else {
            tableBody.innerHTML = completedRepairs.map(repair => {
                const accessoryCost = parseFloat(repair.accessory_cost || repair.accessoryCost || 0);
                const commission = parseFloat(repair.commission || 0);
                const total = accessoryCost + commission;
                
                totalAccessoryCost += accessoryCost;
                totalCommission += commission;
                
                const completedDate = repair.completed_date || repair.completedDate;
                const formattedDate = completedDate ? new Date(completedDate).toLocaleDateString('th-TH') : '-';
                
                return `
                    <tr>
                        <td>${repair.brand || '-'}</td>
                        <td>${repair.model || '-'}</td>
                        <td>${repair.problem || '-'}</td>
                        <td class="text-right">${formatCurrency(accessoryCost)}</td>
                        <td class="text-right">${formatCurrency(commission)}</td>
                        <td class="text-right"><strong>${formatCurrency(total)}</strong></td>
                        <td>${repair.technician || '-'}</td>
                        <td>${formattedDate}</td>
                    </tr>
                `;
            }).join('');
        }
        
        const totalExpense = totalAccessoryCost + totalCommission;
        
        // Update summary cards
        document.getElementById('totalAccessoryCost').textContent = formatCurrency(totalAccessoryCost);
        document.getElementById('totalCommission').textContent = formatCurrency(totalCommission);
        document.getElementById('totalExpense').textContent = formatCurrency(totalExpense);
        
        // Show modal
        modal.classList.add('show');
        
    } catch (error) {
        console.error('Error loading repair expense detail:', error);
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: 'ไม่สามารถโหลดข้อมูลรายจ่ายได้',
            icon: 'error'
        });
    }
}

// Close repair expense detail modal
function closeRepairExpenseDetailModal() {
    const modal = document.getElementById('repairExpenseDetailModal');
    modal.classList.remove('show');
}

// Show repair income detail modal
async function showRepairIncomeDetail() {
    try {
        const modal = document.getElementById('repairIncomeDetailModal');
        const tableBody = document.getElementById('repairIncomeDetailTableBody');
        
        // Get all repairs
        const allRepairs = await API.get(API_ENDPOINTS.repairs, { store: currentStore });
        
        // Filter received repairs
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        
        const receivedRepairs = allRepairs.filter(r => {
            if (r.status !== 'received') return false;
            
            const returnedDate = r.returned_date || r.returnedDate;
            if (!returnedDate) return false;
            
            const date = new Date(returnedDate);
            return date.getMonth() + 1 === currentMonth && 
                   date.getFullYear() === currentYear;
        });
        
        // Calculate total
        let totalIncome = 0;
        
        // Build table rows
        if (receivedRepairs.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center">ไม่มีข้อมูลรายรับในเดือนนี้</td></tr>';
        } else {
            tableBody.innerHTML = receivedRepairs.map(repair => {
                const repairCost = parseFloat(repair.repair_cost || 0);
                totalIncome += repairCost;
                
                const returnedDate = repair.returned_date || repair.returnedDate;
                const formattedDate = returnedDate ? new Date(returnedDate).toLocaleDateString('th-TH') : '-';
                
                return `
                    <tr>
                        <td>${repair.brand || '-'}</td>
                        <td>${repair.model || '-'}</td>
                        <td>${repair.problem || '-'}</td>
                        <td class="text-right"><strong>${formatCurrency(repairCost)}</strong></td>
                        <td class="text-center">${repair.technician || '-'}</td>
                        <td class="text-center">${formattedDate}</td>
                    </tr>
                `;
            }).join('');
        }
        
        // Update summary card
        document.getElementById('totalIncomeDetail').textContent = formatCurrency(totalIncome);
        
        // Show modal
        modal.classList.add('show');
        
    } catch (error) {
        console.error('Error loading repair income detail:', error);
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: 'ไม่สามารถโหลดข้อมูลรายรับได้',
            icon: 'error'
        });
    }
}

// Close repair income detail modal
function closeRepairIncomeDetailModal() {
    const modal = document.getElementById('repairIncomeDetailModal');
    modal.classList.remove('show');
}

// Show repair profit detail modal
async function showRepairProfitDetail() {
    try {
        const modal = document.getElementById('repairProfitDetailModal');
        const tableBody = document.getElementById('repairProfitDetailTableBody');
        
        // Get all repairs
        const allRepairs = await API.get(API_ENDPOINTS.repairs, { store: currentStore });
        
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        
        // Get completed repairs for expense
        const completedRepairs = allRepairs.filter(r => {
            if (r.status !== 'completed') return false;
            const completedDate = r.completed_date || r.completedDate;
            if (!completedDate) return false;
            const date = new Date(completedDate);
            return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        });
        
        // Get received repairs for income
        const receivedRepairs = allRepairs.filter(r => {
            if (r.status !== 'received') return false;
            const returnedDate = r.returned_date || r.returnedDate;
            if (!returnedDate) return false;
            const date = new Date(returnedDate);
            return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        });
        
        let totalIncome = 0;
        let totalExpense = 0;
        
        // Build table rows - combine both completed and received
        const allTransactions = [];
        
        // Add completed repairs (for expense tracking)
        completedRepairs.forEach(repair => {
            const repairCost = parseFloat(repair.repair_cost || 0);
            const accessoryCost = parseFloat(repair.accessory_cost || repair.accessoryCost || 0);
            const commission = parseFloat(repair.commission || 0);
            const expense = accessoryCost + commission;
            const completedDate = repair.completed_date || repair.completedDate;
            
            totalExpense += expense;
            
            allTransactions.push({
                ...repair,
                income: 0,
                expense: expense,
                profit: -expense,
                date: completedDate,
                type: 'expense'
            });
        });
        
        // Add received repairs (for income tracking)
        receivedRepairs.forEach(repair => {
            const repairCost = parseFloat(repair.repair_cost || 0);
            const returnedDate = repair.returned_date || repair.returnedDate;
            
            totalIncome += repairCost;
            
            // Check if this repair also has expense
            const hasExpense = completedRepairs.find(r => r.id === repair.id);
            const accessoryCost = hasExpense ? parseFloat(hasExpense.accessory_cost || hasExpense.accessoryCost || 0) : 0;
            const commission = hasExpense ? parseFloat(hasExpense.commission || 0) : 0;
            const expense = accessoryCost + commission;
            const profit = repairCost - expense;
            
            allTransactions.push({
                ...repair,
                income: repairCost,
                expense: expense,
                profit: profit,
                accessoryCost: accessoryCost,
                commission: commission,
                date: returnedDate,
                type: 'income'
            });
        });
        
        // Build table
        if (allTransactions.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="9" class="text-center">ไม่มีข้อมูลกำไรในเดือนนี้</td></tr>';
        } else {
            tableBody.innerHTML = allTransactions.map(repair => {
                const formattedDate = repair.date ? new Date(repair.date).toLocaleDateString('th-TH') : '-';
                const profitClass = repair.profit >= 0 ? 'income-text' : 'expense-text';
                
                return `
                    <tr>
                        <td>${repair.brand || '-'}</td>
                        <td>${repair.model || '-'}</td>
                        <td>${repair.problem || '-'}</td>
                        <td class="text-right">${formatCurrency(repair.income)}</td>
                        <td class="text-right">${formatCurrency(repair.accessoryCost || 0)}</td>
                        <td class="text-right">${formatCurrency(repair.commission || 0)}</td>
                        <td class="text-right">${formatCurrency(repair.expense)}</td>
                        <td class="text-right ${profitClass}"><strong>${formatCurrency(repair.profit)}</strong></td>
                        <td class="text-center">${formattedDate}</td>
                    </tr>
                `;
            }).join('');
        }
        
        const totalProfit = totalIncome - totalExpense;
        
        // Update summary cards
        document.getElementById('totalIncomeSummary').textContent = formatCurrency(totalIncome);
        document.getElementById('totalExpenseSummary').textContent = formatCurrency(totalExpense);
        document.getElementById('totalProfitDetail').textContent = formatCurrency(totalProfit);
        
        // Show modal
        modal.classList.add('show');
        
    } catch (error) {
        console.error('Error loading repair profit detail:', error);
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: 'ไม่สามารถโหลดข้อมูลกำไรได้',
            icon: 'error'
        });
    }
}

// Close repair profit detail modal
function closeRepairProfitDetailModal() {
    const modal = document.getElementById('repairProfitDetailModal');
    modal.classList.remove('show');
}

// Save receive repair
async function saveReceiveRepair(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const repairId = formData.get('repairId');
    const cost = parseFloat(formData.get('cost'));
    const receiveDate = formData.get('receiveDate');

    try {
        // ดึงข้อมูลเดิมมาก่อน
        const repair = await API.get(`${API_ENDPOINTS.repairs}/${repairId}`);
        if (!repair) {
            await customAlert({
                title: 'เกิดข้อผิดพลาด',
                message: 'ไม่พบข้อมูลเครื่องซ่อม',
                icon: 'error'
            });
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
            repair_cost: cost, // ใช้ราคาที่แก้ไข
                received_date: repair.received_date ? repair.received_date.split('T')[0] : null,
                appointment_date: repair.appointment_date ? repair.appointment_date.split('T')[0] : null,
                completed_date: repair.completed_date ? repair.completed_date.split('T')[0] : null,
            returned_date: receiveDate, // ใช้วันที่ที่เลือก
                seized_date: repair.seized_date ? repair.seized_date.split('T')[0] : null,
                status: 'received',
                note: repair.note,
                store: repair.store
            });

            loadRepairData();
        closeReceiveRepairModal();
            showNotification('บันทึกรับเครื่องสำเร็จ');
        } catch (error) {
        console.error('Error saving receive repair:', error);
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: error.message || 'ไม่สามารถบันทึกข้อมูลได้',
            icon: 'error',
            confirmType: 'danger'
        });
    }
}

// Mark repair as returned
async function markAsReturned(repairId) {
        try {
            // ดึงข้อมูลเดิมมาก่อน
            const repair = await API.get(`${API_ENDPOINTS.repairs}/${repairId}`);
            if (!repair) {
            await customAlert({
                title: 'เกิดข้อผิดพลาด',
                message: 'ไม่พบข้อมูลเครื่องซ่อม',
                icon: 'error'
            });
                return;
            }

        // เปิด modal คืนเครื่อง
        openReturnRepairModal(repair);
    } catch (error) {
        console.error('Error loading repair:', error);
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: 'ไม่สามารถโหลดข้อมูลได้: ' + error.message,
            icon: 'error'
        });
    }
}

// Open return repair modal
function openReturnRepairModal(repair) {
    const modal = document.getElementById('returnRepairModal');
    const form = document.getElementById('returnRepairForm');

    // Reset form
    form.reset();

    // Set repair ID
    document.getElementById('returnRepairId').value = repair.id;

    // Set default values from existing repair data
    document.getElementById('returnRepairSymptom').value = repair.problem || '';
    document.getElementById('returnRepairCost').value = 0; // ค่าเริ่มต้นเป็น 0
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('returnRepairDate').value = today;

    // Clear note field
    document.getElementById('returnRepairNote').value = '';

    // Show modal
    modal.classList.add('show');
}

// Close return repair modal
function closeReturnRepairModal() {
    const modal = document.getElementById('returnRepairModal');
    modal.classList.remove('show');
    document.getElementById('returnRepairForm').reset();
}

// Save return repair
async function saveReturnRepair(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const repairId = formData.get('repairId');
    const symptom = formData.get('symptom');
    const cost = parseFloat(formData.get('cost'));
    const returnDate = formData.get('returnDate');
    const note = formData.get('note') || '';

    if (!note.trim()) {
        await customAlert({
            title: 'ข้อมูลไม่ครบถ้วน',
            message: 'กรุณาระบุเหตุผลที่คืนเครื่อง',
            icon: 'warning'
        });
        return;
    }

    try {
        // ดึงข้อมูลเดิมมาก่อน
        const repair = await API.get(`${API_ENDPOINTS.repairs}/${repairId}`);
        if (!repair) {
            await customAlert({
                title: 'เกิดข้อผิดพลาด',
                message: 'ไม่พบข้อมูลเครื่องซ่อม',
                icon: 'error'
            });
            return;
        }

        // สร้าง note ที่รวมหมายเหตุใหม่
        let updatedNote = note.trim();
        // ถ้ามี note เดิม ให้เพิ่มต่อ
        if (repair.note) {
            updatedNote = repair.note + '\n\nเหตุผลที่คืนเครื่อง: ' + updatedNote;
        } else {
            updatedNote = 'เหตุผลที่คืนเครื่อง: ' + updatedNote;
            }

            // ส่งข้อมูลครบทุกฟิลด์พร้อมอัพเดท status, note และ returned_date
            await API.put(`${API_ENDPOINTS.repairs}/${repairId}`, {
                brand: repair.brand,
                model: repair.model,
                color: repair.color,
                imei: repair.imei,
                customer_name: repair.customer_name,
                customer_phone: repair.customer_phone,
            problem: symptom, // ใช้อาการที่แก้ไข
            repair_cost: cost, // ใช้ราคาที่แก้ไข
                received_date: repair.received_date ? repair.received_date.split('T')[0] : null,
                appointment_date: repair.appointment_date ? repair.appointment_date.split('T')[0] : null,
                completed_date: repair.completed_date ? repair.completed_date.split('T')[0] : null,
            returned_date: returnDate, // ใช้วันที่ที่เลือก
                seized_date: repair.seized_date ? repair.seized_date.split('T')[0] : null,
                status: 'returned',
            note: updatedNote,
                store: repair.store
            });

            loadRepairData();
        closeReturnRepairModal();
            showNotification('บันทึกคืนเครื่องสำเร็จ');
        } catch (error) {
        console.error('Error saving return repair:', error);
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: error.message || 'ไม่สามารถบันทึกข้อมูลได้',
            icon: 'error',
            confirmType: 'danger'
        });
    }
}

// Mark repair as pending (back to waiting)
async function markAsPending(repairId) {
    if (confirm('ต้องการเปลี่ยนสถานะกลับไปรอซ่อมใช่หรือไม่?')) {
        try {
            // ดึงข้อมูลเดิมมาก่อน
            const repair = await API.get(`${API_ENDPOINTS.repairs}/${repairId}`);
            if (!repair) {
                await customAlert({
                    title: 'เกิดข้อผิดพลาด',
                    message: 'ไม่พบข้อมูลเครื่องซ่อม',
                    icon: 'error'
                });
                return;
            }

            // ส่งข้อมูลครบทุกฟิลด์พร้อมอัพเดท status เป็น pending
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
                appointment_date: null, // เคลียร์ appointment_date เมื่อกลับไปรอซ่อม
                completed_date: null, // เคลียร์ completed_date เมื่อกลับไปรอซ่อม
                returned_date: repair.returned_date ? repair.returned_date.split('T')[0] : null,
                seized_date: repair.seized_date ? repair.seized_date.split('T')[0] : null,
                status: 'pending',
                note: repair.note,
                store: repair.store
            });
            loadRepairData();
            showNotification('เปลี่ยนสถานะกลับไปรอซ่อมสำเร็จ');
        } catch (error) {
            console.error('Error marking as pending:', error);
            await customAlert({
                title: 'เกิดข้อผิดพลาด',
                message: error.message || 'ไม่สามารถเปลี่ยนสถานะได้',
                icon: 'error',
                confirmType: 'danger'
            });
        }
    }
}

// Delete repair
async function deleteRepair(repairId) {
    try {
        // ดึงข้อมูลเดิมมาก่อนเพื่อแสดงในยืนยัน
        const repair = await API.get(`${API_ENDPOINTS.repairs}/${repairId}`);
        if (!repair) {
            await customAlert({
                title: 'ไม่พบข้อมูล',
                message: 'ไม่พบข้อมูลเครื่องซ่อมที่ต้องการลบ',
                icon: 'error'
            });
            return;
        }

        const confirmed = await customConfirm({
            title: 'ยืนยันการลบข้อมูล',
            message: 'คุณต้องการลบข้อมูลนี้ใช่หรือไม่? การลบจะไม่สามารถกู้คืนได้',
            icon: 'warning',
            confirmText: 'ลบ',
            cancelText: 'ยกเลิก',
            confirmType: 'danger',
            list: [
                { icon: 'info', iconSymbol: '📱', text: `${repair.brand} ${repair.model} (${repair.color})` },
                { icon: 'info', iconSymbol: '🔧', text: `อาการ: ${repair.problem || '-'}` },
                { icon: 'info', iconSymbol: '💰', text: `ราคาซ่อม: ${formatCurrency(repair.repair_cost)}` },
                { icon: 'warning', iconSymbol: '⚠️', text: 'ข้อมูลจะถูกลบถาวรจากระบบ' }
            ]
        });

        if (confirmed) {
            await API.delete(`${API_ENDPOINTS.repairs}/${repairId}`);
            loadRepairData();
            showNotification('ลบข้อมูลเครื่องซ่อมสำเร็จ', 'success');
            console.log(`✅ ลบเครื่องซ่อม ID: ${repairId}`);
        }
        } catch (error) {
        console.error('Error deleting repair:', error);
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: 'ไม่สามารถลบข้อมูลได้: ' + error.message,
            icon: 'error',
            confirmType: 'danger'
        });
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
            const problem = repair.problem || repair.symptom || '';
            return repair.brand.toLowerCase().includes(searchTerm) ||
                   repair.model.toLowerCase().includes(searchTerm) ||
                   repair.color.toLowerCase().includes(searchTerm) ||
                   (repair.imei && repair.imei.toLowerCase().includes(searchTerm)) ||
                   problem.toLowerCase().includes(searchTerm);
        });
    }

    displayRepairs(pendingRepairs, 'repairPendingTableBody', 'pending');

    let inRepairRepairs = repairDevices.filter(r => r.store === currentStore && r.status === 'in-repair');

    // Apply search filter
    if (searchTerm) {
        inRepairRepairs = inRepairRepairs.filter(repair => {
            const problem = repair.problem || repair.symptom || '';
            return repair.brand.toLowerCase().includes(searchTerm) ||
                   repair.model.toLowerCase().includes(searchTerm) ||
                   repair.color.toLowerCase().includes(searchTerm) ||
                   (repair.imei && repair.imei.toLowerCase().includes(searchTerm)) ||
                   problem.toLowerCase().includes(searchTerm);
        });
    }

    displayRepairs(inRepairRepairs, 'repairInRepairTableBody', 'in-repair');

    let completedRepairs = repairDevices.filter(r => r.store === currentStore && r.status === 'completed');

    // Apply search filter
    if (searchTerm) {
        completedRepairs = completedRepairs.filter(repair => {
            const problem = repair.problem || repair.symptom || '';
            return repair.brand.toLowerCase().includes(searchTerm) ||
                   repair.model.toLowerCase().includes(searchTerm) ||
                   repair.color.toLowerCase().includes(searchTerm) ||
                   (repair.imei && repair.imei.toLowerCase().includes(searchTerm)) ||
                   problem.toLowerCase().includes(searchTerm);
        });
    }

    displayRepairs(completedRepairs, 'repairCompletedTableBody', 'completed');

    // Returned: Filter by date and search
    let returnedRepairs = repairDevices.filter(r => r.store === currentStore && r.status === 'returned');

    // Apply date filter
    if (currentRepairFilter.month || currentRepairFilter.year) {
        returnedRepairs = returnedRepairs.filter(repair => {
            const returnDate = repair.returned_date || repair.returnDate;
            if (!returnDate) return false;
            const date = new Date(returnDate);
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
            const returnDate = repair.returned_date || repair.returnDate;
            if (!returnDate) return false;
            const date = new Date(returnDate);
            return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        });
    }

    // Apply search filter
    if (searchTerm) {
        returnedRepairs = returnedRepairs.filter(repair => {
            const problem = repair.problem || repair.symptom || '';
            return repair.brand.toLowerCase().includes(searchTerm) ||
                   repair.model.toLowerCase().includes(searchTerm) ||
                   repair.color.toLowerCase().includes(searchTerm) ||
                   (repair.imei && repair.imei.toLowerCase().includes(searchTerm)) ||
                   problem.toLowerCase().includes(searchTerm);
        });
    }

    displayRepairs(returnedRepairs, 'repairReturnedTableBody', 'returned');

    // Received: Filter by date and search
    let receivedRepairs = repairDevices.filter(r => r.store === currentStore && r.status === 'received');

    // Apply date filter
    if (currentRepairFilter.month || currentRepairFilter.year) {
        receivedRepairs = receivedRepairs.filter(repair => {
            const returnDate = repair.returned_date || repair.returnDate;
            if (!returnDate) return false;
            const date = new Date(returnDate);
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
            const returnDate = repair.returned_date || repair.returnDate;
            if (!returnDate) return false;
            const date = new Date(returnDate);
            return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        });
    }

    // Apply search filter
    if (searchTerm) {
        receivedRepairs = receivedRepairs.filter(repair => {
            const problem = repair.problem || repair.symptom || '';
            return repair.brand.toLowerCase().includes(searchTerm) ||
                   repair.model.toLowerCase().includes(searchTerm) ||
                   repair.color.toLowerCase().includes(searchTerm) ||
                   (repair.imei && repair.imei.toLowerCase().includes(searchTerm)) ||
                   problem.toLowerCase().includes(searchTerm);
        });
    }

    displayRepairs(receivedRepairs, 'repairReceivedTableBody', 'received');
}

// Initialize date filter for repair
function initializeRepairDateFilter() {
    const monthSelect = document.getElementById('filterRepairMonth');
    const yearSelect = document.getElementById('filterRepairYear');

    if (!monthSelect || !yearSelect) return;

    // Clear existing options except the first one
    while (monthSelect.options.length > 1) {
        monthSelect.remove(1);
    }
    while (yearSelect.options.length > 1) {
        yearSelect.remove(1);
    }

    // Populate months
    const thaiMonthsShort = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    for (let i = 0; i < 12; i++) {
        const option = document.createElement('option');
        option.value = i + 1;
        option.textContent = thaiMonthsShort[i];
        monthSelect.appendChild(option);
    }

    // Populate years - แก้ไข: เริ่มจากปีปัจจุบัน
    const currentYear = new Date().getFullYear(); // ค.ศ.
    const currentYearBE = currentYear + 543; // พ.ศ.
    for (let yearBE = currentYearBE; yearBE >= currentYearBE - 3; yearBE--) {
        const yearCE = yearBE - 543;
        const option = document.createElement('option');
        option.value = yearCE;
        option.textContent = yearBE;
        yearSelect.appendChild(option);
    }
}

// Filter repair by date range
async function filterRepairByDateRange() {
    const startDate = document.getElementById('filterRepairStartDate')?.value || '';
    const endDate = document.getElementById('filterRepairEndDate')?.value || '';

    currentRepairFilter.startDate = startDate;
    currentRepairFilter.endDate = endDate;

    console.log('🔍 Filtering Repair:', currentRepairFilter);

    try {
        // Get all repairs from API
        const allRepairs = await API.get(API_ENDPOINTS.repairs, { store: currentStore });

        // Update global repairDevices for use in search and other functions
        repairDevices = allRepairs;

        // Pending, In-repair, Completed: Show ALL data always (no date filter)
        const pendingRepairs = allRepairs.filter(r => r.status === 'pending');
        displayRepairs(pendingRepairs, 'repairPendingTableBody', 'pending');

        const inRepairRepairs = allRepairs.filter(r => r.status === 'in-repair');
        displayRepairs(inRepairRepairs, 'repairInRepairTableBody', 'in-repair');

        const completedRepairs = allRepairs.filter(r => r.status === 'completed');
        displayRepairs(completedRepairs, 'repairCompletedTableBody', 'completed');

        // Returned, Received, Seized: Filter by date range (default to current month if no filter)
        let returnedRepairs = allRepairs.filter(r => r.status === 'returned');
        let receivedRepairs = allRepairs.filter(r => r.status === 'received');
        let seizedRepairs = allRepairs.filter(r => r.status === 'seized');

        if (currentRepairFilter.startDate || currentRepairFilter.endDate) {
            // Use date range filter
            returnedRepairs = returnedRepairs.filter(repair => {
                const returnedDate = repair.returned_date || repair.returnedDate;
                if (!returnedDate) return false;
                const date = new Date(returnedDate);
                const startMatch = !currentRepairFilter.startDate || 
                                  date >= new Date(currentRepairFilter.startDate);
                const endMatch = !currentRepairFilter.endDate || 
                                date <= new Date(currentRepairFilter.endDate);
                return startMatch && endMatch;
            });

            receivedRepairs = receivedRepairs.filter(repair => {
                const returnedDate = repair.returned_date || repair.returnedDate;
                if (!returnedDate) return false;
                const date = new Date(returnedDate);
                const startMatch = !currentRepairFilter.startDate || 
                                  date >= new Date(currentRepairFilter.startDate);
                const endMatch = !currentRepairFilter.endDate || 
                                date <= new Date(currentRepairFilter.endDate);
                return startMatch && endMatch;
            });

            seizedRepairs = seizedRepairs.filter(repair => {
                const seizedDate = repair.seized_date || repair.seizedDate;
                if (!seizedDate) return false;
                const date = new Date(seizedDate);
                const startMatch = !currentRepairFilter.startDate || 
                                  date >= new Date(currentRepairFilter.startDate);
                const endMatch = !currentRepairFilter.endDate || 
                                date <= new Date(currentRepairFilter.endDate);
                return startMatch && endMatch;
            });
        } else {
            // No filter: show current month only
            const now = new Date();
            const currentMonth = now.getMonth() + 1;
            const currentYear = now.getFullYear();

            returnedRepairs = returnedRepairs.filter(repair => {
                const returnedDate = repair.returned_date || repair.returnedDate;
                if (!returnedDate) return false;
                const date = new Date(returnedDate);
                return date.getMonth() + 1 === currentMonth && 
                       date.getFullYear() === currentYear;
            });

            receivedRepairs = receivedRepairs.filter(repair => {
                const returnedDate = repair.returned_date || repair.returnedDate;
                if (!returnedDate) return false;
                const date = new Date(returnedDate);
                return date.getMonth() + 1 === currentMonth && 
                       date.getFullYear() === currentYear;
            });

            seizedRepairs = seizedRepairs.filter(repair => {
                const seizedDate = repair.seized_date || repair.seizedDate;
                if (!seizedDate) return false;
                const date = new Date(seizedDate);
                return date.getMonth() + 1 === currentMonth && 
                       date.getFullYear() === currentYear;
            });
        }

        displayRepairs(returnedRepairs, 'repairReturnedTableBody', 'returned');
        displayRepairs(receivedRepairs, 'repairReceivedTableBody', 'received');
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

        // Update dashboard cards
        updateRepairDashboardCards(allRepairs);
    } catch (error) {
        console.error('Error loading repairs:', error);
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    }
}

// Update repair dashboard cards
function updateRepairDashboardCards(allRepairs) {
    // Filter by current store
    const storeRepairs = allRepairs.filter(r => r.store === currentStore);

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // 1. รายการซ่อม: รวมทุกสถานะ แต่มีเงื่อนไขต่างกัน
    // - pending, in-repair, completed: นับค่าปัจจุบันทั้งหมด (ไม่กรองตามวันที่)
    const alwaysActiveRepairs = storeRepairs.filter(r => 
        r.status === 'pending' || r.status === 'in-repair' || r.status === 'completed'
    );
    
    // - returned, received, seized: นับเฉพาะเดือนปัจจุบัน
    const monthlyStatusRepairs = storeRepairs.filter(r => {
        if (r.status === 'returned') {
            const returnedDate = r.returned_date || r.returnedDate;
            if (!returnedDate) return false;
            const date = new Date(returnedDate);
            return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        } else if (r.status === 'received') {
            const returnedDate = r.returned_date || r.returnedDate;
            if (!returnedDate) return false;
            const date = new Date(returnedDate);
            return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        } else if (r.status === 'seized') {
            const seizedDate = r.seized_date || r.seizedDate;
            if (!seizedDate) return false;
            const date = new Date(seizedDate);
            return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        }
        return false;
    });
    
    const activeCount = alwaysActiveRepairs.length + monthlyStatusRepairs.length;

    // 2. รายจ่าย: ราคาทุน + ค่าคอม จากรายการที่ซ่อมเสร็จ (completed) กรองตามวันที่ซ่อมเสร็จ
    let expense = 0;
    const completedRepairsForExpense = storeRepairs.filter(r => {
        if (r.status !== 'completed') return false;
        
        const completedDate = r.completed_date || r.completedDate;
        if (!completedDate) return false;
        
        // ถ้ามี filter ให้ใช้ filter, ถ้าไม่มีให้ใช้เดือนปัจจุบัน
        if (currentRepairFilter && (currentRepairFilter.startDate || currentRepairFilter.endDate)) {
            const date = new Date(completedDate);
            const startMatch = !currentRepairFilter.startDate || date >= new Date(currentRepairFilter.startDate);
            const endMatch = !currentRepairFilter.endDate || date <= new Date(currentRepairFilter.endDate);
            return startMatch && endMatch;
        } else {
            const date = new Date(completedDate);
            return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        }
    });

    // รายจ่าย = accessory_cost + commission
    expense = completedRepairsForExpense.reduce((sum, r) => {
        const accessoryCost = parseFloat(r.accessory_cost || r.accessoryCost || 0);
        const commission = parseFloat(r.commission || 0);
        return sum + accessoryCost + commission;
    }, 0);

    // 3. รายรับ: ค่าซ่อมจากรายการที่รับเครื่อง (received) กรองตามวันที่รับเครื่อง
    let income = 0;
    const receivedRepairsForIncome = storeRepairs.filter(r => {
        if (r.status !== 'received') return false;
        
        const returnedDate = r.returned_date || r.returnedDate;
        if (!returnedDate) return false;
        
        // ถ้ามี filter ให้ใช้ filter, ถ้าไม่มีให้ใช้เดือนปัจจุบัน
        if (currentRepairFilter && (currentRepairFilter.startDate || currentRepairFilter.endDate)) {
            const date = new Date(returnedDate);
            const startMatch = !currentRepairFilter.startDate || date >= new Date(currentRepairFilter.startDate);
            const endMatch = !currentRepairFilter.endDate || date <= new Date(currentRepairFilter.endDate);
            return startMatch && endMatch;
        } else {
            const date = new Date(returnedDate);
            return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        }
    });

    // รายรับ = repair_cost (ราคาซ่อม) ของรายการที่รับเครื่องแล้ว
    income = receivedRepairsForIncome.reduce((sum, r) => {
        const cost = parseFloat(r.repair_cost || r.price || 0);
        return sum + cost;
    }, 0);

    // 4. กำไร: รายรับ - รายจ่าย
    const profit = income - expense;

    // Update UI
    const activeCountElement = document.getElementById('repairActiveCount');
    const expenseElement = document.getElementById('repairExpense');
    const incomeElement = document.getElementById('repairIncome');
    const profitElement = document.getElementById('repairProfit');

    if (activeCountElement) {
        activeCountElement.textContent = activeCount;
    }

    if (expenseElement) {
        expenseElement.textContent = formatCurrency(expense);
    }

    if (incomeElement) {
        incomeElement.textContent = formatCurrency(income);
    }

    if (profitElement) {
        profitElement.textContent = formatCurrency(profit);
        // Change color based on profit/loss
        const profitCard = profitElement.closest('.page-stat-card');
        if (profitCard) {
            profitCard.classList.remove('negative');
            if (profit < 0) {
                profitCard.classList.add('negative');
            }
        }
    }

    console.log('📊 Repair Dashboard Cards Updated:', {
        activeCount,
        breakdown: {
            alwaysActive: alwaysActiveRepairs.length,
            monthlyStatus: monthlyStatusRepairs.length
        },
        completedCount: completedRepairsForExpense.length,
        receivedCount: receivedRepairsForIncome.length,
        expense: formatCurrency(expense) + ' (ซ่อมเสร็จ: ราคาทุน + ค่าคอม)',
        income: formatCurrency(income) + ' (รับเครื่อง: ราคาซ่อม)',
        profit: formatCurrency(profit)
    });
}

// Clear repair filter
function clearRepairFilter() {
    const startDateInput = document.getElementById('filterRepairStartDate');
    const endDateInput = document.getElementById('filterRepairEndDate');
    const searchInput = document.getElementById('searchRepair');
    
    if (startDateInput) startDateInput.value = '';
    if (endDateInput) endDateInput.value = '';
    if (searchInput) searchInput.value = '';
    
    currentRepairFilter = { startDate: '', endDate: '' };
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

// Calculate next due date from down payment date (next month, same day)
function calculateNextDueDate() {
    const downPaymentDateInput = document.getElementById('downPaymentDate');
    const nextDueDateInput = document.getElementById('nextDueDate');

    if (downPaymentDateInput && downPaymentDateInput.value) {
        const downPaymentDate = new Date(downPaymentDateInput.value);
        // เปลี่ยนเป็นเดือนถัดไป วันเดียวกัน
        downPaymentDate.setMonth(downPaymentDate.getMonth() + 1);
        const nextDueDate = downPaymentDate.toISOString().split('T')[0];

        if (nextDueDateInput) {
            nextDueDateInput.value = nextDueDate;
            console.log('📅 Next due date calculated:', {
                downPayment: downPaymentDateInput.value,
                nextDue: nextDueDate,
                method: 'Next month, same day'
            });
        }
        
        // อัพเดทตารางงวดผ่อน
        updateInstallmentSchedule();
    }
}

// Update installment schedule table
function updateInstallmentSchedule() {
    const downPaymentDate = document.getElementById('downPaymentDate')?.value;
    const scheduleContainer = document.getElementById('installmentSchedule');

    // อ่านค่าตาม installment type
    let totalInstallments, installmentAmount;
    if (currentInstallmentType === 'store') {
        totalInstallments = parseInt(document.getElementById('totalInstallmentsStore')?.value) || 0;
        installmentAmount = parseFloat(document.getElementById('installmentAmountStore')?.value) || 0;
    } else {
        totalInstallments = parseInt(document.getElementById('totalInstallments')?.value) || 0;
        installmentAmount = parseFloat(document.getElementById('installmentAmount')?.value) || 0;
    }

    if (!scheduleContainer || !downPaymentDate || totalInstallments === 0) {
        if (scheduleContainer) scheduleContainer.innerHTML = '';
        return;
    }
    
    // สร้างตารางงวดผ่อน
    let scheduleHTML = '<div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">';
    scheduleHTML += '<h4 style="margin: 0 0 15px 0; color: #6366f1;">📅 ตารางการผ่อนชำระ</h4>';
    scheduleHTML += '<table style="width: 100%; border-collapse: collapse;">';
    scheduleHTML += '<thead><tr>';
    scheduleHTML += '<th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd; background: white;">งวดที่</th>';
    scheduleHTML += '<th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd; background: white;">วันครบกำหนด</th>';
    scheduleHTML += '<th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd; background: white;">ยอดชำระ</th>';
    scheduleHTML += '</tr></thead><tbody>';
    
    // คำนวณวันครบกำหนดแต่ละงวด
    const baseDate = new Date(downPaymentDate);
    for (let i = 1; i <= totalInstallments; i++) {
        const dueDate = new Date(baseDate);
        dueDate.setMonth(baseDate.getMonth() + i); // เพิ่มทีละ 1 เดือน
        
        const dueDateStr = dueDate.toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
        });
        
        scheduleHTML += '<tr style="border-bottom: 1px solid #eee;">';
        scheduleHTML += `<td style="padding: 10px; background: white;">งวดที่ ${i}</td>`;
        scheduleHTML += `<td style="padding: 10px; background: white;">${dueDateStr}</td>`;
        scheduleHTML += `<td style="padding: 10px; text-align: right; background: white; font-weight: 600; color: #10b981;">฿${installmentAmount.toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>`;
        scheduleHTML += '</tr>';
    }
    
    scheduleHTML += '</tbody></table>';
    scheduleHTML += `<div style="margin-top: 15px; padding: 10px; background: white; border-radius: 6px; display: flex; justify-content: space-between; font-weight: 600;">`;
    scheduleHTML += `<span>รวมทั้งหมด ${totalInstallments} งวด</span>`;
    scheduleHTML += `<span style="color: #6366f1;">฿${(installmentAmount * totalInstallments).toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>`;
    scheduleHTML += '</div></div>';
    
    scheduleContainer.innerHTML = scheduleHTML;
}

// Calculate commission (10% of sale price - down payment) - ปิดการใช้งาน ให้กรอกเอง
function calculateCommission() {
    // ปิดการคำนวณอัตโนมัติ ให้ผู้ใช้กรอกค่าคอมเอง
    /*
    const salePriceInput = document.getElementById('installmentSalePrice');
    const downPaymentInput = document.getElementById('downPayment');
    const commissionInput = document.getElementById('commission');

    if (salePriceInput && downPaymentInput && commissionInput && currentInstallmentType === 'partner') {
        const salePrice = parseFloat(salePriceInput.value) || 0;
        const downPayment = parseFloat(downPaymentInput.value) || 0;

        // คำนวณค่าคอม: 10% ของ (ยอดจัด - เงินดาวน์)
        const commission = (salePrice - downPayment) * 0.10;

        commissionInput.value = commission.toFixed(2);

        console.log('💰 Commission calculated:', {
            salePrice,
            downPayment,
            commission: commission.toFixed(2)
        });
    }
    */
}

// Handle installment type change
function handleInstallmentTypeChange() {
    const installmentTypeSelect = document.getElementById('installmentType');
    const selectedType = installmentTypeSelect.value;

    // Update current type
    currentInstallmentType = selectedType;

    // Show/hide rows based on type
    const partnerDownPaymentRow = document.getElementById('partnerDownPaymentRow');
    const partnerInstallmentRow = document.getElementById('partnerInstallmentRow');
    const storeDownPaymentRow = document.getElementById('storeDownPaymentRow');
    const storeLockSystemRow = document.getElementById('storeLockSystemRow');

    if (selectedType === 'partner') {
        // แสดงแถวสำหรับ Partner
        if (partnerDownPaymentRow) partnerDownPaymentRow.style.display = '';
        if (partnerInstallmentRow) partnerInstallmentRow.style.display = '';
        // ซ่อนแถวสำหรับ Store
        if (storeDownPaymentRow) storeDownPaymentRow.style.display = 'none';
        if (storeLockSystemRow) storeLockSystemRow.style.display = 'none';

        // จัดการ required attribute
        document.getElementById('downPayment').required = true;
        document.getElementById('totalInstallments').required = true;
        document.getElementById('installmentAmount').required = true;
        if (document.getElementById('downPaymentStore')) document.getElementById('downPaymentStore').required = false;
        if (document.getElementById('totalInstallmentsStore')) document.getElementById('totalInstallmentsStore').required = false;
        if (document.getElementById('installmentAmountStore')) document.getElementById('installmentAmountStore').required = false;
    } else if (selectedType === 'store') {
        // ซ่อนแถวสำหรับ Partner
        if (partnerDownPaymentRow) partnerDownPaymentRow.style.display = 'none';
        if (partnerInstallmentRow) partnerInstallmentRow.style.display = 'none';
        // แสดงแถวสำหรับ Store
        if (storeDownPaymentRow) storeDownPaymentRow.style.display = '';
        if (storeLockSystemRow) storeLockSystemRow.style.display = '';

        // จัดการ required attribute
        document.getElementById('downPayment').required = false;
        document.getElementById('totalInstallments').required = false;
        document.getElementById('installmentAmount').required = false;
        if (document.getElementById('downPaymentStore')) document.getElementById('downPaymentStore').required = true;
        if (document.getElementById('totalInstallmentsStore')) document.getElementById('totalInstallmentsStore').required = true;
        if (document.getElementById('installmentAmountStore')) document.getElementById('installmentAmountStore').required = true;
    }

    // Show/hide commission field based on type (Partner)
    const commissionGroup = document.getElementById('commissionGroup');
    if (commissionGroup) {
        commissionGroup.style.display = selectedType === 'partner' ? 'block' : 'none';
    }

    // Show/hide lock system fee field based on type (Store)
    const lockSystemFeeGroup = document.getElementById('lockSystemFeeGroup');
    if (lockSystemFeeGroup) {
        lockSystemFeeGroup.style.display = selectedType === 'store' ? 'block' : 'none';
    }

    // Update installment schedule when type changes
    updateInstallmentSchedule();

    // คำนวณค่าคอมใหม่เมื่อเปลี่ยนเป็น partner - ปิดการใช้งาน ให้กรอกค่าคอมเอง
    /*
    if (selectedType === 'partner') {
        setTimeout(() => {
            calculateCommission();
        }, 50);
    }
    */

    // Update modal title based on type
    const modalTitle = document.getElementById('installmentModalTitle');
    if (currentInstallmentEditId) {
        // Edit mode
        if (selectedType === 'store') {
            modalTitle.textContent = 'แก้ไขรายการผ่อนร้าน';
        } else {
            modalTitle.textContent = 'แก้ไขรายการผ่อน partner';
        }
    } else {
        // Add mode
        if (selectedType === 'store') {
            modalTitle.textContent = 'เพิ่มรายการผ่อนร้าน';
        } else {
            modalTitle.textContent = 'เพิ่มรายการผ่อน partner';
        }
    }

    console.log('📝 Installment type changed to:', selectedType);
}

// Open installment modal for adding/editing
function openInstallmentModal(installmentId = null, type = 'partner') {
    const modal = document.getElementById('installmentModal');
    const modalTitle = document.getElementById('installmentModalTitle');
    const form = document.getElementById('installmentForm');

    form.reset();
    currentInstallmentEditId = installmentId;
    currentInstallmentType = type;

    // Set installment type dropdown
    const installmentTypeSelect = document.getElementById('installmentType');
    if (installmentTypeSelect) {
        installmentTypeSelect.value = type;
    }

    // Show/hide rows based on type
    handleInstallmentTypeChange();

    // Add event listener for down payment date change
    const downPaymentDateInput = document.getElementById('downPaymentDate');
    if (downPaymentDateInput) {
        downPaymentDateInput.removeEventListener('change', calculateNextDueDate); // Remove old listener
        downPaymentDateInput.addEventListener('change', calculateNextDueDate); // Add new listener
    }

    // Add event listeners for commission calculation - ปิดการใช้งาน ให้กรอกค่าคอมเอง
    /*
    const salePriceInput = document.getElementById('installmentSalePrice');
    const downPaymentInput = document.getElementById('downPayment');

    if (salePriceInput) {
        salePriceInput.removeEventListener('input', calculateCommission);
        salePriceInput.addEventListener('input', calculateCommission);
    }

    if (downPaymentInput) {
        downPaymentInput.removeEventListener('input', calculateCommission);
        downPaymentInput.addEventListener('input', calculateCommission);
    }
    */

    // Add event listeners for installment schedule update (Partner)
    const totalInstallmentsInput = document.getElementById('totalInstallments');
    const installmentAmountInput = document.getElementById('installmentAmount');

    if (totalInstallmentsInput) {
        totalInstallmentsInput.removeEventListener('input', updateInstallmentSchedule);
        totalInstallmentsInput.addEventListener('input', updateInstallmentSchedule);
    }

    if (installmentAmountInput) {
        installmentAmountInput.removeEventListener('input', updateInstallmentSchedule);
        installmentAmountInput.addEventListener('input', updateInstallmentSchedule);
    }

    // Add event listeners for installment schedule update (Store)
    const totalInstallmentsStoreInput = document.getElementById('totalInstallmentsStore');
    const installmentAmountStoreInput = document.getElementById('installmentAmountStore');

    if (totalInstallmentsStoreInput) {
        totalInstallmentsStoreInput.removeEventListener('input', updateInstallmentSchedule);
        totalInstallmentsStoreInput.addEventListener('input', updateInstallmentSchedule);
    }

    if (installmentAmountStoreInput) {
        installmentAmountStoreInput.removeEventListener('input', updateInstallmentSchedule);
        installmentAmountStoreInput.addEventListener('input', updateInstallmentSchedule);
    }

    if (installmentId) {
        // Edit mode
        const installment = installmentDevices.find(i => i.id === installmentId);
        if (installment) {
            console.log('📝 Editing installment:', installment);

            // Set type from installment data
            currentInstallmentType = installment.installment_type || installment.installmentType || 'partner';

            // Set installment type dropdown
            if (installmentTypeSelect) {
                installmentTypeSelect.value = currentInstallmentType;
            }

            // Set modal title based on type
            if (currentInstallmentType === 'store') {
                modalTitle.textContent = 'แก้ไขรายการผ่อนร้าน';
            } else {
                modalTitle.textContent = 'แก้ไขรายการผ่อน partner';
            }

            // Update commission field visibility
            if (commissionGroup) {
                commissionGroup.style.display = currentInstallmentType === 'partner' ? 'block' : 'none';
            }

            // Support both snake_case (from API) and camelCase (legacy)
            document.getElementById('installmentBrand').value = installment.brand || '';
            document.getElementById('installmentModel').value = installment.model || '';
            document.getElementById('installmentColor').value = installment.color || '';
            document.getElementById('installmentImei').value = installment.imei || '';
            document.getElementById('installmentRam').value = installment.ram || '';
            document.getElementById('installmentRom').value = installment.rom || '';
            document.getElementById('customerName').value = installment.customer_name || installment.customerName || '';
            document.getElementById('customerPhone').value = installment.customer_phone || installment.customerPhone || '';
            
            // ฟิลด์ตัวเลข - แปลง string เป็น number ก่อน set
            const costPrice = parseFloat(installment.cost_price || installment.costPrice || 0);
            const salePrice = parseFloat(installment.sale_price || installment.salePrice || 0);
            const downPayment = parseFloat(installment.down_payment || installment.downPayment || 0);
            const totalInstallments = parseInt(installment.total_installments || installment.totalInstallments || 0);
            const installmentAmount = parseFloat(installment.installment_amount || installment.installmentAmount || 0);
            
            console.log('📝 Setting form values:', {
                costPrice,
                salePrice,
                downPayment,
                totalInstallments,
                installmentAmount
            });
            
            document.getElementById('costPrice').value = costPrice;
            document.getElementById('installmentSalePrice').value = salePrice;

            // Set values for both partner and store fields
            document.getElementById('downPayment').value = downPayment;
            document.getElementById('totalInstallments').value = totalInstallments;
            document.getElementById('installmentAmount').value = installmentAmount;

            if (document.getElementById('downPaymentStore')) {
                document.getElementById('downPaymentStore').value = downPayment;
            }
            if (document.getElementById('totalInstallmentsStore')) {
                document.getElementById('totalInstallmentsStore').value = totalInstallments;
            }
            if (document.getElementById('installmentAmountStore')) {
                document.getElementById('installmentAmountStore').value = installmentAmount;
            }

            // Set commission if exists (for partner)
            const commissionValue = parseFloat(installment.commission || 0);
            document.getElementById('commission').value = commissionValue;

            // Set lock system fee if exists (for store)
            const lockSystemFeeValue = parseFloat(installment.lock_system_fee || installment.lockSystemFee || 0);
            if (document.getElementById('lockSystemFeeStore')) {
                document.getElementById('lockSystemFeeStore').value = lockSystemFeeValue;
            }

            document.getElementById('downPaymentDate').value = installment.down_payment_date || installment.downPaymentDate || '';

            // Get next due date
            const nextDueDate = installment.next_payment_due_date || installment.nextPaymentDueDate || getNextDueDate(installment);
            document.getElementById('nextDueDate').value = nextDueDate;
            document.getElementById('installmentNote').value = installment.note || '';
            
            // Set finance if exists
            const financeValue = installment.finance || '';
            document.getElementById('installmentFinance').value = financeValue;
            
            console.log('📝 Finance value set:', financeValue);
            
            // คำนวณค่าคอมหลังจากโหลดข้อมูลเสร็จ (สำหรับ partner) - ปิดการใช้งาน ให้กรอกค่าคอมเอง
            /*
            if ((installment.installment_type || installment.installmentType) === 'partner') {
                setTimeout(() => {
                    calculateCommission();
                }, 100);
            }
            */
        }
    } else {
        // Add mode - set title based on type
        if (type === 'store') {
            modalTitle.textContent = 'เพิ่มรายการผ่อนร้าน';
        } else {
            modalTitle.textContent = 'เพิ่มรายการผ่อน partner';
        }

        const today = new Date().toISOString().split('T')[0];
        document.getElementById('downPaymentDate').value = today;

        // คำนวณวันครบกำหนดถัดไป (เดือนถัดไป วันเดียวกัน)
        const nextDue = new Date(today);
        nextDue.setMonth(nextDue.getMonth() + 1);
        document.getElementById('nextDueDate').value = nextDue.toISOString().split('T')[0];
    }

    modal.classList.add('show');
    
    // อัพเดทตารางงวดผ่อน
    updateInstallmentSchedule();
    
    // คำนวณค่าคอมเริ่มต้นสำหรับ partner (โหมดเพิ่มใหม่) - ปิดการใช้งาน ให้กรอกค่าคอมเอง
    /*
    if (!installmentId && type === 'partner') {
        setTimeout(() => {
            calculateCommission();
        }, 100);
    }
    */
}

// Close installment modal
function closeInstallmentModal() {
    const modal = document.getElementById('installmentModal');
    modal.classList.remove('show');
    currentInstallmentEditId = null;
    transferSourceDeviceId = null;
    transferSourceDeviceType = null;
    transferTargetStore = null;
}

// Transfer new device to installment
async function transferToInstallment(deviceId) {
    try {
        // Fetch device data from API
        const device = await API.get(`${API_ENDPOINTS.newDevices}/${deviceId}`);

    if (!device) {
        showNotification('ไม่พบข้อมูลเครื่อง', 'error');
        return;
    }

        console.log('📱 Device data:', device);

        const deviceInfo = `${device.brand} ${device.model} (${device.color}) - IMEI: ${device.imei}`;

        // ขั้นตอนที่ 1: ถามเลือกร้านที่จะผ่อน - ใช้ปุ่มเลือกร้าน
        const confirmed = await customConfirm({
            title: '🏪 เลือกร้านที่จะผ่อน',
            message: deviceInfo,
            icon: 'question',
            confirmText: '🏪 ศาลายา',
            cancelText: '🏪 คลองโยง',
            confirmType: 'primary',
            list: [
                {
                    icon: 'info',
                    iconSymbol: 'ℹ️',
                    text: 'กดปุ่ม "ศาลายา" เพื่อผ่อนที่ร้านศาลายา'
                },
                {
                    icon: 'info',
                    iconSymbol: 'ℹ️',
                    text: 'กดปุ่ม "คลองโยง" เพื่อผ่อนที่ร้านคลองโยง'
                }
            ]
        });

        // confirmed = true คือศาลายา, false คือคลองโยง, null คือยกเลิก
        if (confirmed === null) {
            return;
        }

        const selectedStore = confirmed ? 'salaya' : 'klongyong';
        const selectedStoreName = stores[selectedStore];

        // ขั้นตอนที่ 2: ให้เลือกวันที่ทำรายการ (รองรับรายการย้อนหลัง)
        const transactionDate = await promptTransactionDate();
        if (!transactionDate) {
            return; // ยกเลิก
        }

        console.log('📅 Selected transaction date:', transactionDate);

        // อัพเดทสถานะเครื่องเป็น 'sold' (ขายแล้ว) ทันที พร้อม note "ผ่อน" และบันทึก sale_date
        await API.put(`${API_ENDPOINTS.newDevices}/${deviceId}`, {
            status: 'sold',
            sale_date: transactionDate, // บันทึกวันที่ทำรายการ
            note: `ผ่อนร้าน${selectedStoreName}`
        });

        // Reload new devices data
        await applyNewDevicesFilter();

        // สร้างรายการผ่อนทันทีด้วยข้อมูลเบื้องต้น
    const today = new Date().toISOString().split('T')[0];
        const nextDueDate = new Date();
        nextDueDate.setDate(nextDueDate.getDate() + 29);
        
        const tempInstallmentData = {
            id: 'INS' + Date.now().toString(),
            brand: device.brand,
            model: device.model,
            color: device.color,
            imei: device.imei,
            ram: device.ram,
            rom: device.rom,
            customer_name: 'รอกรอกข้อมูล',
            customer_phone: '',
            cost_price: device.purchase_price || device.purchasePrice || 0,
            sale_price: device.sale_price || device.salePrice || 0,
            commission: 0,
            down_payment: 0,
            total_installments: 10,
            installment_amount: 0,
            paid_installments: 0,
            next_payment_due_date: nextDueDate.toISOString().split('T')[0],
            down_payment_date: today,
            note: `โยกมาจากเครื่องใหม่`,
            status: 'active',
            seized_date: null,
            installment_type: 'store', // default
            store: selectedStore
        };

        // บันทึกรายการผ่อนเบื้องต้น
        await API.post(API_ENDPOINTS.installments, tempInstallmentData);

        // แสดงข้อความสำเร็จ
        await customAlert({
            title: 'สำเร็จ',
            message: `โยกเครื่องไปผ่อนร้าน${selectedStoreName}สำเร็จ!\n\nกรุณาเพิ่มข้อมูลผ่อนในเมนู "รายการผ่อน"`,
            icon: 'success',
            confirmType: 'success'
        });
    } catch (error) {
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: error.message || 'ไม่สามารถโอนเครื่องไปผ่อนได้',
            icon: 'error',
            confirmType: 'danger'
        });
        console.error('Error transferring to installment:', error);
    }
}

// Transfer used device to installment (เครื่องมือสอง)
async function transferUsedToInstallment(deviceId) {
    try {
        // ดึงข้อมูลเครื่องมือสอง
        const device = await API.get(`${API_ENDPOINTS.usedDevices}/${deviceId}`);
        
        if (!device) {
            await customAlert({
                title: 'ไม่พบข้อมูล',
                message: 'ไม่พบข้อมูลเครื่องมือสอง',
                icon: 'error',
                confirmType: 'danger'
            });
            return;
        }

        const conditionLabels = {
            'excellent': 'ดีมาก',
            'good': 'ดี',
            'fair': 'ปานกลาง',
            'poor': 'พอใช้'
        };
        const condition = device.device_condition || device.deviceCondition || 'good';
        const conditionText = conditionLabels[condition] || condition;
        const deviceInfo = `${device.brand} ${device.model} (${device.color}) - IMEI: ${device.imei} - สภาพ: ${conditionText}`;

        // ขั้นตอนที่ 1: ถามเลือกร้านที่จะผ่อน - ใช้ปุ่มเลือกร้าน
        const confirmed = await customConfirm({
            title: '🏪 เลือกร้านที่จะผ่อน',
            message: deviceInfo,
            icon: 'question',
            confirmText: '🏪 ศาลายา',
            cancelText: '🏪 คลองโยง',
            confirmType: 'primary',
            list: [
                {
                    icon: 'info',
                    iconSymbol: 'ℹ️',
                    text: 'กดปุ่ม "ศาลายา" เพื่อผ่อนที่ร้านศาลายา'
                },
                {
                    icon: 'info',
                    iconSymbol: 'ℹ️',
                    text: 'กดปุ่ม "คลองโยง" เพื่อผ่อนที่ร้านคลองโยง'
                }
            ]
        });

        // confirmed = true คือศาลายา, false คือคลองโยง, null คือยกเลิก
        if (confirmed === null) {
            return;
        }

        const selectedStore = confirmed ? 'salaya' : 'klongyong';
        const selectedStoreName = stores[selectedStore];

        // ขั้นตอนที่ 2: ให้เลือกวันที่ทำรายการ (รองรับรายการย้อนหลัง)
        const transactionDate = await promptTransactionDate();
        if (!transactionDate) {
            return; // ยกเลิก
        }

        console.log('📅 Selected transaction date:', transactionDate);

        // อัพเดทสถานะเครื่องเป็น 'sold' (ขายแล้ว) ทันที พร้อม note "ผ่อน" และบันทึก sale_date
        await API.put(`${API_ENDPOINTS.usedDevices}/${deviceId}`, {
            status: 'sold',
            sale_date: transactionDate, // บันทึกวันที่ทำรายการ
            note: `ผ่อนร้าน${selectedStoreName}`
        });

        // Reload used devices data
        await applyUsedDevicesFilter();

        // สร้างรายการผ่อนทันทีด้วยข้อมูลเบื้องต้น
        const today = new Date().toISOString().split('T')[0];
        const nextDueDate = new Date();
        nextDueDate.setDate(nextDueDate.getDate() + 29);
        
        const tempInstallmentData = {
            id: 'INS' + Date.now().toString(),
            brand: device.brand,
            model: device.model,
            color: device.color,
            imei: device.imei,
            ram: device.ram,
            rom: device.rom,
            customer_name: 'รอกรอกข้อมูล',
            customer_phone: '',
            cost_price: device.purchase_price || device.purchasePrice || 0,
            sale_price: device.sale_price || device.salePrice || 0,
            commission: 0,
            down_payment: 0,
            total_installments: 10,
            installment_amount: 0,
            paid_installments: 0,
            next_payment_due_date: nextDueDate.toISOString().split('T')[0],
            down_payment_date: today,
            note: `โยกมาจากเครื่องมือสอง (สภาพ: ${conditionText})`,
            status: 'active',
            seized_date: null,
            installment_type: 'store', // default
            store: selectedStore
        };

        // บันทึกรายการผ่อนเบื้องต้น
        await API.post(API_ENDPOINTS.installments, tempInstallmentData);

        // แสดงข้อความสำเร็จ
        await customAlert({
            title: 'สำเร็จ',
            message: `โยกเครื่องไปผ่อนร้าน${selectedStoreName}สำเร็จ!\n\nกรุณาเพิ่มข้อมูลผ่อนในเมนู "รายการผ่อน"`,
            icon: 'success',
            confirmType: 'success'
        });

    } catch (error) {
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: error.message || 'ไม่สามารถโอนเครื่องไปผ่อนได้',
            icon: 'error',
            confirmType: 'danger'
        });
        console.error('Error transferring used to installment:', error);
    }
}

// Save installment (add or update)
async function saveInstallment(event) {
    console.log('🚀🚀🚀 saveInstallment FUNCTION CALLED! 🚀🚀🚀');
    console.log('Event:', event);
    event.preventDefault();

    const formData = new FormData(event.target);

    // Get installment type from dropdown
    const selectedInstallmentType = formData.get('installmentType') || currentInstallmentType || 'partner';

    // อ่านค่าจาก input fields โดยตรงเพื่อหลีกเลี่ยงปัญหา name ซ้ำกันระหว่าง modals
    const salePrice = document.getElementById('installmentSalePrice')?.value || '';
    const costPrice = document.getElementById('costPrice')?.value || '';
    const downPaymentDate = document.getElementById('downPaymentDate')?.value || '';
    const finance = document.getElementById('installmentFinance')?.value || '';

    // อ่านค่าตาม installment type
    let downPayment, totalInstallments, installmentAmount, lockSystemFee;

    if (selectedInstallmentType === 'store') {
        // สำหรับผ่อนร้าน
        downPayment = document.getElementById('downPaymentStore')?.value || '';
        totalInstallments = document.getElementById('totalInstallmentsStore')?.value || '';
        installmentAmount = document.getElementById('installmentAmountStore')?.value || '';
        lockSystemFee = document.getElementById('lockSystemFeeStore')?.value || '';
    } else {
        // สำหรับผ่อน partner
        downPayment = document.getElementById('downPayment')?.value || '';
        totalInstallments = document.getElementById('totalInstallments')?.value || '';
        installmentAmount = document.getElementById('installmentAmount')?.value || '';
        lockSystemFee = '0';
    }

    // Debug: แสดงข้อมูลทั้งหมดจาก form
    console.log('🔍 Form data direct values:');
    console.log('  - installmentType:', selectedInstallmentType);
    console.log('  - finance:', finance);
    console.log('  - salePrice:', salePrice);
    console.log('  - costPrice:', costPrice);
    console.log('  - downPayment:', downPayment);
    console.log('  - downPaymentDate:', downPaymentDate);
    console.log('  - totalInstallments:', totalInstallments);
    console.log('  - installmentAmount:', installmentAmount);
    console.log('  - lockSystemFee:', lockSystemFee);

    // คำนวณวันครบกำหนดถัดไป: เดือนถัดไป วันเดียวกัน
    const nextDueDate = new Date(downPaymentDate);
    nextDueDate.setMonth(nextDueDate.getMonth() + 1);
    const nextDueDateStr = nextDueDate.toISOString().split('T')[0];
    
    console.log('💾 Saving installment:', {
        downPaymentDate,
        nextDueDate: nextDueDateStr,
        method: 'Next month, same day'
    });

    // ดึงข้อมูลเดิมถ้าเป็นการแก้ไข เพื่อเก็บ status, seized_date และ store เดิม
    let existingStatus = 'active';
    let existingSeizedDate = null;
    let existingStore = currentStore;
    let existingPaidInstallments = 0;
    
    if (currentInstallmentEditId) {
        const existing = installmentDevices.find(i => i.id === currentInstallmentEditId);
        if (existing) {
            existingStatus = existing.status || 'active';
            existingSeizedDate = existing.seized_date || existing.seizedDate || null;
            existingStore = existing.store || currentStore;
            existingPaidInstallments = existing.paid_installments || existing.paidInstallments || 0;
        }
    }

    // สร้าง object สำหรับส่งไป API (ใช้ snake_case)
    const installmentData = {
        id: currentInstallmentEditId || ('INS' + Date.now().toString()),
        brand: formData.get('brand') || '',
        model: formData.get('model') || '',
        color: formData.get('color') || '',
        imei: formData.get('imei') || '',
        ram: formData.get('ram') || '',
        rom: formData.get('rom') || '',
        customer_name: formData.get('customerName') || '',
        customer_phone: formData.get('customerPhone') || '',
        cost_price: parseFloat(costPrice) || 0, // ใช้ค่าที่อ่านโดยตรง
        sale_price: parseFloat(salePrice) || 0, // ใช้ค่าที่อ่านโดยตรง
        lock_system_fee: parseFloat(lockSystemFee) || 0, // ค่าระบบล็อค (สำหรับผ่อนร้าน)
        commission: parseFloat(formData.get('commission')) || 0,
        down_payment: parseFloat(downPayment) || 0, // ใช้ค่าที่อ่านโดยตรง
        total_installments: parseInt(totalInstallments) || 0, // ใช้ค่าจากตัวแปร
        installment_amount: parseFloat(installmentAmount) || 0, // ใช้ค่าจากตัวแปร
        paid_installments: existingPaidInstallments,
        next_payment_due_date: nextDueDateStr,
        down_payment_date: downPaymentDate, // ใช้ค่าที่อ่านโดยตรง
        note: formData.get('note') || '',
        finance: finance, // ใช้ค่าที่อ่านโดยตรง
        status: existingStatus, // ใช้ status เดิม
        seized_date: existingSeizedDate, // ใช้ seized_date เดิม
        installment_type: selectedInstallmentType, // 'partner' or 'store' (อ่านจาก dropdown)
        store: existingStore // ใช้ store เดิม (ถูกตั้งค่าไปแล้วตอนสร้าง)
    };
    
    console.log('💾 Installment data with type:', selectedInstallmentType);
    console.log('💾 Full installment data:', installmentData);
    console.log('💾 Finance value:', installmentData.finance);
    console.log('💾 Sale price value:', installmentData.sale_price);

    try {
        let response;
        if (currentInstallmentEditId) {
            // Update existing installment
            console.log('📝 Updating installment ID:', currentInstallmentEditId);
            response = await API.put(`${API_ENDPOINTS.installments}/${currentInstallmentEditId}`, installmentData);
            console.log('✅ API PUT response:', response);
        } else {
            // Create new installment (กรณีเพิ่มจากปุ่ม + เพิ่มรายการผ่อน โดยตรง)
            response = await API.post(API_ENDPOINTS.installments, installmentData);
            console.log('✅ API POST response:', response);
        }

        // Reload data
        console.log('🔄 Reloading installment data...');
        await loadInstallmentData();

        // Close modal
        closeInstallmentModal();

        // Show success message
        showNotification(currentInstallmentEditId ? 'บันทึกข้อมูลสำเร็จ' : 'เพิ่มรายการผ่อนสำเร็จ');
    } catch (error) {
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: error.message,
            icon: 'error',
            confirmType: 'danger'
        });
        console.error(error);
    }
}

// Load and display installment data
async function loadInstallmentData() {
    try {
        console.log('🔄 Loading Installment Data for store:', currentStore);
        // โหลดข้อมูลจาก API
        installmentDevices = await API.get(API_ENDPOINTS.installments, { store: currentStore });
        
        console.log('📊 Loaded installment data:', {
            total: installmentDevices.length,
            store: currentStore,
            active: installmentDevices.filter(i => i.status === 'active').length,
            partner: installmentDevices.filter(i => (i.installment_type || i.installmentType) === 'partner').length,
            storeType: installmentDevices.filter(i => (i.installment_type || i.installmentType) === 'store').length,
            completed: installmentDevices.filter(i => i.status === 'completed').length,
            seized: installmentDevices.filter(i => i.status === 'seized').length
        });

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

        // Update dashboard cards (Row 1)
        updateInstallmentDashboardCards();

        // Update status cards (Row 2)
        updateInstallmentStatusCards();

        // Update dashboard stats
        updateDashboard();
        
        // Initialize date filter if not already initialized
        initializeInstallmentDateFilter();
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
        const installmentType = inst.installment_type || inst.installmentType || 'partner';
        const typeBadge = installmentType === 'store' ?
            '<span class="badge badge-success">ร้าน</span>' :
            '<span class="badge badge-primary">Partner</span>';
        const deviceInfo = `${inst.brand} ${inst.model} (${inst.color}) ${typeBadge}`;
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
                        <button class="action-btn btn-edit" onclick="openInstallmentModal('${inst.id}', '${installmentType}')">แก้ไข</button>
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
                        <button class="action-btn btn-edit" onclick="openInstallmentModal('${inst.id}', '${installmentType}')">แก้ไข</button>
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
                        <button class="action-btn btn-edit" onclick="openInstallmentModal('${inst.id}', '${installmentType}')">แก้ไข</button>
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

    console.log('🔢 Updating tab counts:', {
        store: currentStore,
        activeCount,
        completedCount,
        seizedCount,
        totalInStore: storeInstallments.length,
        totalAll: installmentDevices.length
    });

    // Update tab counts
    const activeCountElement = document.getElementById('installmentActiveCount');
    const completedCountElement = document.getElementById('installmentCompletedCount');
    const seizedCountElement = document.getElementById('installmentSeizedCount');

    if (activeCountElement) activeCountElement.textContent = activeCount;
    if (completedCountElement) completedCountElement.textContent = completedCount;
    if (seizedCountElement) seizedCountElement.textContent = seizedCount;
}

// Update installment status cards (Row 2)
function updateInstallmentStatusCards() {
    console.log('🔄 Updating Installment Status Cards...');
    console.log('📊 Total installmentDevices:', installmentDevices.length);
    console.log('🏪 Current Store:', currentStore);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // กรองเฉพาะร้านปัจจุบัน
    const storeInstallments = installmentDevices.filter(i => i.store === currentStore);
    console.log('🏪 Store Installments:', storeInstallments.length);
    console.log('📋 Store Installments Data:', storeInstallments);

    // 1. กำลังผ่อน - ทั้งหมดที่ status = 'active'
    const activeInstallments = storeInstallments.filter(i => i.status === 'active');
    const statusActiveCount = activeInstallments.length;
    console.log('⏳ Active Count:', statusActiveCount);

    // 2. ผ่อนปกติ - active ที่จ่ายตรงเวลา (วันครบกำหนดยังไม่ถึงหรือเท่ากับวันนี้)
    const normalInstallments = activeInstallments.filter(inst => {
        const nextDueDate = inst.next_payment_due_date || inst.nextPaymentDueDate;
        if (!nextDueDate) return true; // ถ้าไม่มีวันครบกำหนด ถือว่าปกติ
        
        const dueDate = new Date(nextDueDate);
        dueDate.setHours(0, 0, 0, 0);
        
        return dueDate >= today; // ยังไม่เลยกำหนด
    });
    const statusNormalCount = normalInstallments.length;

    // 3. ผ่อนล่าช้า - active ที่เลยกำหนดแล้ว
    const lateInstallments = activeInstallments.filter(inst => {
        const nextDueDate = inst.next_payment_due_date || inst.nextPaymentDueDate;
        if (!nextDueDate) return false; // ถ้าไม่มีวันครบกำหนด ไม่นับว่าล่าช้า
        
        const dueDate = new Date(nextDueDate);
        dueDate.setHours(0, 0, 0, 0);
        
        return dueDate < today; // เลยกำหนดแล้ว
    });
    const statusLateCount = lateInstallments.length;

    // 4. ไม่ย่อม - status = 'seized'
    const defaultedInstallments = storeInstallments.filter(i => i.status === 'seized');
    const statusDefaultedCount = defaultedInstallments.length;

    // 5. ยอดครบแล้ว - status = 'completed'
    const completedInstallments = storeInstallments.filter(i => i.status === 'completed');
    const statusCompletedCount = completedInstallments.length;

    // อัพเดทการ์ด
    const statusActiveElement = document.getElementById('installmentStatusActive');
    const statusNormalElement = document.getElementById('installmentStatusNormal');
    const statusLateElement = document.getElementById('installmentStatusLate');
    const statusDefaultedElement = document.getElementById('installmentStatusDefaulted');
    const statusCompletedElement = document.getElementById('installmentStatusCompleted');

    if (statusActiveElement) statusActiveElement.textContent = statusActiveCount;
    if (statusNormalElement) statusNormalElement.textContent = statusNormalCount;
    if (statusLateElement) statusLateElement.textContent = statusLateCount;
    if (statusDefaultedElement) statusDefaultedElement.textContent = statusDefaultedCount;
    if (statusCompletedElement) statusCompletedElement.textContent = statusCompletedCount;
    
    console.log('✅ Status Cards Updated:');
    console.log('   ⏳ กำลังผ่อน:', statusActiveCount);
    console.log('   ✅ ผ่อนปกติ:', statusNormalCount);
    console.log('   ⚠️ ผ่อนล่าช้า:', statusLateCount);
    console.log('   ❌ ไม่ผ่อน:', statusDefaultedCount);
    console.log('   📅 ยอดครบแล้ว:', statusCompletedCount);
}

// Update installment dashboard cards (Row 1)
function updateInstallmentDashboardCards() {
    // กรองเฉพาะร้านปัจจุบัน
    let storeInstallments = installmentDevices.filter(i => i.store === currentStore);
    
    // Apply date filter if exists
    if (currentInstallmentFilter.startDate || currentInstallmentFilter.endDate) {
        storeInstallments = storeInstallments.filter(i => {
            const startDate = i.start_date || i.startDate || i.down_payment_date || i.downPaymentDate;
            if (!startDate) return false;
            
            const deviceDate = new Date(startDate);
            const startMatch = !currentInstallmentFilter.startDate || 
                              deviceDate >= new Date(currentInstallmentFilter.startDate);
            const endMatch = !currentInstallmentFilter.endDate || 
                            deviceDate <= new Date(currentInstallmentFilter.endDate);
            
            return startMatch && endMatch;
        });
    }
    
    // แยกตาม installment_type
    const partnerInstallments = storeInstallments.filter(i => 
        (i.installment_type || i.installmentType) === 'partner' && 
        (i.status === 'active' || i.status === 'completed')
    );
    const storeOnlyInstallments = storeInstallments.filter(i => 
        (i.installment_type || i.installmentType) === 'store' && 
        (i.status === 'active' || i.status === 'completed')
    );
    
    // 1. จำนวนรายการผ่อน (active)
    const activeCount = storeInstallments.filter(i => i.status === 'active').length;
    
    // 2. รายจ่าย
    // Partner: รายจ่าย = 0 (ไม่ได้ซื้อเครื่องเอง)
    // ร้าน: รายจ่าย = ยอดจัด + ค่าระบบล็อค
    const expensePartner = 0; // Partner ไม่มีรายจ่าย
    const expenseStore = storeOnlyInstallments.reduce((sum, i) => {
        const salePrice = parseFloat(i.sale_price || i.salePrice) || 0;
        const lockSystemFee = parseFloat(i.lock_system_fee || i.lockSystemFee) || 0;
        return sum + salePrice + lockSystemFee;
    }, 0);
    const totalExpense = expensePartner + expenseStore;
    
    // 3. รายรับ
    // Partner: รายรับ = commission เท่านั้น
    // ร้าน: รายรับ = ค่างวดทุกงวด (ไม่รวมดาวน์)
    const incomePartner = partnerInstallments.reduce((sum, i) => {
        const commission = parseFloat(i.commission) || 0;
        return sum + commission;
    }, 0);
    const incomeStore = storeOnlyInstallments.reduce((sum, i) => {
        const totalInstallments = parseInt(i.total_installments || i.totalInstallments) || 0;
        const installmentAmount = parseFloat(i.installment_amount || i.installmentAmount) || 0;
        const totalAllInstallments = totalInstallments * installmentAmount;
        return sum + totalAllInstallments;
    }, 0);
    const totalIncome = incomePartner + incomeStore;
    
    // 4. กำไร = รายรับ - รายจ่าย
    const profit = totalIncome - totalExpense;
    
    // เก็บข้อมูลไว้ใช้ใน detail modal
    window.installmentDashboardData = {
        partner: {
            devices: partnerInstallments,
            expense: expensePartner,
            income: incomePartner,
            profit: incomePartner - expensePartner
        },
        store: {
            devices: storeOnlyInstallments,
            expense: expenseStore,
            income: incomeStore,
            profit: incomeStore - expenseStore
        }
    };
    
    // อัพเดทการ์ด
    const dashboardCountElement = document.getElementById('installmentDashboardCount');
    const expenseElement = document.getElementById('installmentExpense');
    const incomeElement = document.getElementById('installmentIncome');
    const profitElement = document.getElementById('installmentProfit');
    
    if (dashboardCountElement) dashboardCountElement.textContent = activeCount;
    if (expenseElement) expenseElement.textContent = formatCurrency(totalExpense);
    if (incomeElement) incomeElement.textContent = formatCurrency(totalIncome);
    if (profitElement) profitElement.textContent = formatCurrency(profit);
}

// Show installment expense detail
function showInstallmentExpenseDetail() {
    if (!window.installmentDashboardData) return;
    
    const { partner, store } = window.installmentDashboardData;
    
    const modal = document.getElementById('installmentExpenseDetailModal');
    const tbody = document.getElementById('installmentExpenseDetailBody');
    
    tbody.innerHTML = `
        <tr class="summary-row partner">
            <td><strong>ผ่อน Partner</strong></td>
            <td class="text-center"><strong>${partner.devices.length} รายการ</strong></td>
            <td class="text-right"><strong class="expense-text">${formatCurrency(partner.expense)}</strong></td>
        </tr>
        ${partner.devices.map(device => `
            <tr>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;${device.brand} ${device.model} - ${device.customer_name || device.customerName}</td>
                <td class="text-center">${device.imei}</td>
                <td class="text-right">${formatCurrency(0)}</td>
            </tr>
        `).join('')}
        <tr class="summary-row store">
            <td><strong>ผ่อนร้าน (ยอดจัด + ค่าล็อค)</strong></td>
            <td class="text-center"><strong>${store.devices.length} รายการ</strong></td>
            <td class="text-right"><strong class="expense-text">${formatCurrency(store.expense)}</strong></td>
        </tr>
        ${store.devices.map(device => {
            const salePrice = parseFloat(device.sale_price || device.salePrice) || 0;
            const lockFee = parseFloat(device.lock_system_fee || device.lockSystemFee) || 0;
            return `
                <tr>
                    <td>&nbsp;&nbsp;&nbsp;&nbsp;${device.brand} ${device.model} - ${device.customer_name || device.customerName}</td>
                    <td class="text-center">${device.imei}</td>
                    <td class="text-right">${formatCurrency(salePrice + lockFee)}</td>
                </tr>
            `;
        }).join('')}
        <tr class="total-row">
            <td colspan="2"><strong>รวมทั้งหมด</strong></td>
            <td class="text-right"><strong class="expense-text">${formatCurrency(partner.expense + store.expense)}</strong></td>
        </tr>
    `;
    
    modal.style.display = 'block';
}

// Show installment income detail
function showInstallmentIncomeDetail() {
    if (!window.installmentDashboardData) return;
    
    const { partner, store } = window.installmentDashboardData;
    
    const modal = document.getElementById('installmentIncomeDetailModal');
    const tbody = document.getElementById('installmentIncomeDetailBody');
    
    tbody.innerHTML = `
        <tr class="summary-row partner">
            <td><strong>ผ่อน Partner (ค่าคอม)</strong></td>
            <td class="text-center"><strong>${partner.devices.length} รายการ</strong></td>
            <td class="text-right"><strong class="income-text">${formatCurrency(partner.income)}</strong></td>
        </tr>
        ${partner.devices.map(device => `
            <tr>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;${device.brand} ${device.model} - ${device.customer_name || device.customerName}</td>
                <td class="text-center">${device.imei}</td>
                <td class="text-right">${formatCurrency(parseFloat(device.commission) || 0)}</td>
            </tr>
        `).join('')}
        <tr class="summary-row store">
            <td><strong>ผ่อนร้าน (ค่างวดทุกงวด)</strong></td>
            <td class="text-center"><strong>${store.devices.length} รายการ</strong></td>
            <td class="text-right"><strong class="income-text">${formatCurrency(store.income)}</strong></td>
        </tr>
        ${store.devices.map(device => {
            const totalInstallments = parseInt(device.total_installments || device.totalInstallments) || 0;
            const installmentAmount = parseFloat(device.installment_amount || device.installmentAmount) || 0;
            const totalAllInstallments = totalInstallments * installmentAmount;
            return `
                <tr>
                    <td>&nbsp;&nbsp;&nbsp;&nbsp;${device.brand} ${device.model} - ${device.customer_name || device.customerName}</td>
                    <td class="text-center">${device.imei}</td>
                    <td class="text-right">${formatCurrency(totalAllInstallments)}</td>
                </tr>
            `;
        }).join('')}
        <tr class="total-row">
            <td colspan="2"><strong>รวมทั้งหมด</strong></td>
            <td class="text-right"><strong class="income-text">${formatCurrency(partner.income + store.income)}</strong></td>
        </tr>
    `;
    
    modal.style.display = 'block';
}

// Close installment expense detail modal
function closeInstallmentExpenseDetailModal() {
    document.getElementById('installmentExpenseDetailModal').style.display = 'none';
}

// Close installment income detail modal
function closeInstallmentIncomeDetailModal() {
    document.getElementById('installmentIncomeDetailModal').style.display = 'none';
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

    console.log('🔧 Initializing installment date filter...', {
        monthSelect: monthSelect ? 'found' : 'NOT FOUND',
        yearSelect: yearSelect ? 'found' : 'NOT FOUND'
    });

    if (!monthSelect || !yearSelect) {
        console.error('❌ Installment date filter elements not found!');
        return;
    }

    // Clear existing options except the first one
    while (monthSelect.options.length > 1) {
        monthSelect.remove(1);
    }
    while (yearSelect.options.length > 1) {
        yearSelect.remove(1);
    }

    // Populate months
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

    // Populate years - แสดงเป็น ค.ศ.
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 5; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year; // แสดง ค.ศ.
        yearSelect.appendChild(option);
    }

    console.log('✅ Installment date filter initialized:', {
        months: monthSelect.options.length,
        years: yearSelect.options.length
    });
}

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
    const expenseDetailModal = document.getElementById('installmentExpenseDetailModal');
    const incomeDetailModal = document.getElementById('installmentIncomeDetailModal');

    if (event.target === installmentModal) {
        closeInstallmentModal();
    }
    if (event.target === paymentModal) {
        closePaymentModal();
    }
    if (event.target === historyModal) {
        closeHistoryModal();
    }
    if (event.target === expenseDetailModal) {
        closeInstallmentExpenseDetailModal();
    }
    if (event.target === incomeDetailModal) {
        closeInstallmentIncomeDetailModal();
    }
});

// ===== PAWN DEVICES (ขายฝาก) =====
// Note: Using MySQL database via API instead of localStorage mock data
// All data is loaded from server database through loadPawnData() function

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
    
    // Set default store value
    const storeSelect = document.getElementById('pawnStore');
    if (storeSelect) {
        storeSelect.value = currentStore;
    }

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

                // Fill all form fields with existing data
                if (storeSelect) {
                    storeSelect.value = pawn.store || pawn.store_id || currentStore;
                }
                document.getElementById('pawnCustomerName').value = customerName || '';
                document.getElementById('pawnBrand').value = pawn.brand || '';
                document.getElementById('pawnModel').value = pawn.model || '';
                document.getElementById('pawnColor').value = pawn.color || '';
                document.getElementById('pawnImei').value = pawn.imei || '';
                document.getElementById('pawnRam').value = pawn.ram || '';
                document.getElementById('pawnRom').value = pawn.rom || '';
                document.getElementById('pawnAmount').value = pawnAmount || 0;
                document.getElementById('pawnInterest').value = pawn.interest || 0;
                document.getElementById('pawnInterestMethod').value = pawn.interest_collection_method || pawn.interestCollectionMethod || 'not_deducted';
                document.getElementById('pawnRedemptionAmount').value = pawn.redemption_amount || pawn.redemptionAmount || 0;

                // Format dates properly - keep existing dates
                if (receiveDate) {
                    const receiveDateFormatted = receiveDate.includes('T') ? receiveDate.split('T')[0] : receiveDate;
                    document.getElementById('pawnReceiveDate').value = receiveDateFormatted;
                } else {
                    document.getElementById('pawnReceiveDate').value = '';
                }

                if (dueDate) {
                    const dueDateFormatted = dueDate.includes('T') ? dueDate.split('T')[0] : dueDate;
                    document.getElementById('pawnDueDate').value = dueDateFormatted;
                } else {
                    document.getElementById('pawnDueDate').value = '';
                }

                document.getElementById('pawnNote').value = pawn.note || '';

                console.log('✅ Loaded pawn data for edit:', {
                    id: pawn.id,
                    receiveDate: receiveDate,
                    dueDate: dueDate
                });
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
        store: formData.get('store') || currentStore
    };
    
    console.log('💾 Saving pawn data:', {
        store: pawnData.store,
        brand: pawnData.brand,
        model: pawnData.model,
        pawn_amount: pawnData.pawn_amount,
        interest: pawnData.interest,
        interest_collection_method: pawnData.interest_collection_method
    });

    try {
        if (currentPawnEditId) {
            // Update existing pawn - get current data first
            const currentPawn = await API.get(`${API_ENDPOINTS.pawn}/${currentPawnEditId}`);
            pawnData.return_date = currentPawn.return_date;
            pawnData.seized_date = currentPawn.seized_date;
            pawnData.status = currentPawn.status;

            // Keep the original store if not provided in form
            if (!formData.get('store')) {
                pawnData.store = currentPawn.store;
            }

            console.log('🔄 Updating pawn:', {
                id: currentPawnEditId,
                store: pawnData.store,
                current_store: currentPawn.store
            });

            await API.put(`${API_ENDPOINTS.pawn}/${currentPawnEditId}`, pawnData);
            showNotification('บันทึกข้อมูลสำเร็จ');
        } else {
            // Add new pawn
            pawnData.return_date = null;
            pawnData.seized_date = null;
            const newPawn = await API.post(API_ENDPOINTS.pawn, pawnData);

            // บันทึก transaction ถ้าเลือกหักดอก
            if (pawnData.interest_collection_method === 'deducted' && newPawn && newPawn.id) {
                await API.post('http://localhost:5001/api/pawn-interest', {
                    pawn_id: newPawn.id,
                    interest_amount: pawnData.interest,
                    late_fee: 0,
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

        // Check if it's a duplicate IMEI error
        if (error.duplicate || (error.message && error.message.includes('IMEI'))) {
            await customAlert({
                title: '❌ IMEI ซ้ำ',
                message: `IMEI "${pawnData.imei}" มีอยู่ในระบบแล้ว\n\nกรุณาตรวจสอบ IMEI อีกครั้ง หรือตรวจสอบว่าเครื่องนี้ถูกบันทึกไปแล้วหรือไม่`,
                icon: 'error'
            });
        } else {
            await customAlert({
                title: 'เกิดข้อผิดพลาด',
                message: 'ไม่สามารถบันทึกข้อมูลได้: ' + error.message,
                icon: 'error'
            });
        }
    }
}

// Load and display pawn data
async function loadPawnData() {
    try {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🔄 [loadPawnData] START');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // Get all pawns from API (MySQL database)
        const allPawns = await API.get(API_ENDPOINTS.pawn, { store: currentStore });
        
        console.log('✅ โหลดข้อมูลขายฝากจาก MySQL database สำเร็จ');
        console.log(`📊 มีข้อมูลทั้งหมด ${allPawns.length} รายการในร้าน ${currentStore}`);
        console.log('📦 ข้อมูลทั้งหมด:', allPawns.map(p => ({
            id: p.id,
            brand: p.brand,
            model: p.model,
            status: p.status,
            receiveDate: p.receive_date || p.receiveDate,
            returnDate: p.return_date || p.returnDate,
            seizedDate: p.seized_date || p.seizedDate
        })));

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

        console.log('📊 Default Filter Result (current month):');
        console.log(`   • Active (no filter): ${activePawns.length}`);
        console.log(`   • Returned (filtered): ${returnedPawns.length}`);
        console.log(`   • Seized (filtered): ${seizedPawns.length}`);

        // Update tab counts with filtered data (matching what's displayed)
        updatePawnTabCounts({
            active: activePawns,
            returned: returnedPawns,
            seized: seizedPawns
        });

        // Update pawn dashboard cards
        console.log('🔄 [loadPawnData] Calling updatePawnDashboard with', allPawns.length, 'pawns');
        console.log('📦 [loadPawnData] Store:', currentStore);
        await updatePawnDashboard(allPawns);
        console.log('✅ [loadPawnData] Dashboard updated');

        // Update dashboard stats
        updateDashboard();
        
        console.log('✅ [loadPawnData] COMPLETE');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } catch (error) {
        console.error('❌ [loadPawnData] Error:', error);
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
            const transferredBadge = (pawn.transferred_to_used || pawn.transferredToUsed) 
                ? '<span style="color: red; font-weight: bold; margin-left: 10px;">🔴 โยกไปมือ 2</span>' 
                : '';
            
            return `
                <tr>
                    <td>${pawn.brand}${transferredBadge}</td>
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
                        <button class="action-btn btn-success" onclick="sendPawnToUsedDevices('${pawn.id}')" ${(pawn.transferred_to_used || pawn.transferredToUsed) ? 'disabled' : ''}>ส่งไปเครื่องมือสอง</button>
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
    try {
        const pawn = await API.get(`${API_ENDPOINTS.pawn}/${pawnId}`);
        if (!pawn) {
            alert('ไม่พบข้อมูลเครื่องขายฝาก');
            return;
        }

        // คำนวณวันครบกำหนดใหม่ (เพิ่ม 14 วัน)
        const dueDate = pawn.due_date || pawn.dueDate;
        const currentDueDate = new Date(dueDate);
        currentDueDate.setDate(currentDueDate.getDate() + 14);
        const newDueDate = currentDueDate.toISOString().split('T')[0];

        // ตรวจสอบว่าเลยกำหนดหรือไม่
        const today = new Date();
        today.setHours(0, 0, 0, 0); // reset เวลาเป็น 00:00:00
        const dueDateObj = new Date(dueDate);
        dueDateObj.setHours(0, 0, 0, 0);
        const isOverdue = today > dueDateObj;

        // เปิด modal
        openRenewPawnModal(pawn, newDueDate, isOverdue);
    } catch (error) {
        console.error('Error loading pawn data:', error);
        alert('เกิดข้อผิดพลาด: ' + error.message);
    }
}

// Open renew pawn modal
function openRenewPawnModal(pawn, newDueDate, isOverdue) {
    const modal = document.getElementById('renewPawnModal');
    
    // Set pawn info
    document.getElementById('renewPawnDevice').value = `${pawn.brand} ${pawn.model}`;
    document.getElementById('renewPawnOldDueDate').value = formatDate(pawn.due_date || pawn.dueDate);
    document.getElementById('renewPawnNewDueDate').value = formatDate(newDueDate);
    document.getElementById('renewPawnInterest').value = formatCurrency(pawn.interest);
    document.getElementById('renewPawnId').value = pawn.id;
    
    // Reset late fee
    document.getElementById('renewPawnLateFee').value = 0;
    
    // แสดง/ซ่อน ช่องค่าปรับตามว่าเลยกำหนดหรือไม่
    const lateFeeGroup = document.getElementById('lateFeeGroup');
    const lateFeeWarning = document.getElementById('lateFeeWarning');
    
    if (isOverdue) {
        lateFeeGroup.style.display = 'block';
        lateFeeWarning.style.display = 'block';
    } else {
        lateFeeGroup.style.display = 'none';
        lateFeeWarning.style.display = 'none';
    }
    
    // คำนวณรายรับรวม
    calculateRenewTotalIncome();
    
    // Add event listener for late fee input
    const lateFeeInput = document.getElementById('renewPawnLateFee');
    lateFeeInput.removeEventListener('input', calculateRenewTotalIncome);
    lateFeeInput.addEventListener('input', calculateRenewTotalIncome);
    
    modal.classList.add('show');
}

// Calculate total income for renew (interest + late fee)
function calculateRenewTotalIncome() {
    const interestText = document.getElementById('renewPawnInterest').value;
    const interest = parseFloat(interestText.replace(/[^0-9.-]+/g, '')) || 0;
    const lateFee = parseFloat(document.getElementById('renewPawnLateFee').value) || 0;
    const total = interest + lateFee;
    
    document.getElementById('renewPawnTotalIncome').value = formatCurrency(total);
}

// Close renew pawn modal
function closeRenewPawnModal() {
    const modal = document.getElementById('renewPawnModal');
    modal.classList.remove('show');
}

// Save renew pawn
async function saveRenewPawn(event) {
    event.preventDefault();
    
    const pawnId = document.getElementById('renewPawnId').value;
    const lateFee = parseFloat(document.getElementById('renewPawnLateFee').value) || 0;
    
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

        // บันทึก transaction สำหรับการต่อดอก (รวมค่าปรับ)
        const totalAmount = pawn.interest + lateFee;
            await API.post('http://localhost:5001/api/pawn-interest', {
                pawn_id: pawnId,
            interest_amount: totalAmount, // ดอกเบี้ย + ค่าปรับ
            late_fee: lateFee, // เก็บค่าปรับแยก
                transaction_type: 'renewal',
                transaction_date: new Date().toISOString().split('T')[0],
                store: pawn.store
            });

            await loadPawnData();
            await updateDashboard();
        closeRenewPawnModal();
        
        if (lateFee > 0) {
            showNotification(`ต่อดอกสำเร็จ วันครบกำหนดใหม่: ${formatDate(newDueDate)}\nรายรับรวม: ${formatCurrency(totalAmount)} (ดอกเบี้ย ${formatCurrency(pawn.interest)} + ค่าปรับ ${formatCurrency(lateFee)})`);
        } else {
            showNotification(`ต่อดอกสำเร็จ วันครบกำหนดใหม่: ${formatDate(newDueDate)}`);
        }
        } catch (error) {
            console.error('Error renewing pawn:', error);
            alert('เกิดข้อผิดพลาด: ' + error.message);
    }
}

// Return pawn (customer picks up device)
async function returnPawn(pawnId) {
        try {
            const pawn = await API.get(`${API_ENDPOINTS.pawn}/${pawnId}`);
            if (!pawn) {
            await customAlert({
                title: 'ไม่พบข้อมูล',
                message: 'ไม่พบข้อมูลเครื่องขายฝาก',
                icon: 'error'
            });
                return;
            }

        // Store current pawn ID for later use
        window.currentReturnPawnId = pawnId;

        // Populate modal with pawn data
        const deviceInfo = `${pawn.brand} ${pawn.model} (${pawn.color}) - ${pawn.ram}/${pawn.rom} GB`;
        const pawnAmount = pawn.pawn_amount || pawn.pawnAmount || 0;
        const redemptionAmount = pawn.redemption_amount || pawn.redemptionAmount || 0;
        const receiveDate = pawn.receive_date || pawn.receiveDate || '';
        const dueDate = pawn.due_date || pawn.dueDate || '';
        
        // Interest method display
        let interestMethod = '';
        if (pawn.interest_collection_method === 'deduct') {
            interestMethod = `หักดอก ${pawn.interest}%`;
        } else {
            interestMethod = `เก็บดอก ${pawn.interest}%`;
        }

        document.getElementById('returnPawnDeviceInfo').textContent = deviceInfo;
        document.getElementById('returnPawnCustomerInfo').textContent = pawn.customer_name || '-';
        document.getElementById('returnPawnAmountInfo').textContent = formatCurrency(pawnAmount);
        document.getElementById('returnPawnReceiveDateInfo').textContent = formatDate(receiveDate);
        document.getElementById('returnPawnDueDateInfo').textContent = formatDate(dueDate);
        document.getElementById('returnPawnInterestMethodInfo').textContent = interestMethod;
        
        // Set default redemption amount (current value)
        document.getElementById('returnPawnRedemptionAmount').value = redemptionAmount;
        
        // Set existing note
        document.getElementById('returnPawnNote').value = pawn.note || '';

        // Open modal
        document.getElementById('returnPawnModal').style.display = 'block';
    } catch (error) {
        console.error('Error opening return pawn modal:', error);
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: 'ไม่สามารถโหลดข้อมูลได้: ' + error.message,
            icon: 'error'
        });
    }
}

// Close return pawn modal
function closeReturnPawnModal() {
    document.getElementById('returnPawnModal').style.display = 'none';
    document.getElementById('returnPawnForm').reset();
    window.currentReturnPawnId = null;
}

// ==================== Used Devices Expense Detail ====================

// Show used devices expense detail modal
async function showUsedDevicesExpenseDetail() {
    try {
        // Get all used devices for current store
        const allUsedDevices = await API.get(API_ENDPOINTS.usedDevices, { store: currentStore });
        
        // Filter only STOCK devices (ไม่นับ sold/removed) - เหมือนกับการ์ดรายจ่าย
        const stockDevices = allUsedDevices.filter(device => device.status === 'stock');
        
        console.log('🔍 Used Devices Expense Detail:', {
            currentStore,
            totalDevices: allUsedDevices.length,
            stockDevices: stockDevices.length,
            deviceTypes: stockDevices.map(d => ({ brand: d.brand, model: d.model, status: d.status }))
        });
        
        // Use date range filter from currentUsedDevicesFilter
        let filteredDevices;
        let filterText = '';
        
        if (currentUsedDevicesFilter.startDate || currentUsedDevicesFilter.endDate) {
            // Use date range filter - กรองเฉพาะ stock devices
            filteredDevices = stockDevices.filter(device => {
                const importDate = new Date(device.import_date || device.importDate || 
                                            device.purchase_date || device.purchaseDate);
                const startMatch = !currentUsedDevicesFilter.startDate || 
                                  importDate >= new Date(currentUsedDevicesFilter.startDate);
                const endMatch = !currentUsedDevicesFilter.endDate || 
                                importDate <= new Date(currentUsedDevicesFilter.endDate);
                
                return startMatch && endMatch;
            });
            
            // Format filter text
            if (currentUsedDevicesFilter.startDate && currentUsedDevicesFilter.endDate) {
                filterText = `${formatDate(currentUsedDevicesFilter.startDate)} ถึง ${formatDate(currentUsedDevicesFilter.endDate)}`;
            } else if (currentUsedDevicesFilter.startDate) {
                filterText = `ตั้งแต่ ${formatDate(currentUsedDevicesFilter.startDate)}`;
            } else if (currentUsedDevicesFilter.endDate) {
                filterText = `ถึง ${formatDate(currentUsedDevicesFilter.endDate)}`;
            }
        } else {
            // No filter: show current month STOCK devices only
            const now = new Date();
            const currentMonth = now.getMonth() + 1;
            const currentYear = now.getFullYear();
            
            filteredDevices = stockDevices.filter(device => {
                const importDate = new Date(device.import_date || device.importDate || 
                                            device.purchase_date || device.purchaseDate);
                return importDate.getMonth() + 1 === currentMonth && 
                       importDate.getFullYear() === currentYear;
            });
            
            const monthNames = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
                              'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
            filterText = `${monthNames[currentMonth - 1]} ${currentYear + 543}`;
        }
        
        const monthDevices = filteredDevices;
        
        // Calculate total expense (purchase prices)
        const totalExpense = monthDevices.reduce((sum, device) => {
            const purchasePrice = parseFloat(device.purchase_price || device.purchasePrice || 0);
            return sum + purchasePrice;
        }, 0);
        
        // Update modal content
        document.getElementById('usedDevicesExpenseDetailTotal').textContent = formatCurrency(totalExpense);
        document.getElementById('usedDevicesExpenseDetailCount').textContent = monthDevices.length;
        document.getElementById('usedDevicesExpenseMonth').textContent = filterText;
        
        // Populate table
        const tbody = document.getElementById('usedDevicesExpenseDetailTableBody');
        
        if (monthDevices.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="empty-state">ไม่มีข้อมูลในเดือนนี้</td></tr>';
        } else {
            // Sort by import_date (newest first)
            const sortedDevices = monthDevices.sort((a, b) => {
                const dateA = new Date(a.import_date || a.importDate || a.purchase_date || a.purchaseDate);
                const dateB = new Date(b.import_date || b.importDate || b.purchase_date || b.purchaseDate);
                return dateB - dateA;
            });
            
            tbody.innerHTML = sortedDevices.map(device => {
                const importDate = device.import_date || device.importDate || device.purchase_date || device.purchaseDate || '';
                const ram = device.ram || 0;
                const rom = device.rom || 0;
                const purchasePrice = parseFloat(device.purchase_price || device.purchasePrice || 0);
                
                // Condition labels in Thai
                const conditionLabels = {
                    'excellent': 'สภาพดีมาก',
                    'good': 'สภาพดี',
                    'fair': 'สภาพปานกลาง',
                    'poor': 'สภาพทั่วไป'
                };
                const condition = conditionLabels[device.device_condition || device.deviceCondition] || '-';
                
                // Status labels in Thai
                const statusLabels = {
                    'stock': 'สต๊อค',
                    'sold': 'ขายแล้ว',
                    'removed': 'ตัดออก'
                };
                const statusText = statusLabels[device.status] || device.status;
                const statusClass = device.status === 'stock' ? 'status-stock' : 
                                  device.status === 'sold' ? 'status-sold' : 'status-removed';
                
                return `
                    <tr>
                        <td>${formatDate(importDate)}</td>
                        <td>${device.brand || '-'}</td>
                        <td>${device.model || '-'}</td>
                        <td>${device.color || '-'}</td>
                        <td>${device.imei || '-'}</td>
                        <td>${ram}/${rom} GB</td>
                        <td>${condition}</td>
                        <td class="expense-text">${formatCurrency(purchasePrice)}</td>
                        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    </tr>
                `;
            }).join('');
        }
        
        // Open modal
        document.getElementById('usedDevicesExpenseDetailModal').style.display = 'block';
        
    } catch (error) {
        console.error('Error showing used devices expense detail:', error);
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: 'ไม่สามารถโหลดข้อมูลรายจ่ายได้: ' + error.message,
            icon: 'error'
        });
    }
}

// Close used devices expense detail modal
function closeUsedDevicesExpenseDetailModal() {
    document.getElementById('usedDevicesExpenseDetailModal').style.display = 'none';
}

// Show used devices income detail modal
async function showUsedDevicesIncomeDetail() {
    try {
        // Get all used devices for current store
        const allUsedDevices = await API.get(API_ENDPOINTS.usedDevices, { store: currentStore });

        // Use date range filter from currentUsedDevicesFilter
        let filteredDevices;
        let filterText = '';
        
        if (currentUsedDevicesFilter.startDate || currentUsedDevicesFilter.endDate) {
            // Use date range filter for SALE DATE
            filteredDevices = allUsedDevices.filter(device => {
                if (!device.sale_date || device.status !== 'sold') return false;
                const saleDate = new Date(device.sale_date || device.saleDate);
                const startMatch = !currentUsedDevicesFilter.startDate || 
                                  saleDate >= new Date(currentUsedDevicesFilter.startDate);
                const endMatch = !currentUsedDevicesFilter.endDate || 
                                saleDate <= new Date(currentUsedDevicesFilter.endDate);
                
                return startMatch && endMatch;
            });
            
            // Format filter text
            if (currentUsedDevicesFilter.startDate && currentUsedDevicesFilter.endDate) {
                filterText = `${formatDate(currentUsedDevicesFilter.startDate)} ถึง ${formatDate(currentUsedDevicesFilter.endDate)}`;
            } else if (currentUsedDevicesFilter.startDate) {
                filterText = `ตั้งแต่ ${formatDate(currentUsedDevicesFilter.startDate)}`;
            } else if (currentUsedDevicesFilter.endDate) {
                filterText = `ถึง ${formatDate(currentUsedDevicesFilter.endDate)}`;
            }
        } else {
            // No filter: show current month SOLD devices only
            const now = new Date();
            const currentMonth = now.getMonth() + 1;
            const currentYear = now.getFullYear();
            
            filteredDevices = allUsedDevices.filter(device => {
                if (!device.sale_date || device.status !== 'sold') return false;
                const saleDate = new Date(device.sale_date || device.saleDate);
                return saleDate.getMonth() + 1 === currentMonth && 
                       saleDate.getFullYear() === currentYear;
            });
            
            const monthNames = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
                              'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
            filterText = `${monthNames[currentMonth - 1]} ${currentYear + 543}`;
        }

        const monthDevices = filteredDevices;

        // Calculate total income (sale prices)
        const totalIncome = monthDevices.reduce((sum, device) => {
            const salePrice = parseFloat(device.sale_price || device.salePrice || 0);
            return sum + salePrice;
        }, 0);

        // Update modal content
        document.getElementById('usedDevicesIncomeDetailTotal').textContent = formatCurrency(totalIncome);
        document.getElementById('usedDevicesIncomeDetailCount').textContent = monthDevices.length;
        document.getElementById('usedDevicesIncomeMonth').textContent = filterText;

        // Populate table
        const tbody = document.getElementById('usedDevicesIncomeDetailTableBody');
        if (monthDevices.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="empty-state">ไม่มีข้อมูลการขายในเดือนนี้</td></tr>';
        } else {
            tbody.innerHTML = monthDevices.map(device => {
                const saleDate = new Date(device.sale_date || device.saleDate);
                const salePrice = parseFloat(device.sale_price || device.salePrice || 0);
                const purchasePrice = parseFloat(device.purchase_price || device.purchasePrice || 0);
                const profit = salePrice - purchasePrice;
                const ram = device.ram || '-';
                const rom = device.rom || '-';
                const condition = device.device_condition === 'good' ? 'ดี' :
                                 device.device_condition === 'fair' ? 'ปานกลาง' :
                                 device.device_condition === 'poor' ? 'แย่' : device.device_condition;

                return `
                    <tr>
                        <td>${formatDate(saleDate)}</td>
                        <td>${device.brand || '-'}</td>
                        <td>${device.model || '-'}</td>
                        <td>${device.color || '-'}</td>
                        <td>${device.imei || '-'}</td>
                        <td>${ram}/${rom} GB</td>
                        <td>${condition}</td>
                        <td class="income-text">${formatCurrency(salePrice)}</td>
                        <td class="profit-text">${formatCurrency(profit)}</td>
                    </tr>
                `;
            }).join('');
        }

        // Open modal
        document.getElementById('usedDevicesIncomeDetailModal').style.display = 'block';

    } catch (error) {
        console.error('Error showing used devices income detail:', error);
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: 'ไม่สามารถโหลดข้อมูลรายรับได้: ' + error.message,
            icon: 'error'
        });
    }
}

// Close used devices income detail modal
function closeUsedDevicesIncomeDetailModal() {
    document.getElementById('usedDevicesIncomeDetailModal').style.display = 'none';
}

// Show used devices profit detail modal
async function showUsedDevicesProfitDetail() {
    try {
        // Get all used devices for current store
        const allUsedDevices = await API.get(API_ENDPOINTS.usedDevices, { store: currentStore });

        // Use date range filter from currentUsedDevicesFilter
        let filteredDevices;
        let filterText = '';
        
        if (currentUsedDevicesFilter.startDate || currentUsedDevicesFilter.endDate) {
            // Use date range filter for SALE DATE
            filteredDevices = allUsedDevices.filter(device => {
                if (!device.sale_date || device.status !== 'sold') return false;
                const saleDate = new Date(device.sale_date || device.saleDate);
                const startMatch = !currentUsedDevicesFilter.startDate || 
                                  saleDate >= new Date(currentUsedDevicesFilter.startDate);
                const endMatch = !currentUsedDevicesFilter.endDate || 
                                saleDate <= new Date(currentUsedDevicesFilter.endDate);
                
                return startMatch && endMatch;
            });
            
            // Format filter text
            if (currentUsedDevicesFilter.startDate && currentUsedDevicesFilter.endDate) {
                filterText = `${formatDate(currentUsedDevicesFilter.startDate)} ถึง ${formatDate(currentUsedDevicesFilter.endDate)}`;
            } else if (currentUsedDevicesFilter.startDate) {
                filterText = `ตั้งแต่ ${formatDate(currentUsedDevicesFilter.startDate)}`;
            } else if (currentUsedDevicesFilter.endDate) {
                filterText = `ถึง ${formatDate(currentUsedDevicesFilter.endDate)}`;
            }
        } else {
            // No filter: show current month SOLD devices only
            const now = new Date();
            const currentMonth = now.getMonth() + 1;
            const currentYear = now.getFullYear();
            
            filteredDevices = allUsedDevices.filter(device => {
                if (!device.sale_date || device.status !== 'sold') return false;
                const saleDate = new Date(device.sale_date || device.saleDate);
                return saleDate.getMonth() + 1 === currentMonth && 
                       saleDate.getFullYear() === currentYear;
            });
            
            const monthNames = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
                              'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
            filterText = `${monthNames[currentMonth - 1]} ${currentYear + 543}`;
        }

        const monthDevices = filteredDevices;

        // Calculate totals
        let totalExpense = 0;
        let totalIncome = 0;

        monthDevices.forEach(device => {
            const purchasePrice = parseFloat(device.purchase_price || device.purchasePrice || 0);
            const salePrice = parseFloat(device.sale_price || device.salePrice || 0);
            totalExpense += purchasePrice;
            totalIncome += salePrice;
        });

        const totalProfit = totalIncome - totalExpense;

        // Update modal content
        document.getElementById('usedDevicesProfitDetailTotal').textContent = formatCurrency(totalProfit);
        document.getElementById('usedDevicesProfitDetailCount').textContent = monthDevices.length;
        document.getElementById('usedDevicesProfitMonth').textContent = filterText;
        document.getElementById('usedDevicesProfitExpense').textContent = formatCurrency(totalExpense);
        document.getElementById('usedDevicesProfitIncome').textContent = formatCurrency(totalIncome);
        document.getElementById('usedDevicesProfitProfit').textContent = formatCurrency(totalProfit);

        // Populate table
        const tbody = document.getElementById('usedDevicesProfitDetailTableBody');
        if (monthDevices.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="empty-state">ไม่มีข้อมูลการขายในเดือนนี้</td></tr>';
        } else {
            tbody.innerHTML = monthDevices.map(device => {
                const saleDate = new Date(device.sale_date || device.saleDate);
                const salePrice = parseFloat(device.sale_price || device.salePrice || 0);
                const purchasePrice = parseFloat(device.purchase_price || device.purchasePrice || 0);
                const profit = salePrice - purchasePrice;
                const ram = device.ram || '-';
                const rom = device.rom || '-';

                return `
                    <tr>
                        <td>${formatDate(saleDate)}</td>
                        <td>${device.brand || '-'}</td>
                        <td>${device.model || '-'}</td>
                        <td>${device.color || '-'}</td>
                        <td>${device.imei || '-'}</td>
                        <td>${ram}/${rom} GB</td>
                        <td class="expense-text">${formatCurrency(purchasePrice)}</td>
                        <td class="income-text">${formatCurrency(salePrice)}</td>
                        <td class="profit-text">${formatCurrency(profit)}</td>
                    </tr>
                `;
            }).join('');
        }

        // Open modal
        document.getElementById('usedDevicesProfitDetailModal').style.display = 'block';

    } catch (error) {
        console.error('Error showing used devices profit detail:', error);
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: 'ไม่สามารถโหลดข้อมูลกำไรได้: ' + error.message,
            icon: 'error'
        });
    }
}

// Close used devices profit detail modal
function closeUsedDevicesProfitDetailModal() {
    document.getElementById('usedDevicesProfitDetailModal').style.display = 'none';
}

// ==================== New Devices Expense Detail ====================

// Show new devices expense detail modal
async function showNewDevicesExpenseDetail() {
    try {
        // Get all new devices for current store
        const allNewDevices = await API.get(API_ENDPOINTS.newDevices, { store: currentStore });
        
        console.log('🔍 New Devices Expense Detail:', {
            currentStore,
            totalDevices: allNewDevices.length,
            deviceTypes: allNewDevices.map(d => ({ brand: d.brand, model: d.model, status: d.status }))
        });
        
        // Use date range filter from currentNewDevicesFilter
        let filteredDevices;
        let filterText = '';
        
        if (currentNewDevicesFilter.startDate || currentNewDevicesFilter.endDate) {
            // Use date range filter
            filteredDevices = allNewDevices.filter(device => {
                const importDate = new Date(device.import_date || device.importDate);
                const startMatch = !currentNewDevicesFilter.startDate || 
                                  importDate >= new Date(currentNewDevicesFilter.startDate);
                const endMatch = !currentNewDevicesFilter.endDate || 
                                importDate <= new Date(currentNewDevicesFilter.endDate);
                
                return startMatch && endMatch;
            });
            
            // Format filter text
            if (currentNewDevicesFilter.startDate && currentNewDevicesFilter.endDate) {
                filterText = `${formatDate(currentNewDevicesFilter.startDate)} ถึง ${formatDate(currentNewDevicesFilter.endDate)}`;
            } else if (currentNewDevicesFilter.startDate) {
                filterText = `ตั้งแต่ ${formatDate(currentNewDevicesFilter.startDate)}`;
            } else if (currentNewDevicesFilter.endDate) {
                filterText = `ถึง ${formatDate(currentNewDevicesFilter.endDate)}`;
            }
        } else {
            // No filter: show current month devices only (exclude removed)
            const now = new Date();
            const currentMonth = now.getMonth() + 1;
            const currentYear = now.getFullYear();
            
            filteredDevices = allNewDevices.filter(device => {
                if (device.status === 'removed') return false;
                const importDate = new Date(device.import_date || device.importDate);
                return importDate.getMonth() + 1 === currentMonth && 
                       importDate.getFullYear() === currentYear;
            });
            
            const monthNames = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
                              'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
            filterText = `${monthNames[currentMonth - 1]} ${currentYear + 543}`;
        }
        
        const monthDevices = filteredDevices;
        
        // Calculate total expense (purchase prices)
        const totalExpense = monthDevices.reduce((sum, device) => {
            const purchasePrice = parseFloat(device.purchase_price || device.purchasePrice || 0);
            return sum + purchasePrice;
        }, 0);
        
        // Update modal content
        document.getElementById('newDevicesExpenseDetailTotal').textContent = formatCurrency(totalExpense);
        document.getElementById('newDevicesExpenseDetailCount').textContent = monthDevices.length;
        document.getElementById('newDevicesExpenseMonth').textContent = filterText;
        
        // Populate table
        const tbody = document.getElementById('newDevicesExpenseDetailTableBody');
        
        if (monthDevices.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="empty-state">ไม่มีข้อมูลในเดือนนี้</td></tr>';
        } else {
            // Sort by import_date (newest first)
            const sortedDevices = monthDevices.sort((a, b) => {
                const dateA = new Date(a.import_date || a.importDate);
                const dateB = new Date(b.import_date || b.importDate);
                return dateB - dateA;
            });
            
            tbody.innerHTML = sortedDevices.map(device => {
                const importDate = device.import_date || device.importDate || '';
                const ram = device.ram || 0;
                const rom = device.rom || 0;
                const purchasePrice = parseFloat(device.purchase_price || device.purchasePrice || 0);
                
                // Status labels in Thai
                const statusLabels = {
                    'stock': 'สต๊อค',
                    'sold': 'ขายแล้ว',
                    'removed': 'ตัดออก'
                };
                const status = statusLabels[device.status] || device.status;
                
                return `
                    <tr>
                        <td>${formatDate(importDate)}</td>
                        <td>${device.brand}</td>
                        <td>${device.model}</td>
                        <td>${device.color}</td>
                        <td>${device.imei}</td>
                        <td>${ram}/${rom} GB</td>
                        <td>${formatCurrency(purchasePrice)}</td>
                        <td><span class="status-badge status-${device.status}">${status}</span></td>
                    </tr>
                `;
            }).join('');
        }
        
        // Open modal
        document.getElementById('newDevicesExpenseDetailModal').style.display = 'block';
        
    } catch (error) {
        console.error('Error showing new devices expense detail:', error);
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: 'ไม่สามารถโหลดข้อมูลรายจ่ายได้: ' + error.message,
            icon: 'error'
        });
    }
}

// Close new devices expense detail modal
function closeNewDevicesExpenseDetailModal() {
    document.getElementById('newDevicesExpenseDetailModal').style.display = 'none';
}

// Show new devices income detail modal
async function showNewDevicesIncomeDetail() {
    try {
        const allNewDevices = await API.get(API_ENDPOINTS.newDevices, { store: currentStore });
        
        // Use date range filter from currentNewDevicesFilter
        let filteredDevices;
        let filterText = '';
        
        if (currentNewDevicesFilter.startDate || currentNewDevicesFilter.endDate) {
            // Use date range filter for SALE DATE
            filteredDevices = allNewDevices.filter(device => {
                if (!device.sale_date || device.status !== 'sold') return false;
                const saleDate = new Date(device.sale_date || device.saleDate);
                const startMatch = !currentNewDevicesFilter.startDate || 
                                  saleDate >= new Date(currentNewDevicesFilter.startDate);
                const endMatch = !currentNewDevicesFilter.endDate || 
                                saleDate <= new Date(currentNewDevicesFilter.endDate);
                
                return startMatch && endMatch;
            });
            
            // Format filter text
            if (currentNewDevicesFilter.startDate && currentNewDevicesFilter.endDate) {
                filterText = `${formatDate(currentNewDevicesFilter.startDate)} ถึง ${formatDate(currentNewDevicesFilter.endDate)}`;
            } else if (currentNewDevicesFilter.startDate) {
                filterText = `ตั้งแต่ ${formatDate(currentNewDevicesFilter.startDate)}`;
            } else if (currentNewDevicesFilter.endDate) {
                filterText = `ถึง ${formatDate(currentNewDevicesFilter.endDate)}`;
            }
        } else {
            // No filter: show current month SOLD devices only
            const now = new Date();
            const currentMonth = now.getMonth() + 1;
            const currentYear = now.getFullYear();
            
            filteredDevices = allNewDevices.filter(device => {
                if (!device.sale_date || device.status !== 'sold') return false;
                const saleDate = new Date(device.sale_date || device.saleDate);
                return saleDate.getMonth() + 1 === currentMonth && 
                       saleDate.getFullYear() === currentYear;
            });
            
            const monthNames = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
                              'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
            filterText = `${monthNames[currentMonth - 1]} ${currentYear + 543}`;
        }

        const monthDevices = filteredDevices;
        const totalIncome = monthDevices.reduce((sum, device) => sum + parseFloat(device.sale_price || device.salePrice || 0), 0);

        document.getElementById('newDevicesIncomeDetailTotal').textContent = formatCurrency(totalIncome);
        document.getElementById('newDevicesIncomeDetailCount').textContent = monthDevices.length;
        document.getElementById('newDevicesIncomeMonth').textContent = filterText;

        const tbody = document.getElementById('newDevicesIncomeDetailTableBody');
        tbody.innerHTML = monthDevices.length === 0 ? '<tr><td colspan="8" class="empty-state">ไม่มีข้อมูลการขายในเดือนนี้</td></tr>' :
            monthDevices.map(device => {
                const salePrice = parseFloat(device.sale_price || device.salePrice || 0);
                const purchasePrice = parseFloat(device.purchase_price || device.purchasePrice || 0);
                return `<tr>
                    <td>${formatDate(new Date(device.sale_date))}</td>
                    <td>${device.brand || '-'}</td>
                    <td>${device.model || '-'}</td>
                    <td>${device.color || '-'}</td>
                    <td>${device.imei || '-'}</td>
                    <td>${device.ram}/${device.rom} GB</td>
                    <td class="income-text">${formatCurrency(salePrice)}</td>
                    <td class="profit-text">${formatCurrency(salePrice - purchasePrice)}</td>
                </tr>`;
            }).join('');

        document.getElementById('newDevicesIncomeDetailModal').style.display = 'block';
    } catch (error) {
        console.error('Error showing new devices income detail:', error);
        await customAlert({ title: 'เกิดข้อผิดพลาด', message: 'ไม่สามารถโหลดข้อมูลรายรับได้: ' + error.message, icon: 'error' });
    }
}

function closeNewDevicesIncomeDetailModal() {
    document.getElementById('newDevicesIncomeDetailModal').style.display = 'none';
}

// Show new devices profit detail modal
async function showNewDevicesProfitDetail() {
    try {
        const allNewDevices = await API.get(API_ENDPOINTS.newDevices, { store: currentStore });
        
        // Use date range filter from currentNewDevicesFilter
        let filteredDevices;
        let filterText = '';
        
        if (currentNewDevicesFilter.startDate || currentNewDevicesFilter.endDate) {
            // Use date range filter for SALE DATE
            filteredDevices = allNewDevices.filter(device => {
                if (!device.sale_date || device.status !== 'sold') return false;
                const saleDate = new Date(device.sale_date || device.saleDate);
                const startMatch = !currentNewDevicesFilter.startDate || 
                                  saleDate >= new Date(currentNewDevicesFilter.startDate);
                const endMatch = !currentNewDevicesFilter.endDate || 
                                saleDate <= new Date(currentNewDevicesFilter.endDate);
                
                return startMatch && endMatch;
            });
            
            // Format filter text
            if (currentNewDevicesFilter.startDate && currentNewDevicesFilter.endDate) {
                filterText = `${formatDate(currentNewDevicesFilter.startDate)} ถึง ${formatDate(currentNewDevicesFilter.endDate)}`;
            } else if (currentNewDevicesFilter.startDate) {
                filterText = `ตั้งแต่ ${formatDate(currentNewDevicesFilter.startDate)}`;
            } else if (currentNewDevicesFilter.endDate) {
                filterText = `ถึง ${formatDate(currentNewDevicesFilter.endDate)}`;
            }
        } else {
            // No filter: show current month SOLD devices only
            const now = new Date();
            const currentMonth = now.getMonth() + 1;
            const currentYear = now.getFullYear();
            
            filteredDevices = allNewDevices.filter(device => {
                if (!device.sale_date || device.status !== 'sold') return false;
                const saleDate = new Date(device.sale_date || device.saleDate);
                return saleDate.getMonth() + 1 === currentMonth && 
                       saleDate.getFullYear() === currentYear;
            });
            
            const monthNames = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
                              'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
            filterText = `${monthNames[currentMonth - 1]} ${currentYear + 543}`;
        }

        const monthDevices = filteredDevices;

        let totalExpense = 0, totalIncome = 0;
        monthDevices.forEach(device => {
            totalExpense += parseFloat(device.purchase_price || device.purchasePrice || 0);
            totalIncome += parseFloat(device.sale_price || device.salePrice || 0);
        });
        const totalProfit = totalIncome - totalExpense;

        document.getElementById('newDevicesProfitDetailTotal').textContent = formatCurrency(totalProfit);
        document.getElementById('newDevicesProfitDetailCount').textContent = monthDevices.length;
        document.getElementById('newDevicesProfitMonth').textContent = filterText;
        document.getElementById('newDevicesProfitExpense').textContent = formatCurrency(totalExpense);
        document.getElementById('newDevicesProfitIncome').textContent = formatCurrency(totalIncome);
        document.getElementById('newDevicesProfitProfit').textContent = formatCurrency(totalProfit);

        const tbody = document.getElementById('newDevicesProfitDetailTableBody');
        tbody.innerHTML = monthDevices.length === 0 ? '<tr><td colspan="9" class="empty-state">ไม่มีข้อมูลการขายในเดือนนี้</td></tr>' :
            monthDevices.map(device => {
                const salePrice = parseFloat(device.sale_price || device.salePrice || 0);
                const purchasePrice = parseFloat(device.purchase_price || device.purchasePrice || 0);
                return `<tr>
                    <td>${formatDate(new Date(device.sale_date))}</td>
                    <td>${device.brand || '-'}</td>
                    <td>${device.model || '-'}</td>
                    <td>${device.color || '-'}</td>
                    <td>${device.imei || '-'}</td>
                    <td>${device.ram}/${device.rom} GB</td>
                    <td class="expense-text">${formatCurrency(purchasePrice)}</td>
                    <td class="income-text">${formatCurrency(salePrice)}</td>
                    <td class="profit-text">${formatCurrency(salePrice - purchasePrice)}</td>
                </tr>`;
            }).join('');

        document.getElementById('newDevicesProfitDetailModal').style.display = 'block';
    } catch (error) {
        console.error('Error showing new devices profit detail:', error);
        await customAlert({ title: 'เกิดข้อผิดพลาด', message: 'ไม่สามารถโหลดข้อมูลกำไรได้: ' + error.message, icon: 'error' });
    }
}

function closeNewDevicesProfitDetailModal() {
    document.getElementById('newDevicesProfitDetailModal').style.display = 'none';
}

// Confirm return pawn with adjusted redemption amount
async function confirmReturnPawn(event) {
    event.preventDefault();

    const pawnId = window.currentReturnPawnId;
    if (!pawnId) {
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: 'ไม่พบข้อมูล Pawn ID',
            icon: 'error'
        });
        return;
    }

    try {
        const pawn = await API.get(`${API_ENDPOINTS.pawn}/${pawnId}`);
        if (!pawn) {
            await customAlert({
                title: 'ไม่พบข้อมูล',
                message: 'ไม่พบข้อมูลเครื่องขายฝาก',
                icon: 'error'
            });
            return;
        }

        const formData = new FormData(event.target);
        const adjustedRedemptionAmount = parseFloat(formData.get('redemptionAmount')) || 0;
        const note = formData.get('note') || pawn.note || '';
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
            redemption_amount: adjustedRedemptionAmount,
                receive_date: pawn.receive_date || pawn.receiveDate,
                due_date: pawn.due_date || pawn.dueDate,
                return_date: returnDate,
                seized_date: pawn.seized_date,
                status: 'returned',
            note: note,
                store: pawn.store
            };

            await API.put(`${API_ENDPOINTS.pawn}/${pawnId}`, pawnData);
        closeReturnPawnModal();
            await loadPawnData();
            await updateDashboard();
        
        await customAlert({
            title: 'สำเร็จ',
            message: `บันทึกรับเครื่องคืนสำเร็จ\nยอดไถ่ถอน: ${formatCurrency(adjustedRedemptionAmount)}`,
            icon: 'success'
        });
        } catch (error) {
            console.error('Error returning pawn:', error);
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: 'ไม่สามารถบันทึกข้อมูลได้: ' + error.message,
            icon: 'error'
        });
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

// Delete interest transaction (for renewal/late fee records)
async function deleteInterestTransaction(transactionId) {
    if (confirm('ต้องการลบรายการนี้หรือไม่?\n\nการลบจะไม่สามารถกู้คืนได้')) {
        try {
            console.log('🗑️ Deleting interest transaction:', transactionId);
            
            // Delete via API
            await API.delete(`http://localhost:5001/api/pawn-interest/${transactionId}`);
            
            console.log('✅ Transaction deleted successfully');
            
            // Reload pawn data to refresh dashboard
            await loadPawnData();
            await updateDashboard();
            
            // If on detail page, refresh the detail view
            const detailPage = document.getElementById('pawn-income-detail');
            if (detailPage && detailPage.classList.contains('active')) {
                showPawnIncomeDetailPage();
            }
            
            showNotification('ลบรายการสำเร็จ');
        } catch (error) {
            console.error('❌ Error deleting transaction:', error);
            alert('เกิดข้อผิดพลาดในการลบรายการ: ' + error.message);
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
                store: pawn.store,
                source_pawn_id: pawnId // เก็บ ID ต้นทาง
            };

            // ส่งไปยังเครื่องมือสอง
            await API.post(API_ENDPOINTS.usedDevices, usedDeviceData);

            // อัพเดทสถานะเครื่องขายฝาก - ไม่ลบ แต่ทำเครื่องหมายว่าโยกไปมือ 2 แล้ว
            await API.put(`${API_ENDPOINTS.pawn}/${pawnId}`, {
                ...pawn,
                transferred_to_used: true, // เพิ่มฟิลด์นี้
                transferred_date: new Date().toISOString().split('T')[0]
            });

            loadPawnData();
            showNotification('ส่งข้อมูลไปเครื่องมือสองสำเร็จ - กรุณาแก้ไขสภาพเครื่องและราคาตามต้องการ');
        } catch (error) {
            alert('เกิดข้อผิดพลาด: ' + error.message);
            console.error(error);
        }
    }
}

// Update pawn tab counts
function updatePawnTabCounts(filteredPawns = {}) {
    // Count pawns from filtered data (matching what's displayed in tables)
    const activeCount = filteredPawns.active ? filteredPawns.active.length : 0;
    const returnedCount = filteredPawns.returned ? filteredPawns.returned.length : 0;
    const seizedCount = filteredPawns.seized ? filteredPawns.seized.length : 0;

    // Update tab counts
    const activeCountElement = document.getElementById('pawnActiveCount');
    const returnedCountElement = document.getElementById('pawnReturnedCount');
    const seizedCountElement = document.getElementById('pawnSeizedCount');

    if (activeCountElement) activeCountElement.textContent = activeCount;
    if (returnedCountElement) returnedCountElement.textContent = returnedCount;
    if (seizedCountElement) seizedCountElement.textContent = seizedCount;
}

// Update pawn dashboard statistics
async function updatePawnDashboard(allPawns = []) {
    try {
        console.log('🔍 [updatePawnDashboard] Starting with allPawns:', allPawns);
        console.log('🔍 [updatePawnDashboard] Current filter:', currentPawnFilter);
        
        // กำหนดเดือน/ปีที่ใช้ในการกรอง
        const currentDate = new Date();
        const filterMonth = currentPawnFilter.month || (currentDate.getMonth() + 1).toString();
        const filterYear = currentPawnFilter.year || currentDate.getFullYear().toString();
        
        console.log('📅 Filter criteria:', { filterMonth, filterYear });
        console.log('📦 All Pawns Data:', {
            total: allPawns.length,
            byStatus: {
                active: allPawns.filter(p => p.status === 'active').length,
                returned: allPawns.filter(p => p.status === 'returned').length,
                seized: allPawns.filter(p => p.status === 'seized').length
            }
        });

        // แสดงข้อมูลดิบทั้งหมดของแต่ละรายการ
        console.log('🔍 RAW DATA - แสดง ALL FIELDS ของแต่ละรายการ:');
        allPawns.forEach((pawn, index) => {
            console.log(`\n📄 Pawn #${index + 1} (${pawn.brand} ${pawn.model}):`, pawn);
            console.log('   Available date fields:', {
                pawn_date: pawn.pawn_date,
                pawnDate: pawn.pawnDate,
                receive_date: pawn.receive_date,
                receiveDate: pawn.receiveDate,
                created_at: pawn.created_at,
                createdAt: pawn.createdAt,
                return_date: pawn.return_date,
                returnDate: pawn.returnDate,
                seized_date: pawn.seized_date,
                seizedDate: pawn.seizedDate
            });
        });
        
        // 1. การ์ด "จำนวนเครื่องฝาก" - แสดง active ทั้งหมด (ไม่กรองวันที่)
        const activePawns = allPawns.filter(p => p.status === 'active');
        const totalCount = activePawns.length;

        console.log('📦 Active Pawns (no date filter):', activePawns.length);

        // 2. การ์ด "รายจ่าย" - กรองเฉพาะเครื่องที่รับฝาก (receive_date) ในเดือนที่เลือก
        const expensePawns = allPawns.filter(pawn => {
            // เฉพาะเครื่อง active และ returned เท่านั้น
            if (pawn.status !== 'active' && pawn.status !== 'returned') return false;
            
            const receiveDate = pawn.receive_date || pawn.receiveDate;
            if (!receiveDate) {
                console.log(`⚠️ Pawn ${pawn.id} has no receive_date`);
                return false;
            }
            
            const date = new Date(receiveDate);
            const pawnMonth = date.getMonth() + 1;
            const pawnYear = date.getFullYear();
            
            const isMatch = pawnMonth == filterMonth && pawnYear == filterYear;
            
            console.log(`🔍 Expense Filter - Pawn ${pawn.id} (${pawn.brand} ${pawn.model}):`, {
                receiveDate: receiveDate,
                parsedDate: date.toISOString(),
                pawnMonth: pawnMonth,
                pawnYear: pawnYear,
                filterMonth: filterMonth,
                filterYear: filterYear,
                isMatch: isMatch
            });
            
            return isMatch;
        });
        
        const totalExpense = expensePawns.reduce((sum, pawn) => {
            const pawnAmount = pawn.pawn_amount || pawn.pawnAmount || 0;
            return sum + parseFloat(pawnAmount);
        }, 0);

        console.log('💸 Expense Pawns (filtered by receive_date):', {
            count: expensePawns.length,
            totalExpense: totalExpense,
            pawns: expensePawns.map(p => ({
                brand: p.brand,
                model: p.model,
                receiveDate: p.receive_date || p.receiveDate,
                amount: p.pawn_amount || p.pawnAmount,
                status: p.status
            }))
        });

        // 3. การ์ด "รายรับ"
        let totalIncome = 0;

        // 3.1 ดอกเบี้ยจากเครื่องที่หักดอกตอนรับฝาก (deducted) - กรองตาม receive_date
        const deductedPawns = allPawns.filter(pawn => {
            // ต้องเป็นแบบหักดอก
            if ((pawn.interest_collection_method || pawn.interestCollectionMethod) !== 'deducted') return false;
            
            // กรองตาม receive_date
            const receiveDate = pawn.receive_date || pawn.receiveDate;
            if (!receiveDate) return false;
            
            const date = new Date(receiveDate);
            const pawnMonth = date.getMonth() + 1;
            const pawnYear = date.getFullYear();
            
            return pawnMonth == filterMonth && pawnYear == filterYear;
        });
        
        const deductedInterest = deductedPawns.reduce((sum, pawn) => {
            return sum + (parseFloat(pawn.interest) || 0);
        }, 0);
        totalIncome += deductedInterest;

        console.log('💰 Deducted Interest (filtered by receive_date):', {
            count: deductedPawns.length,
            deductedInterest: deductedInterest,
            pawns: deductedPawns.map(p => ({
                id: p.id,
                brand: p.brand,
                model: p.model,
                color: p.color,
                customerName: p.customer_name || p.customerName,
                receiveDate: p.receive_date || p.receiveDate,
                interest: p.interest,
                interestMethod: p.interest_collection_method || p.interestCollectionMethod,
                status: p.status,
                pawnAmount: p.pawn_amount || p.pawnAmount
            }))
        });

        // 3.2 ยอดไถ่ถอนจากเครื่องที่รับคืน - กรองตาม return_date
        const returnedPawns = allPawns.filter(pawn => {
            if (pawn.status !== 'returned') return false;
            
            const returnDate = pawn.return_date || pawn.returnDate;
            if (!returnDate) return false;
            
            const date = new Date(returnDate);
            const returnMonth = date.getMonth() + 1;
            const returnYear = date.getFullYear();
            
            return returnMonth == filterMonth && returnYear == filterYear;
        });
        
        const returnedRedemption = returnedPawns.reduce((sum, pawn) => {
            return sum + (parseFloat(pawn.redemption_amount || pawn.redemptionAmount) || 0);
        }, 0);
        totalIncome += returnedRedemption;
        
        console.log('💵 Returned Redemption (filtered by return_date):', {
            count: returnedPawns.length,
            returnedRedemption: returnedRedemption,
            pawns: returnedPawns.map(p => ({
                id: p.id,
                brand: p.brand,
                model: p.model,
                color: p.color,
                customerName: p.customer_name || p.customerName,
                returnDate: p.return_date || p.returnDate,
                receiveDate: p.receive_date || p.receiveDate,
                redemption: p.redemption_amount || p.redemptionAmount,
                pawnAmount: p.pawn_amount || p.pawnAmount,
                interest: p.interest,
                interestMethod: p.interest_collection_method || p.interestCollectionMethod
            }))
        });

        // 3.3 ดอกเบี้ยจากการต่อดอก (ดึงจาก pawn-interest table) - กรองตาม transaction_date
        let interestTransactions = [];
        let renewalTransactions = [];  // ย้ายออกมาข้างนอก try block
        let renewalIncome = 0;
        try {
            interestTransactions = await API.get('http://localhost:5001/api/pawn-interest', { store: currentStore });
            renewalTransactions = interestTransactions.filter(t => {
                // ต้องเป็น renewal
                if (t.transaction_type !== 'renewal') return false;
                
                // กรองตาม transaction_date
                if (!t.transaction_date) return false;
                const date = new Date(t.transaction_date);
                const txMonth = date.getMonth() + 1;
                const txYear = date.getFullYear();
                
                return txMonth == filterMonth && txYear == filterYear;
            });
            
            renewalIncome = renewalTransactions.reduce((sum, t) => {
                return sum + (parseFloat(t.interest_amount) || 0) + (parseFloat(t.late_fee) || 0);
            }, 0);
            totalIncome += renewalIncome;
            
            console.log('🔄 Renewal Interest Calculation:', {
                renewalTransactions: renewalTransactions.length,
                renewalIncome: renewalIncome,
                transactions: renewalTransactions.map(t => ({
                    id: t.id,
                    pawnId: t.pawn_id,
                    date: t.transaction_date,
                    interest: t.interest_amount,
                    lateFee: t.late_fee,
                    total: (t.interest_amount || 0) + (t.late_fee || 0),
                    type: t.transaction_type
                }))
            });
        } catch (error) {
            console.warn('Could not fetch pawn interest transactions:', error);
        }

        // 4. กำไร = รายรับ - รายจ่าย
        const totalProfit = totalIncome - totalExpense;

        // Store data for detail modals
        pawnDetailData = {
            activePawns,
            allPawns,
            returnedPawns,
            deductedPawns,         // รายการที่หักดอก (กรองตาม pawn_date แล้ว)
            expensePawns,          // รายการรายจ่าย (กรองตาม pawn_date แล้ว)
            renewalTransactions,   // รายการต่อดอก (กรองตาม transaction_date แล้ว)
            totalExpense,
            totalIncome,
            totalProfit,
            filterMonth,           // เดือนที่ใช้กรอง
            filterYear             // ปีที่ใช้กรอง
        };

        // Debug logging
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🔍 [updatePawnDashboard] SUMMARY:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📅 Filter: เดือน ${filterMonth} ปี ${filterYear}`);
        console.log('');
        console.log(`📦 จำนวนเครื่องฝาก (Active - no filter): ${activePawns.length} เครื่อง`);
        console.log('');
        console.log(`💸 รายจ่าย (receive_date = ${filterMonth}/${filterYear}):`);
        console.log(`   • จำนวนเครื่อง: ${expensePawns.length} เครื่อง`);
        console.log(`   • ยอดรวม: ฿${totalExpense.toLocaleString()}`);
        console.log('');
        console.log(`💵 รายรับ (${filterMonth}/${filterYear}):`);
        console.log(`   • ดอกเบี้ยหักดอก (receive_date): ฿${deductedInterest.toLocaleString()} (${deductedPawns.length} เครื่อง)`);
        console.log(`   • ยอดไถ่ถอน (return_date): ฿${returnedRedemption.toLocaleString()} (${returnedPawns.length} เครื่อง)`);
        console.log(`   • ดอกเบี้ยต่อดอก (transaction_date): ฿${(renewalIncome || 0).toLocaleString()}`);
        console.log(`   • รวมรายรับทั้งหมด: ฿${totalIncome.toLocaleString()}`);
        console.log('');
        console.log(`📈 กำไร = รายรับ - รายจ่าย`);
        console.log(`   = ฿${totalIncome.toLocaleString()} - ฿${totalExpense.toLocaleString()}`);
        console.log(`   = ฿${totalProfit.toLocaleString()}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        // Update UI
        const countElement = document.getElementById('pawnDashboardCount');
        const expenseElement = document.getElementById('pawnDashboardExpense');
        const incomeElement = document.getElementById('pawnDashboardIncome');
        const profitElement = document.getElementById('pawnDashboardProfit');

        if (countElement) {
            countElement.textContent = totalCount;
            console.log(`✅ Updated count element: ${totalCount}`);
        } else {
            console.warn('❌ Count element not found');
        }
        
        if (expenseElement) {
            expenseElement.textContent = formatCurrency(totalExpense);
            console.log(`✅ Updated expense element: ${formatCurrency(totalExpense)}`);
        } else {
            console.warn('❌ Expense element not found');
        }
        
        if (incomeElement) {
            incomeElement.textContent = formatCurrency(totalIncome);
            console.log(`✅ Updated income element: ${formatCurrency(totalIncome)}`);
        } else {
            console.warn('❌ Income element not found');
        }
        
        if (profitElement) {
            profitElement.textContent = formatCurrency(totalProfit);
            console.log(`✅ Updated profit element: ${formatCurrency(totalProfit)}`);
        } else {
            console.warn('❌ Profit element not found');
        }

    } catch (error) {
        console.error('Error updating pawn dashboard:', error);
    }
}

// Show Pawn Expense Detail Page
function showPawnExpenseDetailPage() {
    // Hide pawn page
    document.getElementById('pawn').classList.remove('active');
    
    // Show expense detail page
    const detailPage = document.getElementById('pawn-expense-detail');
    detailPage.classList.add('active');
    
    console.log('📄 [showPawnExpenseDetailPage] Filter:', {
        month: pawnDetailData.filterMonth,
        year: pawnDetailData.filterYear
    });
    
    // Update data
    const totalElement = document.getElementById('pawnExpensePageTotal');
    const tableBody = document.getElementById('pawnExpensePageTableBody');

    if (totalElement) {
        totalElement.textContent = formatCurrency(pawnDetailData.totalExpense);
    }

    // ใช้ expensePawns ที่กรองตาม pawn_date แล้วจาก pawnDetailData
    const expensePawns = (pawnDetailData.expensePawns || []).sort((a, b) => {
        // เรียงตามวันที่รับฝาก จากล่าสุดไปเก่าสุด (descending)
        const dateA = new Date(a.receive_date || a.receiveDate);
        const dateB = new Date(b.receive_date || b.receiveDate);
        return dateB - dateA;
    });

    if (tableBody) {
        if (expensePawns.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" class="empty-state">ไม่มีข้อมูล</td></tr>';
        } else {
            tableBody.innerHTML = expensePawns.map(pawn => {
                const receiveDate = formatDate(pawn.receive_date || pawn.receiveDate);
                const deviceInfo = `${pawn.brand} ${pawn.model} (${pawn.color})`;
                const customerName = pawn.customer_name || pawn.customerName;
                const pawnAmount = pawn.pawn_amount || pawn.pawnAmount || 0;
                let status = '';
                if (pawn.status === 'active') status = '🟢 กำลังฝาก';
                else if (pawn.status === 'returned') status = '🔵 รับคืนแล้ว';
                else if (pawn.status === 'seized') status = '🔴 ยึดเครื่อง';

                return `
                    <tr>
                        <td>${receiveDate}</td>
                        <td>${deviceInfo}</td>
                        <td>${customerName}</td>
                        <td>${status}</td>
                        <td class="expense-text">${formatCurrency(pawnAmount)}</td>
                    </tr>
                `;
            }).join('');
        }
    }
}

// Show Pawn Expense Detail Modal (keep for backward compatibility)
function showPawnExpenseDetail() {
    const modal = document.getElementById('pawnExpenseDetailModal');
    const totalElement = document.getElementById('pawnExpenseDetailTotal');
    const tableBody = document.getElementById('pawnExpenseDetailTableBody');

    if (totalElement) {
        totalElement.textContent = formatCurrency(pawnDetailData.totalExpense);
    }

    // ใช้ expensePawns ที่กรองตาม pawn_date แล้วจาก pawnDetailData
    const expensePawns = (pawnDetailData.expensePawns || []).sort((a, b) => {
        // เรียงตามวันที่รับฝาก จากล่าสุดไปเก่าสุด (descending)
        const dateA = new Date(a.receive_date || a.receiveDate);
        const dateB = new Date(b.receive_date || b.receiveDate);
        return dateB - dateA;
    });

    console.log('🔍 [showPawnExpenseDetail] Filter:', {
        month: pawnDetailData.filterMonth,
        year: pawnDetailData.filterYear,
        expenseCount: expensePawns.length
    });

    if (tableBody) {
        if (expensePawns.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" class="empty-state">ไม่มีข้อมูลในขณะนี้</td></tr>';
        } else {
            tableBody.innerHTML = expensePawns.map(pawn => {
                const receiveDate = formatDate(pawn.receive_date || pawn.receiveDate);
                const deviceInfo = `${pawn.brand} ${pawn.model} (${pawn.color})`;
                const customerName = pawn.customer_name || pawn.customerName;
                const pawnAmount = pawn.pawn_amount || pawn.pawnAmount || 0;
                let status = '';
                if (pawn.status === 'active') status = '🟢 กำลังฝาก';
                else if (pawn.status === 'returned') status = '🔵 รับคืนแล้ว';
                else if (pawn.status === 'seized') status = '🔴 ยึดเครื่อง';

                return `
                    <tr>
                        <td>${receiveDate}</td>
                        <td>${deviceInfo}</td>
                        <td>${customerName}</td>
                        <td>${status}</td>
                        <td class="expense-text">${formatCurrency(pawnAmount)}</td>
                    </tr>
                `;
            }).join('');
        }
    }

    modal.style.display = 'block';
}

function closePawnExpenseDetailModal() {
    document.getElementById('pawnExpenseDetailModal').style.display = 'none';
}

// Show Pawn Income Detail Page
function showPawnIncomeDetailPage() {
    // Hide pawn page
    document.getElementById('pawn').classList.remove('active');
    
    // Show income detail page
    const detailPage = document.getElementById('pawn-income-detail');
    detailPage.classList.add('active');
    
    console.log('📄 [showPawnIncomeDetailPage] Filter:', {
        month: pawnDetailData.filterMonth,
        year: pawnDetailData.filterYear
    });
    
    // 1. ดอกเบี้ยจากหักดอกตอนรับฝาก - ใช้ข้อมูลที่กรองตาม pawn_date แล้วจาก pawnDetailData
    const deductedPawns = (pawnDetailData.deductedPawns || []).sort((a, b) => {
        // เรียงตามวันที่รับฝาก จากล่าสุดไปเก่าสุด (descending)
        const dateA = new Date(a.receive_date || a.receiveDate);
        const dateB = new Date(b.receive_date || b.receiveDate);
        return dateB - dateA;
    });
    const deductedTotal = deductedPawns.reduce((sum, p) => sum + (p.interest || 0), 0);

    document.getElementById('pawnIncomePageDeductedTotal').textContent = formatCurrency(deductedTotal);
    const deductedTableBody = document.getElementById('pawnIncomePageDeductedTableBody');
    if (deductedPawns.length === 0) {
        deductedTableBody.innerHTML = '<tr><td colspan="5" class="empty-state">ไม่มีข้อมูล</td></tr>';
    } else {
        deductedTableBody.innerHTML = deductedPawns.map(pawn => {
            const receiveDate = formatDate(pawn.receive_date || pawn.receiveDate);
            const deviceInfo = `${pawn.brand} ${pawn.model} (${pawn.color})`;
            const customerName = pawn.customer_name || pawn.customerName;
            const interest = pawn.interest || 0;
            let statusBadge = '';
            if (pawn.status === 'returned') statusBadge = ' <span style="color: #4CAF50;">✓ รับคืนแล้ว</span>';
            else if (pawn.status === 'seized') statusBadge = ' <span style="color: #f44336;">⚠ ยึดเครื่อง</span>';

            return `
                <tr>
                    <td>${receiveDate}</td>
                    <td>${deviceInfo}${statusBadge}</td>
                    <td>${customerName}</td>
                    <td class="income-text">${formatCurrency(interest)}</td>
                </tr>
            `;
        }).join('');
    }

    // 2. ยอดไถ่ถอน (ทั้งหมดที่รับคืน)
    const returnedPawns = (pawnDetailData.returnedPawns || []).sort((a, b) => {
        // เรียงตามวันที่รับคืน จากล่าสุดไปเก่าสุด (descending)
        const dateA = new Date(a.return_date || a.returnDate);
        const dateB = new Date(b.return_date || b.returnDate);
        return dateB - dateA;
    });
    const returnedTotal = returnedPawns.reduce((sum, p) => sum + (p.redemption_amount || p.redemptionAmount || 0), 0);

    document.getElementById('pawnIncomePageReturnedTotal').textContent = formatCurrency(returnedTotal);
    const returnedTableBody = document.getElementById('pawnIncomePageReturnedTableBody');
    if (returnedPawns.length === 0) {
        returnedTableBody.innerHTML = '<tr><td colspan="4" class="empty-state">ไม่มีข้อมูล</td></tr>';
    } else {
        returnedTableBody.innerHTML = returnedPawns.map(pawn => {
            const returnDate = formatDate(pawn.return_date || pawn.returnDate);
            const deviceInfo = `${pawn.brand} ${pawn.model} (${pawn.color})`;
            const customerName = pawn.customer_name || pawn.customerName;
            const redemption = pawn.redemption_amount || pawn.redemptionAmount || 0;

            return `
                <tr>
                    <td>${returnDate}</td>
                    <td>${deviceInfo}</td>
                    <td>${customerName}</td>
                    <td class="income-text">${formatCurrency(redemption)}</td>
                </tr>
            `;
        }).join('');
    }

    // 3. การต่อดอก - ใช้ข้อมูลที่กรองตาม transaction_date แล้วจาก pawnDetailData
    const renewalTransactions = (pawnDetailData.renewalTransactions || []).sort((a, b) => {
        // เรียงตามวันที่ทำธุรกรรม จากล่าสุดไปเก่าสุด (descending)
        const dateA = new Date(a.transaction_date);
        const dateB = new Date(b.transaction_date);
        return dateB - dateA;
    });
    const renewalTotal = renewalTransactions.reduce((sum, t) => sum + (parseFloat(t.interest_amount) || 0) + (parseFloat(t.late_fee) || 0), 0);

    console.log('🔄 [showPawnIncomeDetailPage] Renewal Debug:', {
        renewalTransactions: renewalTransactions.length,
        renewalTotal: renewalTotal,
        transactions: renewalTransactions.map(t => ({
            date: t.transaction_date,
            interest: t.interest_amount,
            lateFee: t.late_fee,
            total: (parseFloat(t.interest_amount) || 0) + (parseFloat(t.late_fee) || 0)
        }))
    });

    document.getElementById('pawnIncomePageRenewalTotal').textContent = formatCurrency(renewalTotal);
    const renewalTableBody = document.getElementById('pawnIncomePageRenewalTableBody');
    if (renewalTransactions.length === 0) {
        renewalTableBody.innerHTML = '<tr><td colspan="5" class="empty-state">ไม่มีข้อมูล</td></tr>';
    } else {
        renewalTableBody.innerHTML = renewalTransactions.map(transaction => {
            const transactionDate = formatDate(transaction.transaction_date);
            const pawn = pawnDetailData.allPawns.find(p => p.id === transaction.pawn_id);
            const deviceInfo = pawn ? `${pawn.brand} ${pawn.model}` : 'N/A';
            const interest = parseFloat(transaction.interest_amount) || 0;
            const lateFee = parseFloat(transaction.late_fee) || 0;
            const total = interest + lateFee;

            return `
                <tr>
                    <td>${transactionDate}</td>
                    <td>${deviceInfo}</td>
                    <td class="income-text">${formatCurrency(interest)}</td>
                    <td class="income-text">${formatCurrency(lateFee)}</td>
                    <td class="income-text"><strong>${formatCurrency(total)}</strong></td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="deleteInterestTransaction(${transaction.id})">ลบ</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Update total income
    const totalIncomeCalculated = deductedTotal + returnedTotal + renewalTotal;
    
    console.log('💵 [showPawnIncomeDetailPage] Total Income Summary:', {
        deductedInterest: deductedTotal,
        returnedRedemption: returnedTotal,
        renewalIncome: renewalTotal,
        calculatedTotal: totalIncomeCalculated,
        storedTotal: pawnDetailData.totalIncome,
        match: totalIncomeCalculated === pawnDetailData.totalIncome
    });
    
    document.getElementById('pawnIncomePageTotal').textContent = formatCurrency(pawnDetailData.totalIncome);
}

// Show Pawn Profit Detail Page
function showPawnProfitDetailPage() {
    // Hide pawn page
    document.getElementById('pawn').classList.remove('active');
    
    // Show profit detail page
    const detailPage = document.getElementById('pawn-profit-detail');
    detailPage.classList.add('active');

    document.getElementById('pawnProfitPageTotal').textContent = formatCurrency(pawnDetailData.totalProfit);
    document.getElementById('pawnProfitPageIncome').textContent = formatCurrency(pawnDetailData.totalIncome);
    document.getElementById('pawnProfitPageExpense').textContent = formatCurrency(pawnDetailData.totalExpense);
    document.getElementById('pawnProfitPageResult').textContent = formatCurrency(pawnDetailData.totalProfit);
}

// Back to Pawn page
function backToPawn() {
    // Hide all detail pages
    document.getElementById('pawn-expense-detail').classList.remove('active');
    document.getElementById('pawn-income-detail').classList.remove('active');
    document.getElementById('pawn-profit-detail').classList.remove('active');
    
    // Show pawn page
    document.getElementById('pawn').classList.add('active');
}

// Show Pawn Income Detail Modal
function showPawnIncomeDetail() {
    const modal = document.getElementById('pawnIncomeDetailModal');

    // 1. ดอกเบี้ยจากหักดอกตอนรับฝาก - รวม active, returned และ seized
    const seizedPawns = pawnDetailData.allPawns ? pawnDetailData.allPawns.filter(p => p.status === 'seized') : [];
    const allPawnsForIncome = [...(pawnDetailData.activePawns || []), ...(pawnDetailData.returnedPawns || []), ...seizedPawns];
    const deductedPawns = allPawnsForIncome.filter(p => {
        const method = p.interest_collection_method || p.interestCollectionMethod;
        return method === 'deducted' && p.interest > 0;
    });
    const deductedTotal = deductedPawns.reduce((sum, p) => sum + (p.interest || 0), 0);

    document.getElementById('pawnIncomeDeductedTotal').textContent = formatCurrency(deductedTotal);
    const deductedTableBody = document.getElementById('pawnIncomeDeductedTableBody');
    if (deductedPawns.length === 0) {
        deductedTableBody.innerHTML = '<tr><td colspan="4" class="empty-state">ไม่มีข้อมูล</td></tr>';
    } else {
        deductedTableBody.innerHTML = deductedPawns.map(pawn => {
            const receiveDate = formatDate(pawn.receive_date || pawn.receiveDate);
            const deviceInfo = `${pawn.brand} ${pawn.model} (${pawn.color})`;
            const customerName = pawn.customer_name || pawn.customerName;
            const interest = pawn.interest || 0;
            let statusBadge = '';
            if (pawn.status === 'returned') statusBadge = ' <span style="color: #4CAF50;">✓ รับคืนแล้ว</span>';
            else if (pawn.status === 'seized') statusBadge = ' <span style="color: #f44336;">⚠ ยึดเครื่อง</span>';

            return `
                <tr>
                    <td>${receiveDate}</td>
                    <td>${deviceInfo}${statusBadge}</td>
                    <td>${customerName}</td>
                    <td class="income-text">${formatCurrency(interest)}</td>
                </tr>
            `;
        }).join('');
    }

    // 2. ยอดไถ่ถอน (ทั้งหมดที่รับคืน)
    const returnedPawns = pawnDetailData.returnedPawns;
    const returnedTotal = returnedPawns.reduce((sum, p) => sum + (p.redemption_amount || p.redemptionAmount || 0), 0);

    document.getElementById('pawnIncomeReturnedTotal').textContent = formatCurrency(returnedTotal);
    const returnedTableBody = document.getElementById('pawnIncomeReturnedTableBody');
    if (returnedPawns.length === 0) {
        returnedTableBody.innerHTML = '<tr><td colspan="4" class="empty-state">ไม่มีข้อมูล</td></tr>';
    } else {
        returnedTableBody.innerHTML = returnedPawns.map(pawn => {
            const returnDate = formatDate(pawn.return_date || pawn.returnDate);
            const deviceInfo = `${pawn.brand} ${pawn.model} (${pawn.color})`;
            const customerName = pawn.customer_name || pawn.customerName;
            const redemption = pawn.redemption_amount || pawn.redemptionAmount || 0;

            return `
                <tr>
                    <td>${returnDate}</td>
                    <td>${deviceInfo}</td>
                    <td>${customerName}</td>
                    <td class="income-text">${formatCurrency(redemption)}</td>
                </tr>
            `;
        }).join('');
    }

    // 3. การต่อดอก
    const renewalTransactions = pawnDetailData.interestTransactions.filter(t => t.transaction_type === 'renewal');
    const renewalTotal = renewalTransactions.reduce((sum, t) => sum + (parseFloat(t.interest_amount) || 0) + (parseFloat(t.late_fee) || 0), 0);

    document.getElementById('pawnIncomeRenewalTotal').textContent = formatCurrency(renewalTotal);
    const renewalTableBody = document.getElementById('pawnIncomeRenewalTableBody');
    if (renewalTransactions.length === 0) {
        renewalTableBody.innerHTML = '<tr><td colspan="5" class="empty-state">ไม่มีข้อมูล</td></tr>';
    } else {
        renewalTableBody.innerHTML = renewalTransactions.map(transaction => {
            const transactionDate = formatDate(transaction.transaction_date);
            const pawn = pawnDetailData.allPawns.find(p => p.id === transaction.pawn_id);
            const deviceInfo = pawn ? `${pawn.brand} ${pawn.model}` : 'N/A';
            const interest = parseFloat(transaction.interest_amount) || 0;
            const lateFee = parseFloat(transaction.late_fee) || 0;
            const total = interest + lateFee;

            return `
                <tr>
                    <td>${transactionDate}</td>
                    <td>${deviceInfo}</td>
                    <td class="income-text">${formatCurrency(interest)}</td>
                    <td class="income-text">${formatCurrency(lateFee)}</td>
                    <td class="income-text"><strong>${formatCurrency(total)}</strong></td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="deleteInterestTransaction(${transaction.id})">ลบ</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Update total income
    document.getElementById('pawnIncomeDetailTotal').textContent = formatCurrency(pawnDetailData.totalIncome);

    modal.style.display = 'block';
}

function closePawnIncomeDetailModal() {
    document.getElementById('pawnIncomeDetailModal').style.display = 'none';
}

// Show Pawn Profit Detail Modal
function showPawnProfitDetail() {
    const modal = document.getElementById('pawnProfitDetailModal');

    document.getElementById('pawnProfitDetailTotal').textContent = formatCurrency(pawnDetailData.totalProfit);
    document.getElementById('pawnProfitDetailIncome').textContent = formatCurrency(pawnDetailData.totalIncome);
    document.getElementById('pawnProfitDetailExpense').textContent = formatCurrency(pawnDetailData.totalExpense);
    document.getElementById('pawnProfitDetailResult').textContent = formatCurrency(pawnDetailData.totalProfit);

    modal.style.display = 'block';
}

function closePawnProfitDetailModal() {
    document.getElementById('pawnProfitDetailModal').style.display = 'none';
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
            const returnDate = pawn.return_date || pawn.returnDate;
            if (!returnDate) return false;
            const date = new Date(returnDate);
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
            const returnDate = pawn.return_date || pawn.returnDate;
            if (!returnDate) return false;
            const date = new Date(returnDate);
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
            const seizedDate = pawn.seized_date || pawn.seizedDate;
            if (!seizedDate) return false;
            const date = new Date(seizedDate);
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
            const seizedDate = pawn.seized_date || pawn.seizedDate;
            if (!seizedDate) return false;
            const date = new Date(seizedDate);
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

    // Update tab counts with filtered data
    updatePawnTabCounts({
        active: activePawns,
        returned: returnedPawns,
        seized: seizedPawns
    });
}

// Initialize date filter for pawn
function initializePawnDateFilter() {
    const monthSelect = document.getElementById('filterPawnMonth');
    const yearSelect = document.getElementById('filterPawnYear');

    console.log('🔄 Initializing Pawn date filter...', { monthSelect, yearSelect });

    if (!monthSelect || !yearSelect) {
        console.error('❌ Pawn filter elements not found');
        return;
    }

    // Clear existing options except the first one
    while (monthSelect.options.length > 1) {
        monthSelect.remove(1);
    }
    while (yearSelect.options.length > 1) {
        yearSelect.remove(1);
    }

    // Populate months
    const thaiMonthsShort = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    for (let i = 0; i < 12; i++) {
        const option = document.createElement('option');
        option.value = i + 1;
        option.textContent = thaiMonthsShort[i];
        monthSelect.appendChild(option);
    }

    // Populate years - แสดงเป็น ค.ศ.
    const currentYear = new Date().getFullYear(); // ค.ศ. ปัจจุบัน
    
    console.log(`📅 Current year: ${currentYear} (ค.ศ.)`);
    
    // สร้างตัวเลือกปี: ปีปัจจุบัน ถึงย้อนหลัง 3 ปี (2025, 2024, 2023, 2022)
    for (let year = currentYear; year >= currentYear - 3; year--) {
        const option = document.createElement('option');
        option.value = year; // ค.ศ.
        option.textContent = year; // แสดง ค.ศ.
        yearSelect.appendChild(option);
        
        console.log(`   ✅ Added year: ${year} (ค.ศ.)`);
    }

    console.log('✅ Pawn date filter initialized', {
        months: monthSelect.options.length,
        years: yearSelect.options.length
    });
}

// Filter pawn by date
async function filterPawnByDate() {
    const monthSelect = document.getElementById('filterPawnMonth');
    const yearSelect = document.getElementById('filterPawnYear');

    currentPawnFilter.month = monthSelect.value;
    currentPawnFilter.year = yearSelect.value;

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔍 [filterPawnByDate] START');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Dropdown Information:');
    console.log('   • Selected Month Index:', monthSelect.selectedIndex);
    console.log('   • Selected Month Text:', monthSelect.options[monthSelect.selectedIndex]?.text);
    console.log('   • Selected Month Value:', monthSelect.value);
    console.log('   • Selected Year Index:', yearSelect.selectedIndex);
    console.log('   • Selected Year Text:', yearSelect.options[yearSelect.selectedIndex]?.text);
    console.log('   • Selected Year Value:', yearSelect.value);
    console.log('   • All Year Options:', Array.from(yearSelect.options).map((opt, i) => ({
        index: i,
        text: opt.text,
        value: opt.value,
        selected: opt.selected
    })));
    console.log('Current Filter:', currentPawnFilter);
    console.log('Current Store:', currentStore);

    // โหลดข้อมูลจาก API
    const allPawns = await API.get(API_ENDPOINTS.pawn, { store: currentStore });
    const allPawnsInStore = allPawns;
    
    console.log(`📦 Loaded ${allPawns.length} pawns from API`);
    console.log('Pawns by status:', {
        active: allPawns.filter(p => p.status === 'active').length,
        returned: allPawns.filter(p => p.status === 'returned').length,
        seized: allPawns.filter(p => p.status === 'seized').length
    });

    // Active: Show current data always (no date filter for active)
    const activePawns = allPawnsInStore.filter(p => p.status === 'active');
    displayPawns(activePawns, 'pawnActiveTableBody', 'active');

    // Returned: Filter by return_date
    let returnedPawns = allPawnsInStore.filter(p => p.status === 'returned');

    if (currentPawnFilter.month || currentPawnFilter.year) {
        returnedPawns = returnedPawns.filter(pawn => {
            const returnDate = pawn.return_date || pawn.returnDate;
            if (!returnDate) return false;
            const date = new Date(returnDate);
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
            const returnDate = pawn.return_date || pawn.returnDate;
            if (!returnDate) return false;
            const date = new Date(returnDate);
            return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        });
    }

    displayPawns(returnedPawns, 'pawnReturnedTableBody', 'returned');

    console.log(`✅ Filtered Returned: ${returnedPawns.length} pawns`);

    // Seized: Filter by seized_date
    let seizedPawns = allPawnsInStore.filter(p => p.status === 'seized');

    if (currentPawnFilter.month || currentPawnFilter.year) {
        seizedPawns = seizedPawns.filter(pawn => {
            const seizedDate = pawn.seized_date || pawn.seizedDate;
            if (!seizedDate) return false;
            const date = new Date(seizedDate);
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
            const seizedDate = pawn.seized_date || pawn.seizedDate;
            if (!seizedDate) return false;
            const date = new Date(seizedDate);
            return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        });
    }

    displayPawns(seizedPawns, 'pawnSeizedTableBody', 'seized');
    
    console.log(`✅ Filtered Seized: ${seizedPawns.length} pawns`);
    console.log('');
    console.log('📊 Filter Result Summary:');
    console.log(`   • Active (no filter): ${activePawns.length}`);
    console.log(`   • Returned (filtered): ${returnedPawns.length}`);
    console.log(`   • Seized (filtered): ${seizedPawns.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Update tab counts with filtered data
    updatePawnTabCounts({
        active: activePawns,
        returned: returnedPawns,
        seized: seizedPawns
    });
    
    // Update dashboard cards with filtered data
    console.log('🔄 Calling updatePawnDashboard...');
    await updatePawnDashboard(allPawnsInStore);
    console.log('✅ [filterPawnByDate] COMPLETE');
}

// Clear pawn filter
async function clearPawnFilter() {
    document.getElementById('filterPawnMonth').value = '';
    document.getElementById('filterPawnYear').value = '';
    currentPawnFilter = { month: '', year: '' };
    await loadPawnData();
}

// Close pawn modal when clicking outside
window.addEventListener('click', function(event) {
    const pawnModal = document.getElementById('pawnModal');
    if (event.target === pawnModal) {
        closePawnModal();
    }
});

// ===== DATE FILTER FUNCTIONS =====

// Initialize date filter dropdowns for new devices
function initializeNewDevicesDateFilter() {
    const monthSelect = document.getElementById('filterNewDevicesMonth');
    const yearSelect = document.getElementById('filterNewDevicesYear');

    console.log('🔍 Initializing New Devices Date Filter...');
    console.log('Month Select Element:', monthSelect);
    console.log('Year Select Element:', yearSelect);

    if (!monthSelect || !yearSelect) {
        console.error('❌ filterNewDevicesMonth or filterNewDevicesYear not found!');
        return;
    }

    // Clear existing options except the first one (ทุกเดือน/ทุกปี)
    while (monthSelect.options.length > 1) {
        monthSelect.remove(1);
    }
    while (yearSelect.options.length > 1) {
        yearSelect.remove(1);
    }

    // Populate months
    const thaiMonthsShort = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    for (let i = 0; i < 12; i++) {
        const option = document.createElement('option');
        option.value = i + 1;
        option.textContent = thaiMonthsShort[i];
        monthSelect.appendChild(option);
    }
    console.log('✅ Added', thaiMonthsShort.length, 'months to dropdown');

    // Populate years - แสดงเป็น ค.ศ.
    const currentYear = new Date().getFullYear(); // ค.ศ.
    for (let year = currentYear; year >= currentYear - 3; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
    console.log('✅ Added years from', (currentYear - 3), 'to', currentYear, '(ค.ศ.)');
}

// Filter new devices by date range
function filterNewDevicesByDateRange() {
    const startDate = document.getElementById('filterNewDevicesStartDate').value;
    const endDate = document.getElementById('filterNewDevicesEndDate').value;

    currentNewDevicesFilter.startDate = startDate;
    currentNewDevicesFilter.endDate = endDate;

    console.log('🔍 Filtering New Devices:', currentNewDevicesFilter);
    applyNewDevicesFilter();
}

// Apply filter to new devices
async function applyNewDevicesFilter() {
    const searchInput = document.getElementById('searchNewDevices');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    console.log('🔍 [New Devices Filter] Search term:', searchTerm);

    try {
        // Get devices from API
        const allDevices = await API.get(API_ENDPOINTS.newDevices, { store: currentStore });
        
        console.log('📦 [New Devices Filter] Total devices:', allDevices.length);
        
        // Validate data
        if (!Array.isArray(allDevices)) {
            console.warn('API returned invalid data:', allDevices);
            return;
        }

        // Stock: Show current data always (no date filter)
        let stockDevices = allDevices.filter(d => d.status === 'stock');
        
        console.log('📦 [New Devices Filter] Stock devices before search:', stockDevices.length);

    // Apply search filter for stock
    if (searchTerm) {
        stockDevices = stockDevices.filter(device => {
            return device.brand.toLowerCase().includes(searchTerm) ||
                   device.model.toLowerCase().includes(searchTerm) ||
                   device.color.toLowerCase().includes(searchTerm) ||
                   device.imei.toLowerCase().includes(searchTerm) ||
                   (device.ram + '/' + device.rom).includes(searchTerm);
        });
        console.log('🔍 [New Devices Filter] Stock devices after search:', stockDevices.length);
    }

        // Sold: Filter by saleDate based on selected date range
        let soldDevices = allDevices.filter(d => d.status === 'sold');

    // Apply date range filter for sold devices
    if (currentNewDevicesFilter.startDate || currentNewDevicesFilter.endDate) {
        soldDevices = soldDevices.filter(device => {
            const saleDate = device.sale_date || device.saleDate;
            if (!saleDate) return false;
            
            const date = new Date(saleDate);
            const startMatch = !currentNewDevicesFilter.startDate || date >= new Date(currentNewDevicesFilter.startDate);
            const endMatch = !currentNewDevicesFilter.endDate || date <= new Date(currentNewDevicesFilter.endDate);

            return startMatch && endMatch;
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
                   (device.ram + '/' + device.rom).includes(searchTerm);
        });
    }

        // Removed: Filter by saleDate based on selected date range
        let removedDevices = allDevices.filter(d => d.status === 'removed');

    // Apply date range filter for removed devices
    if (currentNewDevicesFilter.startDate || currentNewDevicesFilter.endDate) {
        removedDevices = removedDevices.filter(device => {
            const saleDate = device.sale_date || device.saleDate;
            if (!saleDate) return false;
            
            const date = new Date(saleDate);
            const startMatch = !currentNewDevicesFilter.startDate || date >= new Date(currentNewDevicesFilter.startDate);
            const endMatch = !currentNewDevicesFilter.endDate || date <= new Date(currentNewDevicesFilter.endDate);

            return startMatch && endMatch;
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
                   (device.ram + '/' + device.rom).includes(searchTerm);
        });
    }

        // Sort by import date (latest first)
        stockDevices.sort((a, b) => {
            const dateA = new Date(a.import_date || a.importDate);
            const dateB = new Date(b.import_date || b.importDate);
            return dateB - dateA; // Latest first
        });

        soldDevices.sort((a, b) => {
            const dateA = new Date(a.sale_date || a.saleDate);
            const dateB = new Date(b.sale_date || b.saleDate);
            return dateB - dateA; // Latest first
        });

        removedDevices.sort((a, b) => {
            const dateA = new Date(a.sale_date || a.saleDate);
            const dateB = new Date(b.sale_date || b.saleDate);
            return dateB - dateA; // Latest first
        });

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

        // Update Dashboard Cards
        const stockCount = document.getElementById('newDevicesStockCount');
        const expense = document.getElementById('newDevicesExpense');
        const income = document.getElementById('newDevicesIncome');
        const profit = document.getElementById('newDevicesProfit');

        if (stockCount) stockCount.textContent = stockDevices.length;

        // Calculate expense (total purchase price of ALL devices imported in the selected date range)
        // Filter all devices by import_date for the current/selected date range
        let expenseDevices = allDevices;
        
        if (currentNewDevicesFilter.startDate || currentNewDevicesFilter.endDate) {
            // Use date range filter
            expenseDevices = allDevices.filter(device => {
                const importDate = new Date(device.import_date || device.importDate);
                const startMatch = !currentNewDevicesFilter.startDate || importDate >= new Date(currentNewDevicesFilter.startDate);
                const endMatch = !currentNewDevicesFilter.endDate || importDate <= new Date(currentNewDevicesFilter.endDate);
                
                return startMatch && endMatch;
            });
        } else {
            // Use current month/year
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1;
            const currentYear = currentDate.getFullYear();
            
            expenseDevices = allDevices.filter(device => {
                const importDate = new Date(device.import_date || device.importDate);
                const deviceMonth = importDate.getMonth() + 1;
                const deviceYear = importDate.getFullYear();
                
                return deviceMonth === currentMonth && deviceYear === currentYear;
            });
        }
        
        const totalExpense = expenseDevices.reduce((sum, device) => {
            const purchasePrice = parseFloat(device.purchase_price || device.purchasePrice || 0);
            return sum + purchasePrice;
        }, 0);
        
        if (expense) expense.textContent = formatCurrency(totalExpense);

        // Calculate income (total sale price of sold devices)
        const totalIncome = soldDevices.reduce((sum, device) => {
            const salePrice = parseFloat(device.sale_price || device.salePrice || 0);
            return sum + salePrice;
        }, 0);
        
        if (income) income.textContent = formatCurrency(totalIncome);

        // Calculate profit (income - expense for sold devices)
        const soldDevicesExpense = soldDevices.reduce((sum, device) => {
            const purchasePrice = parseFloat(device.purchase_price || device.purchasePrice || 0);
            return sum + purchasePrice;
        }, 0);
        const totalProfit = totalIncome - soldDevicesExpense;
        
        if (profit) profit.textContent = formatCurrency(totalProfit);

    } catch (error) {
        console.error('Error loading new devices:', error);
        console.error('Error details:', error.message);
        // Display empty tables instead of alert
        displayDevices([], 'stockTableBody', 'stock');
        displayDevices([], 'soldTableBody', 'sold');
        displayDevices([], 'removedTableBody', 'removed');
    }
}

// Clear new devices filter
function clearNewDevicesFilter() {
    const startDateInput = document.getElementById('filterNewDevicesStartDate');
    const endDateInput = document.getElementById('filterNewDevicesEndDate');
    const searchInput = document.getElementById('searchNewDevices');
    
    if (startDateInput) startDateInput.value = '';
    if (endDateInput) endDateInput.value = '';
    if (searchInput) searchInput.value = '';
    
    currentNewDevicesFilter = { startDate: '', endDate: '' };
    applyNewDevicesFilter();
}

// Initialize date filter dropdowns for used devices
function initializeUsedDevicesDateFilter() {
    const monthSelect = document.getElementById('filterUsedDevicesMonth');
    const yearSelect = document.getElementById('filterUsedDevicesYear');

    if (!monthSelect || !yearSelect) return;

    // Clear existing options except the first one (ทุกเดือน/ทุกปี)
    while (monthSelect.options.length > 1) {
        monthSelect.remove(1);
    }
    while (yearSelect.options.length > 1) {
        yearSelect.remove(1);
    }

    // Populate months
    const thaiMonthsShort = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    for (let i = 0; i < 12; i++) {
        const option = document.createElement('option');
        option.value = i + 1;
        option.textContent = thaiMonthsShort[i];
        monthSelect.appendChild(option);
    }

    // Populate years - แสดงเป็น ค.ศ.
    const currentYear = new Date().getFullYear(); // ค.ศ.
    for (let year = currentYear; year >= currentYear - 3; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

// Filter used devices by date
function filterUsedDevicesByDateRange() {
    const startDate = document.getElementById('filterUsedDevicesStartDate').value;
    const endDate = document.getElementById('filterUsedDevicesEndDate').value;

    currentUsedDevicesFilter.startDate = startDate;
    currentUsedDevicesFilter.endDate = endDate;

    console.log('🔍 Filtering Used Devices:', currentUsedDevicesFilter);
    applyUsedDevicesFilter();
}

// Apply filter to used devices
async function applyUsedDevicesFilter() {
    const searchTerm = document.getElementById('searchUsedDevices').value.toLowerCase();

    try {
        // Get devices from API
        const allDevices = await API.get(API_ENDPOINTS.usedDevices, { store: currentStore });
        
        // Validate data
        if (!Array.isArray(allDevices)) {
            console.warn('API returned invalid data:', allDevices);
            return;
        }

        // Stock: Show current data always (no date filter)
        let stockDevices = allDevices.filter(d => d.status === 'stock');

        // Apply search filter for stock
        if (searchTerm) {
            stockDevices = stockDevices.filter(device => {
                const condition = device.device_condition || device.deviceCondition || device.condition || '';
                return device.brand.toLowerCase().includes(searchTerm) ||
                       device.model.toLowerCase().includes(searchTerm) ||
                       device.color.toLowerCase().includes(searchTerm) ||
                       device.imei.toLowerCase().includes(searchTerm) ||
                       condition.toLowerCase().includes(searchTerm) ||
                       (device.ram + '/' + device.rom).includes(searchTerm);
            });
        }

        // Sold: Filter by saleDate based on selected month/year
        let soldDevices = allDevices.filter(d => d.status === 'sold');

        // Apply date range filter for sold devices
        if (currentUsedDevicesFilter.startDate || currentUsedDevicesFilter.endDate) {
            soldDevices = soldDevices.filter(device => {
                const saleDate = device.sale_date || device.saleDate;
                if (!saleDate) return false;
                
                const date = new Date(saleDate);
                const startMatch = !currentUsedDevicesFilter.startDate || date >= new Date(currentUsedDevicesFilter.startDate);
                const endMatch = !currentUsedDevicesFilter.endDate || date <= new Date(currentUsedDevicesFilter.endDate);

                return startMatch && endMatch;
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
                const condition = device.device_condition || device.deviceCondition || device.condition || '';
                return device.brand.toLowerCase().includes(searchTerm) ||
                       device.model.toLowerCase().includes(searchTerm) ||
                       device.color.toLowerCase().includes(searchTerm) ||
                       device.imei.toLowerCase().includes(searchTerm) ||
                       condition.toLowerCase().includes(searchTerm) ||
                       (device.ram + '/' + device.rom).includes(searchTerm);
            });
        }

        // Removed: Filter by saleDate based on selected month/year
        let removedDevices = allDevices.filter(d => d.status === 'removed');

        // Apply date range filter for removed devices
        if (currentUsedDevicesFilter.startDate || currentUsedDevicesFilter.endDate) {
            removedDevices = removedDevices.filter(device => {
                const saleDate = device.sale_date || device.saleDate;
                if (!saleDate) return false;
                
                const date = new Date(saleDate);
                const startMatch = !currentUsedDevicesFilter.startDate || date >= new Date(currentUsedDevicesFilter.startDate);
                const endMatch = !currentUsedDevicesFilter.endDate || date <= new Date(currentUsedDevicesFilter.endDate);

                return startMatch && endMatch;
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
                const condition = device.device_condition || device.deviceCondition || device.condition || '';
                return device.brand.toLowerCase().includes(searchTerm) ||
                       device.model.toLowerCase().includes(searchTerm) ||
                       device.color.toLowerCase().includes(searchTerm) ||
                       device.imei.toLowerCase().includes(searchTerm) ||
                       condition.toLowerCase().includes(searchTerm) ||
                       (device.ram + '/' + device.rom).includes(searchTerm);
            });
        }

        // Sort by import_date (newest first) - เรียงวันที่รับซื้อล่าสุดไว้บนสุด
        stockDevices.sort((a, b) => {
            const dateA = new Date(a.import_date || a.purchase_date || a.purchaseDate || 0);
            const dateB = new Date(b.import_date || b.purchase_date || b.purchaseDate || 0);
            return dateB - dateA; // Descending order (newest first)
        });

        soldDevices.sort((a, b) => {
            const dateA = new Date(a.sale_date || a.saleDate || 0);
            const dateB = new Date(b.sale_date || b.saleDate || 0);
            return dateB - dateA; // Descending order (newest first)
        });

        removedDevices.sort((a, b) => {
            const dateA = new Date(a.sale_date || a.saleDate || 0);
            const dateB = new Date(b.sale_date || b.saleDate || 0);
            return dateB - dateA; // Descending order (newest first)
        });

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

        // Update dashboard cards for used devices page
        const usedStockCountElement = document.getElementById('usedDevicesStockCount');
        const usedExpenseElement = document.getElementById('usedDevicesExpense');
        const usedIncomeElement = document.getElementById('usedDevicesIncome');
        const usedProfitElement = document.getElementById('usedDevicesProfit');

        if (usedStockCountElement) {
            usedStockCountElement.textContent = stockDevices.length;
        }

        // Calculate expense (total purchase price of STOCK devices only - ไม่นับเครื่องที่ขายแล้วหรือตัดแล้ว)
        // Filter stock devices by import_date for the current/selected date range
        let expenseDevices = stockDevices; // เปลี่ยนจาก allDevices เป็น stockDevices

        if (currentUsedDevicesFilter.startDate || currentUsedDevicesFilter.endDate) {
            // Use date range filter
            expenseDevices = stockDevices.filter(device => {
                const importDate = new Date(device.import_date || device.importDate || device.purchase_date || device.purchaseDate);
                const startMatch = !currentUsedDevicesFilter.startDate || importDate >= new Date(currentUsedDevicesFilter.startDate);
                const endMatch = !currentUsedDevicesFilter.endDate || importDate <= new Date(currentUsedDevicesFilter.endDate);

                return startMatch && endMatch;
            });
        } else {
            // Use current month/year
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1;
            const currentYear = currentDate.getFullYear();

            expenseDevices = stockDevices.filter(device => {
                const importDate = new Date(device.import_date || device.importDate || device.purchase_date || device.purchaseDate);
                const deviceMonth = importDate.getMonth() + 1;
                const deviceYear = importDate.getFullYear();

                return deviceMonth === currentMonth && deviceYear === currentYear;
            });
        }

        const totalExpense = expenseDevices.reduce((sum, device) => {
            const purchasePrice = parseFloat(device.purchase_price || device.purchasePrice || 0);
            return sum + purchasePrice;
        }, 0);

        // Calculate income (total sale price of sold devices)
        const totalIncome = soldDevices.reduce((sum, device) => {
            const salePrice = parseFloat(device.sale_price || device.salePrice || 0);
            return sum + salePrice;
        }, 0);

        // Calculate profit (income - expense for sold devices)
        const soldDevicesExpense = soldDevices.reduce((sum, device) => {
            const purchasePrice = parseFloat(device.purchase_price || device.purchasePrice || 0);
            return sum + purchasePrice;
        }, 0);
        const totalProfit = totalIncome - soldDevicesExpense;

        if (usedExpenseElement) {
            usedExpenseElement.textContent = formatCurrency(totalExpense);
        }
        if (usedIncomeElement) {
            usedIncomeElement.textContent = formatCurrency(totalIncome);
        }
        if (usedProfitElement) {
            usedProfitElement.textContent = formatCurrency(totalProfit);
        }
    } catch (error) {
        console.error('Error loading used devices:', error);
        console.error('Error details:', error.message);
        // Display empty tables instead of alert
        displayUsedDevices([], 'usedStockTableBody', 'stock');
        displayUsedDevices([], 'usedSoldTableBody', 'sold');
        displayUsedDevices([], 'usedRemovedTableBody', 'removed');
    }
}

// Clear used devices filter
function clearUsedDevicesFilter() {
    const startDateInput = document.getElementById('filterUsedDevicesStartDate');
    const endDateInput = document.getElementById('filterUsedDevicesEndDate');
    const searchInput = document.getElementById('searchUsedDevices');
    
    if (startDateInput) startDateInput.value = '';
    if (endDateInput) endDateInput.value = '';
    if (searchInput) searchInput.value = '';
    
    currentUsedDevicesFilter = { startDate: '', endDate: '' };
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
    console.log('🚀 Application starting...');

    initializeNewDevicesDatabase();
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

    console.log('🔧 Initializing date filters...');
    setTimeout(() => {
        // Removed old month/year dropdown initializers - now using date range inputs
        // initializeNewDevicesDateFilter();
        // initializeUsedDevicesDateFilter();
    initializeRepairDateFilter();
    initializeInstallmentDateFilter();
        // initializePawnDateFilter();
    initializeAccessoryDateFilter();
        // initializeEquipmentDateFilter();
        console.log('✅ Date filters initialized (date range inputs)');
    }, 500); // เพิ่มเวลา delay เป็น 500ms

    updateStoreToggleButtons();
    initializeExpenseMonthSelector();
    loadExpenseData();
    initializeExpenseCardClicks();

    console.log('✅ Application loaded successfully');
});

// Close modal when clicking outside of it
window.onclick = function(event) {
    // Return Pawn Modal
    const returnPawnModal = document.getElementById('returnPawnModal');
    if (event.target === returnPawnModal) {
        closeReturnPawnModal();
    }

    // Used Devices Expense Detail Modal
    const usedDevicesExpenseDetailModal = document.getElementById('usedDevicesExpenseDetailModal');
    if (event.target === usedDevicesExpenseDetailModal) {
        closeUsedDevicesExpenseDetailModal();
    }

    // Used Devices Income Detail Modal
    const usedDevicesIncomeDetailModal = document.getElementById('usedDevicesIncomeDetailModal');
    if (event.target === usedDevicesIncomeDetailModal) {
        closeUsedDevicesIncomeDetailModal();
    }

    // Used Devices Profit Detail Modal
    const usedDevicesProfitDetailModal = document.getElementById('usedDevicesProfitDetailModal');
    if (event.target === usedDevicesProfitDetailModal) {
        closeUsedDevicesProfitDetailModal();
    }

    // New Devices Expense Detail Modal
    const newDevicesExpenseDetailModal = document.getElementById('newDevicesExpenseDetailModal');
    if (event.target === newDevicesExpenseDetailModal) {
        closeNewDevicesExpenseDetailModal();
    }

    // New Devices Income Detail Modal
    const newDevicesIncomeDetailModal = document.getElementById('newDevicesIncomeDetailModal');
    if (event.target === newDevicesIncomeDetailModal) {
        closeNewDevicesIncomeDetailModal();
    }

    // New Devices Profit Detail Modal
    const newDevicesProfitDetailModal = document.getElementById('newDevicesProfitDetailModal');
    if (event.target === newDevicesProfitDetailModal) {
        closeNewDevicesProfitDetailModal();
    }

    // Other existing modals can be handled here as needed
};

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
            document.getElementById('purchasedFrom').value = device.purchased_from || '';
            document.getElementById('deviceCategory').value = device.device_category || 'No Active';
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
        purchased_from: formData.get('purchasedFrom') || '',
        device_category: formData.get('deviceCategory') || 'No Active',
        purchase_price: parseFloat(formData.get('purchasePrice')),
        import_date: formData.get('importDate'),
        sale_price: parseFloat(formData.get('salePrice')),
        sale_date: formData.get('saleDate') || null,
        status: formData.get('status'),
        note: formData.get('note') || '',
        store: currentStore
    };

    // 🛡️ ตรวจสอบความขัดแย้งระหว่างสถานะและหมายเหตุ
    if (deviceData.status === 'sold' && deviceData.note) {
        const hasConflict = deviceData.note.includes('ตัดสลับ') || 
                           deviceData.note.includes('โอน') || 
                           deviceData.note.includes('ย้าย');
        
        if (hasConflict) {
            await customAlert({
                title: '⚠️ ข้อมูลขัดแย้ง',
                message: 'ไม่สามารถบันทึกการขายพร้อมกับหมายเหตุการโอนสต็อกได้\n\n' +
                        'กรุณาเลือกอย่างใดอย่างหนึ่ง:\n' +
                        '• สถานะ "ขายแล้ว" (sold) - ถ้าสินค้าถูกขายจริง\n' +
                        '• สถานะ "ตัดออก" (removed) + หมายเหตุ "ตัดสลับ/โอน" - ถ้าสินค้าโอนไปร้านอื่น',
                icon: 'error'
            });
            return; // หยุดการบันทึก
        }
    }

    // ตรวจสอบการ removed พร้อมกับหมายเหตุขาย
    if (deviceData.status === 'removed' && deviceData.note) {
        const hasConflict = deviceData.note.includes('ขาย') || deviceData.note.includes('sold');
        
        if (hasConflict) {
            await customAlert({
                title: '⚠️ ข้อมูลขัดแย้ง',
                message: 'ไม่สามารถบันทึกการโอนสต็อกพร้อมกับหมายเหตุการขายได้',
                icon: 'error'
            });
            return; // หยุดการบันทึก
        }
    }

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
        console.error('Error saving device:', error);

        // Check if it's a duplicate IMEI error
        if (error.duplicate || (error.message && error.message.includes('IMEI'))) {
            await customAlert({
                title: '❌ IMEI ซ้ำ',
                message: `IMEI "${deviceData.imei}" มีอยู่ในระบบแล้ว\n\nกรุณาตรวจสอบ IMEI อีกครั้ง หรือตรวจสอบว่าเครื่องนี้ถูกบันทึกไปแล้วหรือไม่`,
                icon: 'error'
            });
        } 
        // ตรวจสอบข้อผิดพลาดจากความขัดแย้ง
        else if (error.conflict || (error.message && error.message.includes('ขัดแย้ง'))) {
            await customAlert({
                title: '⚠️ ข้อมูลขัดแย้ง',
                message: error.message || 'พบความขัดแย้งในข้อมูลที่บันทึก',
                icon: 'error'
            });
        }
        else {
            await customAlert({
                title: 'เกิดข้อผิดพลาด',
                message: 'ไม่สามารถบันทึกข้อมูลได้: ' + error.message,
                icon: 'error'
            });
        }
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
        const colspan = type === 'stock' ? '9' : (type === 'sold' ? '11' : '10');
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
            const note = device.note || '-';
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
                    <td>${note}</td>
                    <td>
                        <button class="action-btn btn-warning" onclick="moveBackToStock('${device.id}')" title="ป้องกันการกดผิด">↩ ย้ายกลับสต๊อค</button>
                        <button class="action-btn btn-edit" onclick="openNewDeviceModal('${device.id}')">แก้ไข</button>
                        <button class="action-btn btn-delete" onclick="deleteDevice('${device.id}')">ลบ</button>
                    </td>
                </tr>
            `;
        } else {
            // Removed tab - แสดงราคาขายและกำไร/ขาดทุน
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
                    <td>${device.note || '-'}</td>
                    <td>
                        <button class="action-btn btn-warning" onclick="moveBackToStock('${device.id}')" title="ป้องกันการกดผิด">↩ ย้ายกลับสต๊อค</button>
                        <button class="action-btn btn-edit" onclick="openNewDeviceModal('${device.id}')">แก้ไข</button>
                        <button class="action-btn btn-delete" onclick="deleteDevice('${device.id}')">ลบ</button>
                    </td>
                </tr>
            `;
        }
    }).join('');
}

// Mark device as sold - Open confirmation modal
async function markAsSold(deviceId) {
    try {
        // ดึงข้อมูลเครื่อง
        const device = await API.get(`${API_ENDPOINTS.newDevices}/${deviceId}`);
        if (!device) {
            await customAlert({
                title: 'ไม่พบข้อมูล',
                message: 'ไม่พบข้อมูลเครื่อง',
                icon: 'error',
                confirmType: 'danger'
            });
            return;
        }

        // เก็บข้อมูลเครื่องไว้ใช้
        window.currentSaleDevice = device;

        // แสดงข้อมูลใน Modal
        const deviceInfo = `${device.brand} ${device.model} (${device.color})`;
        const purchasePrice = parseFloat(device.purchase_price || device.purchasePrice || 0);
        const originalSalePrice = parseFloat(device.sale_price || device.salePrice || 0);

        document.getElementById('saleDeviceInfo').textContent = deviceInfo;
        document.getElementById('salePurchasePrice').textContent = formatCurrency(purchasePrice);
        document.getElementById('saleOriginalPrice').textContent = formatCurrency(originalSalePrice);
        document.getElementById('actualSalePrice').value = originalSalePrice;
        document.getElementById('saleDeviceId').value = deviceId;
        
        // ตั้งค่าวันที่เป็นวันปัจจุบัน
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('saleDateInput').value = today;

        // คำนวณกำไรเริ่มต้น
        updateSaleProfit(originalSalePrice, purchasePrice);

        // เพิ่ม event listener สำหรับคำนวณกำไรแบบ real-time
        const priceInput = document.getElementById('actualSalePrice');
        priceInput.oninput = function() {
            const salePrice = parseFloat(this.value) || 0;
            updateSaleProfit(salePrice, purchasePrice);
        };

        // แสดง Modal
        document.getElementById('confirmSalePriceModal').style.display = 'block';

    } catch (error) {
        alert('เกิดข้อผิดพลาด: ' + error.message);
        console.error(error);
    }
}

// Update sale profit display
function updateSaleProfit(salePrice, purchasePrice) {
    const profit = salePrice - purchasePrice;
    const profitPercent = purchasePrice > 0 ? ((profit / purchasePrice) * 100).toFixed(2) : 0;

    const profitElement = document.getElementById('saleProfit');
    const percentElement = document.getElementById('saleProfitPercent');

    profitElement.textContent = formatCurrency(profit);
    percentElement.textContent = `${profitPercent}%`;

    // เปลี่ยนสีตามกำไร/ขาดทุน
    if (profit > 0) {
        profitElement.className = 'profit-value profit-text';
        percentElement.style.color = '#4CAF50';
    } else if (profit < 0) {
        profitElement.className = 'profit-value expense-text';
        percentElement.style.color = '#f44336';
    } else {
        profitElement.className = 'profit-value';
        percentElement.style.color = '#666';
    }
}

// Close sale price confirmation modal
function closeConfirmSalePriceModal() {
    document.getElementById('confirmSalePriceModal').style.display = 'none';
    document.getElementById('confirmSalePriceForm').reset();
    window.currentSaleDevice = null;
}

// Confirm and save sale price
async function confirmSalePrice(event) {
    event.preventDefault();

    const deviceId = document.getElementById('saleDeviceId').value;
    const salePrice = parseFloat(document.getElementById('actualSalePrice').value);
    const saleDate = document.getElementById('saleDateInput').value; // อ่านวันที่จาก input
    const deviceType = window.currentSaleDeviceType || 'new'; // ดูว่าเป็นเครื่องใหม่หรือมือสอง

    if (isNaN(salePrice) || salePrice < 0) {
        await customAlert({
            title: 'ข้อมูลไม่ครบถ้วน',
            message: 'กรุณากรอกราคาขายที่ถูกต้อง',
            icon: 'warning',
            confirmType: 'warning'
        });
        return;
    }

    if (!saleDate) {
        await customAlert({
            title: 'ข้อมูลไม่ครบถ้วน',
            message: 'กรุณาเลือกวันที่ขาย',
            icon: 'warning',
            confirmType: 'warning'
        });
        return;
    }

    try {
        // บันทึกการขาย (รองรับทั้งเครื่องใหม่และมือสอง)
        const endpoint = deviceType === 'used' ? API_ENDPOINTS.usedDevices : API_ENDPOINTS.newDevices;
        
        await API.put(`${endpoint}/${deviceId}`, {
                status: 'sold',
            sale_price: salePrice,
            sale_date: saleDate // ใช้วันที่ที่เลือก
        });

        closeConfirmSalePriceModal();
        
        // แสดงข้อความสำเร็จ
        await customAlert({
            title: 'สำเร็จ',
            message: `บันทึกการขายสำเร็จ (${formatCurrency(salePrice)})`,
            icon: 'success',
            confirmType: 'success'
        });
        
        // โหลดข้อมูลตามประเภท
        if (deviceType === 'used') {
            await applyUsedDevicesFilter();
        } else {
            await applyNewDevicesFilter();
        }

        // Clear device type
        window.currentSaleDeviceType = null;

    } catch (error) {
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: error.message,
            icon: 'error',
            confirmType: 'danger'
        });
        console.error(error);
    }
}

// Move sold device back to stock (ป้องกันการกดผิด)
async function moveBackToStock(deviceId) {
    const confirmed = await customConfirm({
        title: 'ย้ายกลับสต๊อค',
        message: 'ต้องการย้ายรายการนี้กลับไปสต๊อคใช่หรือไม่?',
        icon: 'question',
        confirmText: 'ย้ายกลับสต๊อค',
        cancelText: 'ยกเลิก',
        confirmType: 'primary',
        list: [
            { icon: 'info', iconSymbol: '↩️', text: 'เครื่องจะกลับไปอยู่ใน Tab "สต๊อค"' },
            { icon: 'info', iconSymbol: 'ℹ️', text: 'ข้อมูลการขายจะถูกลบ' }
        ]
    });

    if (!confirmed) return;

    try {
        await API.put(`${API_ENDPOINTS.newDevices}/${deviceId}`, {
            status: 'stock',
            sale_price: null,
            sale_date: null
            });
            loadNewDevicesData();
        showNotification('ย้ายกลับสต๊อคสำเร็จ');
        } catch (error) {
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: error.message,
            icon: 'error',
            confirmType: 'danger'
        });
            console.error(error);
        }
    }

// Move used device back to stock (ป้องกันการกดผิด - สำหรับเครื่องมือสอง)
async function moveUsedBackToStock(deviceId) {
    const confirmed = await customConfirm({
        title: 'ย้ายกลับสต๊อค',
        message: 'ต้องการย้ายรายการนี้กลับไปสต๊อคใช่หรือไม่?',
        icon: 'question',
        confirmText: 'ย้ายกลับสต๊อค',
        cancelText: 'ยกเลิก',
        confirmType: 'primary',
        list: [
            { icon: 'info', iconSymbol: '↩️', text: 'เครื่องจะกลับไปอยู่ใน Tab "สต๊อค"' },
            { icon: 'info', iconSymbol: 'ℹ️', text: 'ข้อมูลการขาย/ตัดจะถูกลบ' }
        ]
    });

    if (!confirmed) return;

    try {
        await API.put(`${API_ENDPOINTS.usedDevices}/${deviceId}`, {
            status: 'stock',
            sale_price: null,
            sale_date: null,
            note: ''
        });
        
        await customAlert({
            title: 'สำเร็จ',
            message: 'ย้ายกลับสต๊อคสำเร็จ',
            icon: 'success',
            confirmType: 'success'
        });
        
        await applyUsedDevicesFilter();
    } catch (error) {
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: error.message,
            icon: 'error',
            confirmType: 'danger'
        });
        console.error(error);
    }
}

// Mark device as removed - Open selection modal
async function markAsRemoved(deviceId) {
    try {
        const device = await API.get(`${API_ENDPOINTS.newDevices}/${deviceId}`);
        if (!device) {
            await customAlert({
                title: 'ไม่พบข้อมูล',
                message: 'ไม่พบข้อมูลเครื่อง',
                icon: 'error',
                confirmType: 'danger'
            });
            return;
        }

        // เก็บข้อมูลเครื่องไว้ใช้
        window.currentRemoveDevice = device;

        // แสดงข้อมูลใน Modal
        const deviceInfo = `${device.brand} ${device.model} (${device.color})`;
        const purchasePrice = parseFloat(device.purchase_price || device.purchasePrice || 0);
        const originalSalePrice = parseFloat(device.sale_price || device.salePrice || 0);

        document.getElementById('removeDeviceInfo').textContent = deviceInfo;
        document.getElementById('removePurchasePrice').textContent = formatCurrency(purchasePrice);
        document.getElementById('removeOriginalPrice').textContent = formatCurrency(originalSalePrice);
        document.getElementById('removeDeviceId').value = deviceId;

        // แสดงชื่อร้านปลายทาง
        const otherStore = device.store === 'salaya' ? 'klongyong' : 'salaya';
        const otherStoreName = stores[otherStore];
        document.getElementById('transferStoreName').textContent = `ย้ายไป: ${otherStoreName}`;

        // แสดง Modal
        document.getElementById('confirmRemoveModal').style.display = 'block';

    } catch (error) {
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: error.message,
            icon: 'error',
            confirmType: 'danger'
        });
        console.error(error);
    }
}

// Close remove modal
function closeConfirmRemoveModal() {
    document.getElementById('confirmRemoveModal').style.display = 'none';
    window.currentRemoveDevice = null;
}

// Select remove option
async function selectRemoveOption(option) {
    const device = window.currentRemoveDevice;
    const deviceId = document.getElementById('removeDeviceId').value;

    if (!device) {
        await customAlert({
            title: 'ไม่พบข้อมูล',
            message: 'ไม่พบข้อมูลเครื่อง',
            icon: 'error',
            confirmType: 'danger'
        });
        return;
    }

    closeConfirmRemoveModal();

    if (option === 'other') {
        // ตัดขายให้เจ้าอื่น - แสดง Modal แก้ไขราคา
        openConfirmRemoveOtherModal(device, deviceId);
    } else if (option === 'transfer') {
        // ตัดสลับไปร้านตัวเอง - ย้ายข้อมูลและสต๊อคไปร้านอื่นทั้งหมด
        confirmTransferToOtherStore(device, deviceId);
    }
}

// Confirm transfer to other store (บันทึกในตัดออก + สร้างใหม่ในร้านปลายทาง)
async function confirmTransferToOtherStore(device, deviceId) {
    try {
        const deviceType = window.currentRemoveDeviceType || 'new';
            const otherStore = device.store === 'salaya' ? 'klongyong' : 'salaya';
            const otherStoreName = stores[otherStore];
        const currentStoreName = stores[device.store];

        // ขั้นตอนที่ 1: ให้เลือกวันที่ทำรายการ (รองรับรายการย้อนหลัง)
        const transactionDate = await promptTransactionDate('remove'); // ใช้ 'remove' สำหรับการตัด
        if (!transactionDate) {
            return; // ยกเลิก
        }

        console.log('📅 Selected transaction date:', transactionDate);

        // ขั้นตอนที่ 2: ยืนยันการตัดสลับ
        const confirmed = await customConfirm({
            title: 'ตัดสลับเครื่องไปร้านอื่น',
            message: `${device.brand} ${device.model} (${device.color})`,
            icon: 'question',
            confirmText: 'ยืนยัน',
            cancelText: 'ยกเลิก',
            confirmType: 'success',
            list: [
                {
                    icon: 'check',
                    iconSymbol: '✓',
                    text: `ร้าน${currentStoreName}: บันทึกใน "ตัดออก"`
                },
                {
                    icon: 'check',
                    iconSymbol: '✓',
                    text: `ร้าน${otherStoreName}: เพิ่มใน "สต๊อค"`
                },
                {
                    icon: 'check',
                    iconSymbol: '✓',
                    text: 'ราคาทุนและราคาขายยังคงเดิม'
                },
                {
                    icon: 'info',
                    iconSymbol: '💡',
                    text: 'สามารถเช็คได้ทั้ง 2 ร้าน'
                }
            ]
        });

        if (confirmed) {
            const endpoint = deviceType === 'used' ? API_ENDPOINTS.usedDevices : API_ENDPOINTS.newDevices;
            
            // ขั้นตอนที่ 3: เครื่องเดิม (ร้านต้นทาง) → เปลี่ยนเป็น 'removed'
            await API.put(`${endpoint}/${deviceId}`, {
                status: 'removed',
                sale_date: transactionDate, // ใช้วันที่ที่เลือก
                note: `ตัดสลับไปร้าน${otherStoreName}`
            });

            // ขั้นตอนที่ 2: สร้างเครื่องใหม่ในร้านปลายทาง
            const newDeviceData = {
                id: (deviceType === 'used' ? 'U' : 'N') + Date.now().toString(),
                brand: device.brand,
                model: device.model,
                color: device.color,
                imei: device.imei.substring(0, 10) + 'T' + Date.now().toString().slice(-4), // จำกัดความยาว IMEI
                ram: device.ram,
                rom: device.rom,
                purchased_from: device.purchased_from || device.purchasedFrom || '',
                device_category: device.device_category || device.deviceCategory || 'No Active',
                purchase_price: device.purchase_price || device.purchasePrice,
                import_date: device.import_date || device.importDate || device.purchase_date || device.purchaseDate,
                sale_price: device.sale_price || device.salePrice,
                sale_date: null,
                status: 'stock',
                note: `รับโอนจากร้าน${currentStoreName} (เดิม ID: ${deviceId})`,
                    store: otherStore
            };

            // ถ้าเป็นเครื่องมือสอง เพิ่มฟิลด์ device_condition
            if (deviceType === 'used') {
                newDeviceData.device_condition = device.device_condition || device.condition || 'good';
            }

            await API.post(endpoint, newDeviceData);
            
            // แสดงข้อความสำเร็จ
            await customAlert({
                title: 'สำเร็จ',
                message: `ตัดสลับสำเร็จ!\n\nร้าน${currentStoreName}: บันทึกใน "ตัดออก"\nร้าน${otherStoreName}: เพิ่มใน "สต๊อค"`,
                icon: 'success',
                confirmType: 'success'
            });
            
            // โหลดข้อมูลตามประเภท
            if (deviceType === 'used') {
                await applyUsedDevicesFilter();
            } else {
                await applyNewDevicesFilter();
            }
            
            // Clear device type
            window.currentRemoveDeviceType = null;
        }
    } catch (error) {
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: error.message,
            icon: 'error',
            confirmType: 'danger'
        });
        console.error(error);
    }
}

// Open confirm remove to other store modal
function openConfirmRemoveOtherModal(device, deviceId) {
    const deviceInfo = `${device.brand} ${device.model} (${device.color})`;
    const purchasePrice = parseFloat(device.purchase_price || device.purchasePrice || 0);
    const originalSalePrice = parseFloat(device.sale_price || device.salePrice || 0);

    document.getElementById('removeOtherDeviceInfo').textContent = deviceInfo;
    document.getElementById('removeOtherPurchasePrice').textContent = formatCurrency(purchasePrice);
    document.getElementById('removeOtherOriginalPrice').textContent = formatCurrency(originalSalePrice);
    document.getElementById('removeOtherSalePrice').value = originalSalePrice;
    document.getElementById('removeOtherDeviceId').value = deviceId;
    
    // ตั้งค่าวันที่เป็นวันปัจจุบัน
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('removeOtherDateInput').value = today;

    // คำนวณผลต่างเริ่มต้น
    updateRemoveOtherProfit(originalSalePrice, purchasePrice);

    // เพิ่ม event listener สำหรับคำนวณผลต่างแบบ real-time
    const priceInput = document.getElementById('removeOtherSalePrice');
    priceInput.oninput = function() {
        const salePrice = parseFloat(this.value) || 0;
        updateRemoveOtherProfit(salePrice, purchasePrice);
    };

    // แสดง Modal
    document.getElementById('confirmRemoveOtherModal').style.display = 'block';
}

// Update remove other profit display
function updateRemoveOtherProfit(salePrice, purchasePrice) {
    const profit = salePrice - purchasePrice;
    const percentage = purchasePrice > 0 ? ((profit / purchasePrice) * 100).toFixed(2) : 0;

    const profitValue = document.getElementById('removeOtherProfit');
    const profitPercent = document.getElementById('removeOtherProfitPercent');

    profitValue.textContent = formatCurrency(profit);
    profitPercent.textContent = `${percentage}%`;

    // เปลี่ยนสี
    if (profit > 0) {
        profitValue.style.color = '#10b981';
        profitPercent.style.color = '#10b981';
    } else if (profit < 0) {
        profitValue.style.color = '#ef4444';
        profitPercent.style.color = '#ef4444';
    } else {
        profitValue.style.color = '#6b7280';
        profitPercent.style.color = '#6b7280';
    }
}

// Close confirm remove other modal
function closeConfirmRemoveOtherModal() {
    document.getElementById('confirmRemoveOtherModal').style.display = 'none';
    document.getElementById('confirmRemoveOtherForm').reset();
}

// Confirm remove to other store
async function confirmRemoveToOther(event) {
    event.preventDefault();

    const deviceId = document.getElementById('removeOtherDeviceId').value;
    const salePrice = parseFloat(document.getElementById('removeOtherSalePrice').value);
    const removeDate = document.getElementById('removeOtherDateInput').value; // อ่านวันที่จาก input
    const note = document.getElementById('removeOtherNote').value;
    const deviceType = window.currentRemoveDeviceType || 'new';

    if (!salePrice || salePrice < 0) {
        await customAlert({
            title: 'ข้อมูลไม่ครบถ้วน',
            message: 'กรุณากรอกราคาที่ถูกต้อง',
            icon: 'warning',
            confirmType: 'warning'
        });
        return;
    }

    if (!removeDate) {
        await customAlert({
            title: 'ข้อมูลไม่ครบถ้วน',
            message: 'กรุณาเลือกวันที่ตัด',
            icon: 'warning',
            confirmType: 'warning'
        });
        return;
    }

    try {
        const endpoint = deviceType === 'used' ? API_ENDPOINTS.usedDevices : API_ENDPOINTS.newDevices;
        
        await API.put(`${endpoint}/${deviceId}`, {
            status: 'removed',
            sale_price: salePrice,
            sale_date: removeDate, // ใช้วันที่ที่เลือก
            note: note
        });

        closeConfirmRemoveOtherModal();
        
        // แสดงข้อความสำเร็จ
        await customAlert({
            title: 'สำเร็จ',
            message: 'ตัดขายให้เจ้าอื่นสำเร็จ',
            icon: 'success',
            confirmType: 'success'
        });
        
        // โหลดข้อมูลตามประเภท
        if (deviceType === 'used') {
            await applyUsedDevicesFilter();
        } else {
            await applyNewDevicesFilter();
        }
        
        // Clear device type
        window.currentRemoveDeviceType = null;

    } catch (error) {
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: error.message,
            icon: 'error',
            confirmType: 'danger'
        });
        console.error(error);
    }
}

// Delete device
async function deleteDevice(deviceId) {
    const confirmed = await customConfirm({
        title: 'ยืนยันการลบ',
        message: 'ต้องการลบข้อมูลนี้หรือไม่?',
        icon: 'warning',
        confirmText: 'ลบ',
        cancelText: 'ยกเลิก',
        confirmType: 'danger',
        list: [
            { icon: 'warning', iconSymbol: '⚠️', text: 'ไม่สามารถกู้คืนได้' },
            { icon: 'info', iconSymbol: 'ℹ️', text: 'ข้อมูลจะถูกลบออกจากระบบถาวร' }
        ]
    });

    if (confirmed) {
        try {
            await API.delete(`${API_ENDPOINTS.newDevices}/${deviceId}`);
            loadNewDevicesData();
            showNotification('ลบข้อมูลสำเร็จ');
        } catch (error) {
            await customAlert({
                title: 'เกิดข้อผิดพลาด',
                message: error.message,
                icon: 'error',
                confirmType: 'danger'
            });
            console.error(error);
        }
    }
}

// Initialize search
function initializeSearch() {
    const searchInput = document.getElementById('searchNewDevices');
    console.log('🔍 Initializing search for new devices, input element:', searchInput);
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            console.log('🔍 Search triggered:', e.target.value);
            applyNewDevicesFilter();
        });
        console.log('✅ Search event listener added');
    } else {
        console.warn('⚠️ searchNewDevices input element not found');
    }
}

// Filter devices based on search term
function filterDevices(searchTerm) {
    applyNewDevicesFilter();
}

// Prompt for transaction date (with date picker)
async function promptTransactionDate(actionType = 'installment') {
    return new Promise((resolve) => {
        const today = new Date().toISOString().split('T')[0];
        
        // กำหนดข้อความตามประเภทการทำรายการ
        const labels = {
            'installment': 'วันที่ทำรายการผ่อน',
            'remove': 'วันที่ทำการตัด'
        };
        const labelText = labels[actionType] || 'วันที่ทำรายการ';
        
        // ใช้ customConfirm แทน เพื่อความสม่ำเสมอ
        const dialog = document.getElementById('customDialog');
        const dialogTitle = document.getElementById('customDialogTitle');
        const dialogMessage = document.getElementById('customDialogMessage');
        const dialogIcon = document.getElementById('customDialogIcon');
        const dialogList = document.getElementById('customDialogList');
        const btnCancel = document.getElementById('customDialogCancel');
        const btnConfirm = document.getElementById('customDialogConfirm');

        // ตั้งค่า dialog
        dialogTitle.textContent = '📅 เลือกวันที่ทำรายการ';
        dialogMessage.innerHTML = `
            <div style="margin: 20px 0;">
                <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">${labelText}:</label>
                <input type="date" id="transactionDateInput" value="${today}" 
                    style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; font-family: inherit;">
                <small style="color: #666; margin-top: 8px; display: block;">
                    💡 สามารถเลือกวันที่ย้อนหลังได้ เพื่อให้ข้อมูลไปอยู่ในเดือนที่ถูกต้อง
                </small>
            </div>
        `;
        
        dialogIcon.innerHTML = '<span class="dialog-icon-symbol">📅</span>';
        dialogList.style.display = 'none';
        
        // แสดง dialog
        dialog.classList.add('active');
        
        // ตั้งค่าปุ่ม
        btnCancel.textContent = 'ยกเลิก';
        btnConfirm.textContent = '✅ ยืนยัน';
        
        // Remove old listeners
        const newBtnCancel = btnCancel.cloneNode(true);
        const newBtnConfirm = btnConfirm.cloneNode(true);
        btnCancel.parentNode.replaceChild(newBtnCancel, btnCancel);
        btnConfirm.parentNode.replaceChild(newBtnConfirm, btnConfirm);
        
        // Add new listeners
        newBtnCancel.onclick = () => {
            dialog.classList.remove('active');
            resolve(null);
        };
        
        newBtnConfirm.onclick = () => {
            const date = document.getElementById('transactionDateInput').value;
            dialog.classList.remove('active');
            resolve(date);
        };
        
        // Focus on date input
        setTimeout(() => {
            const input = document.getElementById('transactionDateInput');
            if (input) input.focus();
        }, 100);
    });
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

// Note: Reset function removed - now using MySQL API instead of localStorage mock data

// Clear all data
async function clearNewDevicesDatabase() {
    const confirmed = await customConfirm({
        title: 'ลบข้อมูลทั้งหมด',
        message: 'คุณต้องการลบข้อมูลทั้งหมดหรือไม่?',
        icon: 'warning',
        confirmText: 'ลบทั้งหมด',
        cancelText: 'ยกเลิก',
        confirmType: 'danger',
        list: [
            { icon: 'warning', iconSymbol: '⚠️', text: 'การกระทำนี้ไม่สามารถย้อนกลับได้' },
            { icon: 'warning', iconSymbol: '⚠️', text: 'ข้อมูลทั้งหมดจะถูกลบถาวร' },
            { icon: 'info', iconSymbol: 'ℹ️', text: 'แนะนำให้ส่งออกข้อมูลก่อนลบ' }
        ]
    });

    if (confirmed) {
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
async function importNewDevicesDatabase(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            const confirmed = await customConfirm({
                title: 'นำเข้าข้อมูล',
                message: `พบข้อมูล ${importedData.length} รายการ`,
                icon: 'question',
                confirmText: 'นำเข้า',
                cancelText: 'ยกเลิก',
                confirmType: 'success',
                list: [
                    { icon: 'info', iconSymbol: '📦', text: `จำนวนข้อมูล: ${importedData.length} รายการ` },
                    { icon: 'warning', iconSymbol: '⚠️', text: 'ข้อมูลเดิมจะถูกแทนที่' }
                ]
            });

            if (confirmed) {
                newDevices = importedData;
                localStorage.setItem('newDevices', JSON.stringify(newDevices));
                loadNewDevicesData();
                showNotification('นำเข้าข้อมูลสำเร็จ');
                console.log('✅ นำเข้าข้อมูลสำเร็จ');
                console.log(`📊 มีข้อมูลทั้งหมด ${newDevices.length} รายการ`);
            }
        } catch (error) {
            await customAlert({
                title: 'ไฟล์ไม่ถูกต้อง',
                message: 'กรุณาเลือกไฟล์ JSON ที่ถูกต้อง',
                icon: 'error',
                confirmType: 'danger'
            });
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
    console.log(`   - สต๊อค: ${salayaDevices.filter(d => d.status === 'stock').length}`);
    console.log(`   - ขายแล้ว: ${salayaDevices.filter(d => d.status === 'sold').length}`);
    console.log(`   - ตัดออก: ${salayaDevices.filter(d => d.status === 'removed').length}`);

    console.log(`📍 ร้านคลองโยง: ${klongyongDevices.length} รายการ`);
    console.log(`   - สต๊อค: ${klongyongDevices.filter(d => d.status === 'stock').length}`);
    console.log(`   - ขายแล้ว: ${klongyongDevices.filter(d => d.status === 'sold').length}`);
    console.log(`   - ตัดออก: ${klongyongDevices.filter(d => d.status === 'removed').length}`);

    console.log(`\n💰 มูลค่าสต๊อคทั้งหมด: ${formatCurrency(
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


// Data storage for accessories
let accessories = [];

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
        claim_quantity: 0,
        cost_price: parseFloat(formData.get('costPrice')),
        repair_price: parseFloat(formData.get('repairPrice')),
        import_date: formData.get('importDate'),
        claim_date: null,
        note: formData.get('note') || '',
        store: currentStore
    };

    try {
        if (currentAccessoryEditId) {
            // Update - check if we need to restore from removed status
            const existingAccessory = await API.get(`${API_ENDPOINTS.accessories}/${currentAccessoryEditId}`);

            // If was removed ([REMOVED] or [REMOVED:date] prefix in note) and quantity > 0, remove the prefix
            if (existingAccessory.note && existingAccessory.note.startsWith('[REMOVED') && accessoryData.quantity > 0) {
                // Remove [REMOVED] or [REMOVED:date] prefix to restore to normal category
                accessoryData.note = accessoryData.note.replace(/^\[REMOVED(:\d{4}-\d{2}-\d{2})?\]\s*/, '');
            }

            await API.put(`${API_ENDPOINTS.accessories}/${currentAccessoryEditId}`, accessoryData);
            showNotification('อัพเดทข้อมูลอะไหล่สำเร็จ');
        } else {
            // Add
            accessoryData.id = 'ACC' + Date.now().toString();
            console.log('[saveAccessory] Creating new accessory:', accessoryData);
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
    try {
        // Get current accessory data
        const accessory = await API.get(`${API_ENDPOINTS.accessories}/${accessoryId}`);

        if (!accessory) {
            await customAlert({
                title: 'ไม่พบข้อมูล',
                message: 'ไม่พบข้อมูลอะไหล่ที่ต้องการใช้งาน',
                icon: 'error'
            });
            return;
        }

        // คำนวณจำนวนที่พร้อมใช้งาน
        // หมายเหตุ: quantity ใน DB เป็นจำนวนที่เหลืออยู่แล้ว (ไม่ต้องหัก cut_quantity)
        const claimQuantity = Number(accessory.claim_quantity) || 0;
        const availableQuantity = Number(accessory.quantity) - claimQuantity;

        console.log(`[useAccessory] Accessory: ${accessory.code}, quantity=${accessory.quantity}, claim=${claimQuantity}, available=${availableQuantity}`);

        if (availableQuantity <= 0) {
            await customAlert({
                title: 'อะไหล่หมด',
                message: 'อะไหล่นี้หมดแล้ว ไม่สามารถใช้งานได้',
                icon: 'warning'
            });
            return;
        }

        // Decrease quantity by 1
        const newQuantity = Number(accessory.quantity) - 1;
        const newAvailable = availableQuantity - 1;

        // Confirm before using
        const confirmed = await customConfirm({
            title: 'ยืนยันการใช้งานอะไหล่',
            message: 'ต้องการใช้งานอะไหล่นี้ใช่หรือไม่?',
            icon: 'question',
            confirmText: 'ยืนยัน',
            cancelText: 'ยกเลิก',
            list: [
                { icon: 'info', iconSymbol: '📦', text: `${accessory.code} - ${accessory.brand} ${accessory.models}` },
                { icon: 'info', iconSymbol: '🔢', text: `จำนวนปัจจุบัน: ${accessory.quantity} ชิ้น` },
                { icon: 'warning', iconSymbol: '➖', text: `จำนวนหลังใช้งาน: ${newQuantity} ชิ้น` },
                ...(newQuantity === 0 ? [{ icon: 'warning', iconSymbol: '⚠️', text: 'รายการจะถูกย้ายไปแท็บ "อะไหล่หมด"' }] : [])
            ]
        });

        if (!confirmed) return;

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
        
        // Show appropriate notification
        if (newQuantity === 0) {
            showNotification('ใช้งานอะไหล่สำเร็จ! รายการถูกย้ายไปแท็บ "อะไหล่หมด"', 'success');
        } else {
            showNotification(`ใช้งานอะไหล่สำเร็จ จำนวนเหลือ: ${newQuantity} ชิ้น`, 'success');
        }
    } catch (error) {
        console.error('Error using accessory:', error);
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: 'ไม่สามารถใช้งานอะไหล่ได้: ' + error.message,
            icon: 'error',
            confirmType: 'danger'
        });
    }
}

// Delete accessory
async function deleteAccessory(accessoryId) {
    try {
        // ดึงข้อมูลเดิมมาก่อนเพื่อแสดงในยืนยัน
        const accessory = await API.get(`${API_ENDPOINTS.accessories}/${accessoryId}`);
        if (!accessory) {
            await customAlert({
                title: 'ไม่พบข้อมูล',
                message: 'ไม่พบข้อมูลอะไหล่ที่ต้องการลบ',
                icon: 'error'
            });
            return;
        }

        const typeName = getAccessoryTypeName(accessory.type);
        const claimQuantity = Number(accessory.claim_quantity) || 0;

        const confirmed = await customConfirm({
            title: 'ยืนยันการลบอะไหล่',
            message: 'คุณต้องการลบอะไหล่นี้ใช่หรือไม่? การลบจะไม่สามารถกู้คืนได้',
            icon: 'warning',
            confirmText: 'ลบ',
            cancelText: 'ยกเลิก',
            confirmType: 'danger',
            list: [
                { icon: 'info', iconSymbol: '🔧', text: `ประเภท: ${typeName}` },
                { icon: 'info', iconSymbol: '📦', text: `รหัส: ${accessory.code}` },
                { icon: 'info', iconSymbol: '📱', text: `${accessory.brand} - ${accessory.models || '-'}` },
                { icon: 'info', iconSymbol: '📊', text: `จำนวน: ${accessory.quantity}${claimQuantity > 0 ? ` (เคลม: ${claimQuantity})` : ''}` },
                { icon: 'info', iconSymbol: '💰', text: `ราคาทุน: ${formatCurrency(accessory.cost_price)} | ราคาซ่อม: ${formatCurrency(accessory.repair_price)}` },
                { icon: 'warning', iconSymbol: '⚠️', text: 'ข้อมูลจะถูกลบถาวรจากระบบ' }
            ]
        });

        if (confirmed) {
        await API.delete(`${API_ENDPOINTS.accessories}/${accessoryId}`);
        loadAccessoriesData();
            showNotification('ลบอะไหล่สำเร็จ', 'success');
            console.log(`✅ ลบอะไหล่ ID: ${accessoryId}`);
        }
    } catch (error) {
        console.error('Error deleting accessory:', error);
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: 'ไม่สามารถลบอะไหล่ได้: ' + error.message,
            icon: 'error',
            confirmType: 'danger'
        });
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
        
        // Validate data
        if (!Array.isArray(allAccessories)) {
            console.warn('API returned invalid data:', allAccessories);
            // Display empty tables
            displayAccessories([], 'batteryTableBody');
            displayAccessories([], 'screenTableBody');
            displayAccessories([], 'chargingTableBody');
            displayAccessories([], 'switchTableBody');
            displayAccessories([], 'flexTableBody');
            displayAccessories([], 'speakerTableBody');
            displayOutOfStockAccessories([], 'outofstockTableBody');
            displayClaimAccessories([], 'claimTableBody');
            return;
        }
        
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
        if (currentAccessoryFilter.startDate || currentAccessoryFilter.endDate) {
            filteredAccessories = filteredAccessories.filter(a => {
                const importDate = a.import_date || a.importDate;
                if (!importDate) return false;
                
                const date = new Date(importDate);
                const startMatch = !currentAccessoryFilter.startDate || 
                                  date >= new Date(currentAccessoryFilter.startDate);
                const endMatch = !currentAccessoryFilter.endDate || 
                                date <= new Date(currentAccessoryFilter.endDate + 'T23:59:59');
                
                return startMatch && endMatch;
            });
        }

        // Separate by type
        const batteryAccessories = filteredAccessories.filter(a => a.type === 'battery' && Number(a.quantity) > 0);
        const screenAccessories = filteredAccessories.filter(a => a.type === 'screen' && Number(a.quantity) > 0);
        const chargingAccessories = filteredAccessories.filter(a => a.type === 'charging' && Number(a.quantity) > 0);
        const switchAccessories = filteredAccessories.filter(a => a.type === 'switch' && Number(a.quantity) > 0);
        const flexAccessories = filteredAccessories.filter(a => a.type === 'flex' && Number(a.quantity) > 0);
        const speakerAccessories = filteredAccessories.filter(a => a.type === 'speaker' && Number(a.quantity) > 0);
        
        // Get cut accessories from API endpoint (ใช้ cut_quantity)
        let removedAccessories = [];
        try {
            const cutAccessories = await API.get(API_ENDPOINTS.accessoryCutList, { store: currentStore });
            console.log(`[loadAccessoriesData] Loaded ${cutAccessories.length} cut accessories from API`);
            
            // Apply search filter to cut accessories
            if (currentAccessoryFilter.search) {
                const search = currentAccessoryFilter.search.toLowerCase();
                removedAccessories = (cutAccessories || []).filter(a =>
                    a.brand.toLowerCase().includes(search) ||
                    a.code.toLowerCase().includes(search) ||
                    a.models.toLowerCase().includes(search)
                );
            } else {
                removedAccessories = cutAccessories || [];
            }
            
            // Apply date filter if specified (แสดงทั้งหมดถ้าไม่มีการกรอง)
            if (currentAccessoryFilter.startDate || currentAccessoryFilter.endDate) {
                removedAccessories = removedAccessories.filter(a => {
                    const cutDate = a.cut_date || a.cutDate;
                    if (!cutDate) return false;

                    const date = new Date(cutDate);
                    const startMatch = !currentAccessoryFilter.startDate ||
                                      date >= new Date(currentAccessoryFilter.startDate);
                    const endMatch = !currentAccessoryFilter.endDate ||
                                    date <= new Date(currentAccessoryFilter.endDate + 'T23:59:59');

                    return startMatch && endMatch;
                });
            }
            
            console.log(`[loadAccessoriesData] Final removedAccessories: ${removedAccessories.length} items`, removedAccessories);
        } catch (error) {
            console.error('Error loading cut accessories:', error);
            // Fallback: filter from filteredAccessories if API fails
            removedAccessories = filteredAccessories.filter(a => (Number(a.cut_quantity) || 0) > 0);
        }
        
        const outOfStockAccessories = filteredAccessories.filter(a => Number(a.quantity) === 0);
        const claimAccessories = filteredAccessories.filter(a => (Number(a.claim_quantity) || 0) > 0);

        console.log(`[loadAccessoriesData] removedAccessories: ${removedAccessories.length} items`, removedAccessories);
        console.log(`[loadAccessoriesData] outOfStockAccessories: ${outOfStockAccessories.length} items`, outOfStockAccessories);

        // Update counts
        const batteryCountEl = document.getElementById('batteryCount');
        const screenCountEl = document.getElementById('screenCount');
        const chargingCountEl = document.getElementById('chargingCount');
        const switchCountEl = document.getElementById('switchCount');
        const flexCountEl = document.getElementById('flexCount');
        const speakerCountEl = document.getElementById('speakerCount');
        const removedCountEl = document.getElementById('removedCount');
        const outofstockCountEl = document.getElementById('outofstockCount');
        const claimCountEl = document.getElementById('claimCount');

        if (batteryCountEl) batteryCountEl.textContent = batteryAccessories.length;
        if (screenCountEl) screenCountEl.textContent = screenAccessories.length;
        if (chargingCountEl) chargingCountEl.textContent = chargingAccessories.length;
        if (switchCountEl) switchCountEl.textContent = switchAccessories.length;
        if (flexCountEl) flexCountEl.textContent = flexAccessories.length;
        if (speakerCountEl) speakerCountEl.textContent = speakerAccessories.length;
        if (removedCountEl) removedCountEl.textContent = removedAccessories.length;
        if (outofstockCountEl) outofstockCountEl.textContent = outOfStockAccessories.length;
        if (claimCountEl) claimCountEl.textContent = claimAccessories.length;

        // Display accessories
        displayAccessories(batteryAccessories, 'batteryTableBody');
        displayAccessories(screenAccessories, 'screenTableBody');
        displayAccessories(chargingAccessories, 'chargingTableBody');
        displayAccessories(switchAccessories, 'switchTableBody');
        displayAccessories(flexAccessories, 'flexTableBody');
        displayAccessories(speakerAccessories, 'speakerTableBody');
        displayRemovedAccessories(removedAccessories, 'accessoryRemovedTableBody');
        displayOutOfStockAccessories(outOfStockAccessories, 'outofstockTableBody');
        displayClaimAccessories(claimAccessories, 'claimTableBody');
        
        // Update dashboard cards with all accessories data
        updateAccessoriesDashboardCards(allAccessories);
        
        // Initialize tab display
        switchAccessoryTab(currentAccessoryTab || 'battery');
    } catch (error) {
        console.error('Error loading accessories:', error);
        console.error('Error details:', error.message);
        // Display empty tables instead of alert
        displayAccessories([], 'batteryTableBody');
        displayAccessories([], 'screenTableBody');
        displayAccessories([], 'chargingTableBody');
        displayAccessories([], 'switchTableBody');
        displayAccessories([], 'flexTableBody');
        displayAccessories([], 'speakerTableBody');
        displayRemovedAccessories([], 'accessoryRemovedTableBody');
        displayOutOfStockAccessories([], 'outofstockTableBody');
        displayClaimAccessories([], 'claimTableBody');
        
        // Update dashboard cards with empty data
        updateAccessoriesDashboardCards([]);
    }
}

// Update accessories dashboard cards
function updateAccessoriesDashboardCards(allAccessories) {
    console.log('[updateAccessoriesDashboardCards] Calculating with', allAccessories.length, 'accessories');
    
    // Filter by current store
    let storeAccessories = allAccessories.filter(a => a.store === currentStore);
    
    // Apply date filter if exists
    if (currentAccessoryFilter.startDate || currentAccessoryFilter.endDate) {
        storeAccessories = storeAccessories.filter(a => {
            const importDate = a.import_date || a.importDate;
            if (!importDate) return false;
            
            const date = new Date(importDate);
            const startMatch = !currentAccessoryFilter.startDate || 
                              date >= new Date(currentAccessoryFilter.startDate);
            const endMatch = !currentAccessoryFilter.endDate || 
                            date <= new Date(currentAccessoryFilter.endDate + 'T23:59:59');
            
            return startMatch && endMatch;
        });
    }
    
    console.log('[updateAccessoriesDashboardCards] Store accessories:', storeAccessories.length);
    
    // 1. สต็อค: จำนวนชิ้นทั้งหมด (รวม quantity ของอะไหล่ทั้งหมด ยกเว้นที่ quantity = 0)
    const totalStock = storeAccessories
        .filter(a => Number(a.quantity) > 0)
        .reduce((sum, a) => sum + Number(a.quantity), 0);
    
    // 2. รายจ่าย: ต้นทุนทั้งหมด (cost_price * (quantity + cut_quantity))
    // รวมทั้งที่คงเหลือและที่ตัดไปแล้ว เพื่อให้รายจ่ายคงที่ตามต้นทุนที่จ่ายจริง
    const totalExpense = storeAccessories.reduce((sum, a) => {
        const quantity = Number(a.quantity) || 0;
        const cutQuantity = Number(a.cut_quantity) || 0;
        const totalQuantity = quantity + cutQuantity;
        const costPrice = parseFloat(a.cost_price || a.costPrice || 0);
        return sum + (costPrice * totalQuantity);
    }, 0);
    
    // 3. รายรับ: รายรับจากการตัดอะไหล่ (cut_price * cut_quantity)
    const totalIncome = storeAccessories.reduce((sum, a) => {
        const cutQuantity = Number(a.cut_quantity || 0);
        const cutPrice = parseFloat(a.cut_price || a.cutPrice || 0);
        return sum + (cutPrice * cutQuantity);
    }, 0);

    // 4. กำไร: กำไรจากอะไหล่ที่ตัด (cut_price - cost_price) * cut_quantity
    // หมายเหตุ: กำไรคือส่วนต่างระหว่างราคาที่ตัด (cut_price) กับราคาทุน (cost_price) ของอะไหล่ที่ตัดไป
    const totalProfit = storeAccessories.reduce((sum, a) => {
        const cutQuantity = Number(a.cut_quantity || 0);
        const cutPrice = parseFloat(a.cut_price || a.cutPrice || 0);
        const costPrice = parseFloat(a.cost_price || a.costPrice || 0);
        const profitPerUnit = cutPrice - costPrice;
        return sum + (profitPerUnit * cutQuantity);
    }, 0);
    
    // Update UI
    const stockCountElement = document.getElementById('accessoriesStockCount');
    const expenseElement = document.getElementById('accessoriesExpense');
    const incomeElement = document.getElementById('accessoriesIncome');
    const profitElement = document.getElementById('accessoriesProfit');
    
    if (stockCountElement) {
        stockCountElement.textContent = totalStock;
    }
    
    if (expenseElement) {
        expenseElement.textContent = formatCurrency(totalExpense);
    }
    
    if (incomeElement) {
        incomeElement.textContent = formatCurrency(totalIncome);
    }
    
    if (profitElement) {
        profitElement.textContent = formatCurrency(totalProfit);
        // Change color based on profit/loss
        const profitCard = profitElement.closest('.page-stat-card');
        if (profitCard) {
            profitCard.classList.remove('negative');
            if (totalProfit < 0) {
                profitCard.classList.add('negative');
            }
        }
    }
    
    console.log('📊 Accessories Dashboard Cards Updated:', {
        stock: totalStock,
        expense: formatCurrency(totalExpense),
        income: formatCurrency(totalIncome),
        profit: formatCurrency(totalProfit)
    });
}

// Show accessories expense detail modal
async function showAccessoriesExpenseDetail() {
    try {
        // Get all accessories
        const allAccessories = await API.get(API_ENDPOINTS.accessories, { store: currentStore });

        // Filter by current store
        let storeAccessories = allAccessories.filter(a => a.store === currentStore);

        // Apply date filter if exists
        if (currentAccessoryFilter.startDate || currentAccessoryFilter.endDate) {
            storeAccessories = storeAccessories.filter(a => {
                const importDate = a.import_date || a.importDate;
                if (!importDate) return false;

                const date = new Date(importDate);
                const startMatch = !currentAccessoryFilter.startDate ||
                                  date >= new Date(currentAccessoryFilter.startDate);
                const endMatch = !currentAccessoryFilter.endDate ||
                                date <= new Date(currentAccessoryFilter.endDate + 'T23:59:59');

                return startMatch && endMatch;
            });
        }

        // Calculate total expense
        const totalExpense = storeAccessories.reduce((sum, a) => {
            const quantity = Number(a.quantity) || 0;
            const cutQuantity = Number(a.cut_quantity) || 0;
            const totalQuantity = quantity + cutQuantity;
            const costPrice = parseFloat(a.cost_price || a.costPrice || 0);
            return sum + (costPrice * totalQuantity);
        }, 0);

        // Update modal summary
        const monthElement = document.getElementById('accessoriesExpenseMonth');
        const totalElement = document.getElementById('accessoriesExpenseDetailTotal');
        const countElement = document.getElementById('accessoriesExpenseDetailCount');

        if (monthElement) {
            if (currentAccessoryFilter.startDate || currentAccessoryFilter.endDate) {
                const startStr = currentAccessoryFilter.startDate ? formatDate(currentAccessoryFilter.startDate) : 'ไม่จำกัด';
                const endStr = currentAccessoryFilter.endDate ? formatDate(currentAccessoryFilter.endDate) : 'ไม่จำกัด';
                monthElement.textContent = `${startStr} ถึง ${endStr}`;
            } else {
                monthElement.textContent = 'ทั้งหมด';
            }
        }

        if (totalElement) totalElement.textContent = formatCurrency(totalExpense);
        if (countElement) countElement.textContent = storeAccessories.length;

        // Update table
        const tbody = document.getElementById('accessoriesExpenseDetailTableBody');
        if (!tbody) return;

        if (storeAccessories.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="empty-state">ไม่มีข้อมูล</td></tr>';
        } else {
            tbody.innerHTML = storeAccessories.map(a => {
                const quantity = Number(a.quantity) || 0;
                const cutQuantity = Number(a.cut_quantity) || 0;
                const totalQuantity = quantity + cutQuantity;
                const costPrice = parseFloat(a.cost_price || a.costPrice || 0);
                const totalCost = costPrice * totalQuantity;

                return `
                    <tr${cutQuantity > 0 ? ' style="background: #fff9e6;"' : ''}>
                        <td style="text-align: left;">${a.code}</td>
                        <td style="text-align: left;">${getAccessoryTypeName(a.type)}</td>
                        <td style="text-align: left;">${a.brand} ${a.models}</td>
                        <td style="text-align: center;">${totalQuantity}</td>
                        <td style="text-align: center;">${quantity > 0 ? quantity : '-'}</td>
                        <td style="text-align: center; ${cutQuantity > 0 ? 'font-weight: bold; color: #e67e22;' : ''}">${cutQuantity > 0 ? cutQuantity : '-'}</td>
                        <td style="text-align: right;">${formatCurrency(costPrice)}</td>
                        <td style="text-align: right; font-weight: bold; color: #e74c3c;">${formatCurrency(totalCost)}</td>
                    </tr>
                `;
            }).join('');
        }

        // Show modal
        const modal = document.getElementById('accessoriesExpenseDetailModal');
        if (modal) modal.classList.add('show');

    } catch (error) {
        console.error('Error showing accessories expense detail:', error);
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: 'ไม่สามารถโหลดข้อมูลได้',
            icon: 'error'
        });
    }
}

// Close accessories expense detail modal
function closeAccessoriesExpenseDetailModal() {
    const modal = document.getElementById('accessoriesExpenseDetailModal');
    if (modal) modal.classList.remove('show');
}

// Show accessories income detail modal
async function showAccessoriesIncomeDetail() {
    try {
        // Get cut accessories from the correct API endpoint
        const allCutAccessories = await API.get(API_ENDPOINTS.accessoryCutList, { store: currentStore });
        
        // Filter by current store
        let storeAccessories = allCutAccessories.filter(a => a.store === currentStore);
        
        // Apply date filter if exists
        if (currentAccessoryFilter.startDate || currentAccessoryFilter.endDate) {
            storeAccessories = storeAccessories.filter(a => {
                const cutDate = a.cut_date || a.cutDate;
                if (!cutDate) return false;
                
                const date = new Date(cutDate);
                const startMatch = !currentAccessoryFilter.startDate || 
                                  date >= new Date(currentAccessoryFilter.startDate);
                const endMatch = !currentAccessoryFilter.endDate || 
                                date <= new Date(currentAccessoryFilter.endDate + 'T23:59:59');
                
                return startMatch && endMatch;
            });
        }
        
        // Use cut accessories (already filtered from API)
        const cutAccessories = storeAccessories;
        
        // Calculate total income
        const totalIncome = cutAccessories.reduce((sum, a) => {
            const cutQuantity = Number(a.cut_quantity || 0);
            const cutPrice = parseFloat(a.cut_price || a.cutPrice || 0);
            return sum + (cutPrice * cutQuantity);
        }, 0);
        
        // Update modal summary
        const monthElement = document.getElementById('accessoriesIncomeMonth');
        const totalElement = document.getElementById('accessoriesIncomeDetailTotal');
        const countElement = document.getElementById('accessoriesIncomeDetailCount');
        
        if (monthElement) {
            if (currentAccessoryFilter.startDate || currentAccessoryFilter.endDate) {
                const startStr = currentAccessoryFilter.startDate ? formatDate(currentAccessoryFilter.startDate) : 'ไม่จำกัด';
                const endStr = currentAccessoryFilter.endDate ? formatDate(currentAccessoryFilter.endDate) : 'ไม่จำกัด';
                monthElement.textContent = `${startStr} ถึง ${endStr}`;
            } else {
                monthElement.textContent = 'ทั้งหมด';
            }
        }
        
        if (totalElement) totalElement.textContent = formatCurrency(totalIncome);
        if (countElement) countElement.textContent = cutAccessories.length;
        
        // Update table
        const tbody = document.getElementById('accessoriesIncomeDetailTableBody');
        if (!tbody) return;
        
        if (cutAccessories.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty-state">ไม่มีข้อมูล</td></tr>';
        } else {
            tbody.innerHTML = cutAccessories.map(a => {
                const cutQuantity = Number(a.cut_quantity || 0);
                const cutPrice = parseFloat(a.cut_price || a.cutPrice || 0);
                const totalPrice = cutPrice * cutQuantity;
                const cutDate = a.cut_date || a.cutDate;

                return `
                    <tr>
                        <td style="text-align: left;">${a.code}</td>
                        <td style="text-align: left;">${getAccessoryTypeName(a.type)}</td>
                        <td style="text-align: left;">${a.brand} ${a.models}</td>
                        <td style="text-align: center;">${cutQuantity}</td>
                        <td style="text-align: right;">${formatCurrency(cutPrice)}</td>
                        <td style="text-align: right; font-weight: bold; color: #28a745;">${formatCurrency(totalPrice)}</td>
                        <td style="text-align: center;">${cutDate ? formatDate(cutDate) : '-'}</td>
                    </tr>
                `;
            }).join('');
        }
        
        // Show modal
        const modal = document.getElementById('accessoriesIncomeDetailModal');
        if (modal) modal.classList.add('show');
        
    } catch (error) {
        console.error('Error showing accessories income detail:', error);
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: 'ไม่สามารถโหลดข้อมูลได้',
            icon: 'error'
        });
    }
}

// Close accessories income detail modal
function closeAccessoriesIncomeDetailModal() {
    const modal = document.getElementById('accessoriesIncomeDetailModal');
    if (modal) modal.classList.remove('show');
}

// Show accessories profit detail modal
async function showAccessoriesProfitDetail() {
    try {
        // Get cut accessories from the correct API endpoint
        const allCutAccessories = await API.get(API_ENDPOINTS.accessoryCutList, { store: currentStore });
        
        // Filter by current store
        let storeAccessories = allCutAccessories.filter(a => a.store === currentStore);
        
        // Apply date filter if exists
        if (currentAccessoryFilter.startDate || currentAccessoryFilter.endDate) {
            storeAccessories = storeAccessories.filter(a => {
                const cutDate = a.cut_date || a.cutDate;
                if (!cutDate) return false;
                
                const date = new Date(cutDate);
                const startMatch = !currentAccessoryFilter.startDate || 
                                  date >= new Date(currentAccessoryFilter.startDate);
                const endMatch = !currentAccessoryFilter.endDate || 
                                date <= new Date(currentAccessoryFilter.endDate + 'T23:59:59');
                
                return startMatch && endMatch;
            });
        }
        
        // Use cut accessories (already filtered from API)
        const cutAccessories = storeAccessories;
        
        // Calculate total profit
        const totalProfit = cutAccessories.reduce((sum, a) => {
            const cutQuantity = Number(a.cut_quantity || 0);
            const cutPrice = parseFloat(a.cut_price || a.cutPrice || 0);
            const costPrice = parseFloat(a.cost_price || a.costPrice || 0);
            const profitPerUnit = cutPrice - costPrice;
            return sum + (profitPerUnit * cutQuantity);
        }, 0);
        
        // Update modal summary
        const monthElement = document.getElementById('accessoriesProfitMonth');
        const totalElement = document.getElementById('accessoriesProfitDetailTotal');
        const countElement = document.getElementById('accessoriesProfitDetailCount');
        
        if (monthElement) {
            if (currentAccessoryFilter.startDate || currentAccessoryFilter.endDate) {
                const startStr = currentAccessoryFilter.startDate ? formatDate(currentAccessoryFilter.startDate) : 'ไม่จำกัด';
                const endStr = currentAccessoryFilter.endDate ? formatDate(currentAccessoryFilter.endDate) : 'ไม่จำกัด';
                monthElement.textContent = `${startStr} ถึง ${endStr}`;
            } else {
                monthElement.textContent = 'ทั้งหมด';
            }
        }
        
        if (totalElement) totalElement.textContent = formatCurrency(totalProfit);
        if (countElement) countElement.textContent = cutAccessories.length;
        
        // Update table
        const tbody = document.getElementById('accessoriesProfitDetailTableBody');
        if (!tbody) return;
        
        if (cutAccessories.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="empty-state">ไม่มีข้อมูล</td></tr>';
        } else {
            tbody.innerHTML = cutAccessories.map(a => {
                const cutQuantity = Number(a.cut_quantity || 0);
                const cutPrice = parseFloat(a.cut_price || a.cutPrice || 0);
                const costPrice = parseFloat(a.cost_price || a.costPrice || 0);
                const profitPerUnit = cutPrice - costPrice;
                const totalProfit = profitPerUnit * cutQuantity;

                return `
                    <tr>
                        <td style="text-align: left;">${a.code}</td>
                        <td style="text-align: left;">${getAccessoryTypeName(a.type)}</td>
                        <td style="text-align: left;">${a.brand} ${a.models}</td>
                        <td style="text-align: center;">${cutQuantity}</td>
                        <td style="text-align: right;">${formatCurrency(costPrice)}</td>
                        <td style="text-align: right;">${formatCurrency(cutPrice)}</td>
                        <td style="text-align: right; ${profitPerUnit >= 0 ? 'color: #28a745;' : 'color: #dc3545;'}">${formatCurrency(profitPerUnit)}</td>
                        <td style="text-align: right; font-weight: bold; ${totalProfit >= 0 ? 'color: #28a745;' : 'color: #dc3545;'}">${formatCurrency(totalProfit)}</td>
                    </tr>
                `;
            }).join('');
        }
        
        // Show modal
        const modal = document.getElementById('accessoriesProfitDetailModal');
        if (modal) modal.classList.add('show');
        
    } catch (error) {
        console.error('Error showing accessories profit detail:', error);
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: 'ไม่สามารถโหลดข้อมูลได้',
            icon: 'error'
        });
    }
}

// Close accessories profit detail modal
function closeAccessoriesProfitDetailModal() {
    const modal = document.getElementById('accessoriesProfitDetailModal');
    if (modal) modal.classList.remove('show');
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
            <td title="${acc.models || ''}">${acc.models}</td>
            <td><strong>${acc.quantity}</strong>${claimQuantity > 0 ? ` <small style="color: #e67e22;">(เคลม: ${claimQuantity})</small>` : ''}</td>
            <td>${formatCurrency(acc.cost_price)}</td>
            <td>${formatCurrency(acc.repair_price)}</td>
            <td>${formatDate(acc.import_date)}</td>
            <td>
                ${availableQuantity > 0 ? `<button class="action-btn btn-success" onclick="useAccessory('${acc.id}')">ใช้งาน</button>` : ''}
                ${availableQuantity > 0 ? `<button class="action-btn btn-primary" onclick="openCutStockModal('${acc.id}')">ตัด</button>` : ''}
                ${availableQuantity > 0 ? `<button class="action-btn btn-warning" onclick="openClaimModal('${acc.id}')">เคลม</button>` : ''}
                <button class="action-btn btn-edit" onclick="openAccessoryModal('${acc.id}')">แก้ไข</button>
                <button class="action-btn btn-delete" onclick="deleteAccessory('${acc.id}')">ลบ</button>
            </td>
        </tr>
    `;
    }).join('');
    
    console.log(`[displayAccessories] ${tableBodyId}: Done! Set ${accessoriesList.length} rows`);
}

// Display removed accessories (ตัดแล้ว)
function displayRemovedAccessories(accessoriesList, tableBodyId) {
    console.log(`[displayRemovedAccessories] ${tableBodyId}: ${accessoriesList.length} items`, accessoriesList);

    const tbody = document.getElementById(tableBodyId);
    if (!tbody) {
        console.error(`[displayRemovedAccessories] Table body not found: ${tableBodyId}`);
        return;
    }

    if (accessoriesList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-state">ไม่มีอะไหล่ที่ถูกตัด</td></tr>';
        console.log(`[displayRemovedAccessories] ${tableBodyId}: No data, set empty state`);
        return;
    }

    try {
        const htmlContent = accessoriesList.map(acc => {
            const cutQuantity = Number(acc.cut_quantity) || 0;
            const cutPrice = parseFloat(acc.cut_price || acc.cutPrice || 0);
            const totalPrice = cutPrice * cutQuantity;
            const cutDate = acc.cut_date || acc.cutDate;

            return `
            <tr style="background: #fff9e6;">
                <td style="text-align: left;">${acc.code}</td>
                <td style="text-align: left;">${getAccessoryTypeName(acc.type)}</td>
                <td style="text-align: left;">${acc.brand} ${acc.models}</td>
                <td style="text-align: center; font-weight: bold; color: #e67e22;">${cutQuantity}</td>
                <td style="text-align: right;">${formatCurrency(cutPrice)}</td>
                <td style="text-align: right; font-weight: bold; color: #28a745;">${formatCurrency(totalPrice)}</td>
                <td style="text-align: center;">${cutDate ? formatDate(cutDate) : '-'}</td>
                <td style="text-align: center;">
                    <button class="btn btn-sm btn-edit" onclick="editCutAccessory('${acc.id}')">
                        แก้ไข
                    </button>
                    <button class="btn btn-sm btn-delete" onclick="deleteCutAccessory('${acc.id}')">
                        ลบ
                    </button>
                </td>
            </tr>
        `;
        }).join('');

        console.log(`[displayRemovedAccessories] ${tableBodyId}: HTML length:`, htmlContent.length);
        tbody.innerHTML = htmlContent;
        console.log(`[displayRemovedAccessories] ${tableBodyId}: Done! Set ${accessoriesList.length} rows`);
        console.log(`[displayRemovedAccessories] ${tableBodyId}: Current tbody.children.length:`, tbody.children.length);
    } catch (error) {
        console.error(`[displayRemovedAccessories] Error rendering table:`, error);
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">เกิดข้อผิดพลาดในการแสดงข้อมูล</td></tr>';
    }
}

// Display out of stock accessories
function displayOutOfStockAccessories(accessoriesList, tableBodyId) {
    console.log(`[displayOutOfStockAccessories] ${tableBodyId}: ${accessoriesList.length} items`, accessoriesList);

    const tbody = document.getElementById(tableBodyId);
    if (!tbody) {
        console.error(`[displayOutOfStockAccessories] Table body not found: ${tableBodyId}`);
        return;
    }

    if (accessoriesList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-state">ไม่มีอะไหล่ที่หมดสต็อก</td></tr>';
        console.log(`[displayOutOfStockAccessories] ${tableBodyId}: No data, set empty state`);
        return;
    }

    const typeNames = {
        battery: 'แบตเตอรี่',
        screen: 'จอ',
        charging: 'แพชาร์ต',
        switch: 'สวิตช์',
        flex: 'สายแพ',
        speaker: 'ลำโพง'
    };

    tbody.innerHTML = accessoriesList.map(acc => {
        const modelsOneLine = (acc.models || '').replace(/\n/g, ', ').replace(/\r/g, '');
        return `
        <tr style="background: #fff5f5;">
            <td>${acc.code}</td>
            <td><span class="badge badge-danger">${typeNames[acc.type]}</span></td>
            <td>${acc.brand}</td>
            <td style="white-space: nowrap;">${modelsOneLine}</td>
            <td>${formatCurrency(acc.cost_price)}</td>
            <td>${formatCurrency(acc.repair_price)}</td>
            <td>${formatDate(acc.import_date)}</td>
            <td>
                <button class="action-btn btn-edit" onclick="openAccessoryModal('${acc.id}')">แก้ไข</button>
                <button class="action-btn btn-delete" onclick="deleteAccessory('${acc.id}')">ลบ</button>
            </td>
        </tr>
    `;
    }).join('');
}

// Search accessories
function searchAccessory() {
    const searchInput = document.getElementById('searchAccessory');
    if (searchInput) {
    currentAccessoryFilter.search = searchInput.value;
    loadAccessoriesData();
    }
}

// Filter accessories (old function - kept for compatibility but not used)
function filterAccessory() {
    // This function is deprecated - use filterAccessoryByDateRange() instead
    filterAccessoryByDateRange();
}

// Reset accessory filter
function resetAccessoryFilter() {
    const startDateInput = document.getElementById('filterAccessoryStartDate');
    const endDateInput = document.getElementById('filterAccessoryEndDate');
    const searchInput = document.getElementById('searchAccessory');
    
    if (startDateInput) startDateInput.value = '';
    if (endDateInput) endDateInput.value = '';
    if (searchInput) searchInput.value = '';
    
    currentAccessoryFilter = { startDate: '', endDate: '', search: '' };
    loadAccessoriesData();
}

// Initialize accessory date filter
function initializeAccessoryDateFilter() {
    const monthSelect = document.getElementById('filterAccessoryMonth');
    const yearSelect = document.getElementById('filterAccessoryYear');

    if (!monthSelect || !yearSelect) return;

    // Clear existing options except the first one
    while (monthSelect.options.length > 1) {
        monthSelect.remove(1);
    }
    while (yearSelect.options.length > 1) {
        yearSelect.remove(1);
    }

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

// ===== CUT STOCK MODAL =====

// Open cut stock modal
async function openCutStockModal(accessoryId) {
    try {
        const accessory = await API.get(`${API_ENDPOINTS.accessories}/${accessoryId}`);

        const modal = document.getElementById('cutStockModal');
        const claimQuantity = Number(accessory.claim_quantity) || 0;
        const availableQuantity = Number(accessory.quantity) - claimQuantity;

        // Set accessory info
        document.getElementById('cutStockAccessoryInfo').textContent =
            `${accessory.code} - ${accessory.brand} ${accessory.models}`;
        
        // Set available quantity info
        document.getElementById('cutStockAvailableQuantity').textContent =
            `จำนวนที่สามารถตัดได้: ${availableQuantity} ชิ้น`;
        
        // Set default values
        document.getElementById('cutStockQuantity').max = availableQuantity;
        document.getElementById('cutStockQuantity').value = '1';
        document.getElementById('cutStockPrice').value = accessory.repair_price || accessory.cost_price;
        document.getElementById('cutStockDate').value = new Date().toISOString().split('T')[0];
        document.getElementById('cutStockNote').value = '';
        document.getElementById('cutStockAccessoryId').value = accessoryId;

        modal.classList.add('show');
    } catch (error) {
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: 'ไม่สามารถโหลดข้อมูลอะไหล่ได้',
            icon: 'error'
        });
        console.error(error);
    }
}

// Close cut stock modal
function closeCutStockModal() {
    const modal = document.getElementById('cutStockModal');
    modal.classList.remove('show');
}

// Save cut stock
async function saveCutStock(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const accessoryId = formData.get('accessoryId');
    const quantity = parseInt(formData.get('quantity'));
    const price = parseFloat(formData.get('price'));
    const date = formData.get('date');
    const note = formData.get('note') || '';

    try {
        // Get current accessory data
        const accessory = await API.get(`${API_ENDPOINTS.accessories}/${accessoryId}`);

        if (!accessory) {
            await customAlert({
                title: 'เกิดข้อผิดพลาด',
                message: 'ไม่พบข้อมูลอะไหล่',
                icon: 'error'
            });
            return;
        }

        // คำนวณจำนวนที่พร้อมใช้งาน
        // หมายเหตุ: quantity ใน DB เป็นจำนวนที่เหลืออยู่แล้ว (ไม่ต้องหัก cut_quantity)
        const claimQuantity = Number(accessory.claim_quantity) || 0;
        const availableQuantity = Number(accessory.quantity) - claimQuantity;

        console.log(`[saveCutStock] Accessory: ${accessory.code}, quantity=${accessory.quantity}, claim=${claimQuantity}, available=${availableQuantity}`);

        // Validate quantity
        if (quantity <= 0) {
            await customAlert({
                title: 'ข้อมูลไม่ถูกต้อง',
                message: 'กรุณาระบุจำนวนที่ถูกต้อง',
                icon: 'warning'
            });
            return;
        }

        if (quantity > availableQuantity) {
            await customAlert({
                title: 'จำนวนไม่เพียงพอ',
                message: `อะไหล่มีจำนวนไม่เพียงพอ (มีอยู่ ${availableQuantity} ชิ้น, ส่งเคลมไป ${claimQuantity} ชิ้น)`,
                icon: 'warning'
            });
            return;
        }

        // Confirm before cutting
        const confirmed = await customConfirm({
            title: 'ยืนยันการตัดอะไหล่',
            message: 'คุณต้องการตัดอะไหล่นี้ใช่หรือไม่?',
            icon: 'question',
            confirmText: 'ยืนยัน',
            cancelText: 'ยกเลิก',
            list: [
                { icon: 'info', iconSymbol: '📦', text: `${accessory.code} - ${accessory.brand} ${accessory.models}` },
                { icon: 'info', iconSymbol: '🔢', text: `จำนวน: ${quantity} ชิ้น` },
                { icon: 'info', iconSymbol: '💰', text: `ราคา: ${formatCurrency(price)}` },
                { icon: 'info', iconSymbol: '📅', text: `วันที่: ${formatDate(date)}` },
                ...(note ? [{ icon: 'info', iconSymbol: '📝', text: `หมายเหตุ: ${note}` }] : [])
            ]
        });

        if (!confirmed) return;

        // Call API to cut accessory (this will update cut_quantity and reduce quantity)
        const result = await API.post(API_ENDPOINTS.accessoryCut(accessoryId), {
            quantity: quantity,
            price: price,
            date: date,
            note: note
        });

        console.log(`[saveCutStock] Cut result:`, result);

        loadAccessoriesData();
        closeCutStockModal();
        
        if (result && result.remaining !== undefined) {
            showNotification(`ตัดอะไหล่ ${quantity} ชิ้น สำเร็จ (ราคา ${formatCurrency(price)}) จำนวนเหลือ: ${result.remaining}`);
        } else {
            showNotification(`ตัดอะไหล่ ${quantity} ชิ้น สำเร็จ (ราคา ${formatCurrency(price)})`);
        }
    } catch (error) {
        console.error('Error cutting stock:', error);
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: 'ไม่สามารถตัดอะไหล่ได้: ' + error.message,
            icon: 'error',
            confirmType: 'danger'
        });
    }
}

// Edit cut accessory
async function editCutAccessory(accessoryId) {
    try {
        console.log(`[editCutAccessory] Opening edit modal for accessory ID: ${accessoryId}`);
        
        const accessory = await API.get(`${API_ENDPOINTS.accessories}/${accessoryId}`);
        
        if (!accessory || !accessory.cut_quantity || accessory.cut_quantity === 0) {
            await customAlert({
                title: 'ไม่สามารถแก้ไขได้',
                message: 'ไม่พบข้อมูลการตัดอะไหล่นี้',
                icon: 'error',
                confirmType: 'danger'
            });
            return;
        }
        
        // Fill form with current data
        document.getElementById('editCutAccessoryId').value = accessory.id;
        document.getElementById('editCutAccessoryInfo').textContent = 
            `${accessory.code} - ${getAccessoryTypeName(accessory.type)} - ${accessory.brand} ${accessory.models}`;
        document.getElementById('editCutQuantity').value = accessory.cut_quantity;
        document.getElementById('editCutPrice').value = accessory.repair_price || accessory.repairPrice;
        document.getElementById('editCutDate').value = accessory.cut_date || accessory.cutDate || getTodayDate();
        document.getElementById('editCutNote').value = accessory.note || '';
        
        // Show modal
        document.getElementById('editCutAccessoryModal').classList.add('show');
        
        console.log(`[editCutAccessory] Modal opened for:`, accessory);
    } catch (error) {
        console.error('Error opening edit cut accessory modal:', error);
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: 'ไม่สามารถโหลดข้อมูลอะไหล่ได้',
            icon: 'error',
            confirmType: 'danger'
        });
    }
}

// Close edit cut accessory modal
function closeEditCutAccessoryModal() {
    document.getElementById('editCutAccessoryModal').classList.remove('show');
    document.getElementById('editCutAccessoryForm').reset();
}

// Save edited cut accessory
async function saveEditCutAccessory(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const accessoryId = formData.get('accessoryId');
    const quantity = parseInt(formData.get('quantity'));
    const price = parseFloat(formData.get('price'));
    const date = formData.get('date');
    const note = formData.get('note');
    
    console.log(`[saveEditCutAccessory] Updating cut:`, { accessoryId, quantity, price, date, note });
    
    try {
        // Update cut accessory data
        const result = await API.put(`${API_ENDPOINTS.accessories}/${accessoryId}/cut`, {
            cut_quantity: quantity,
            repair_price: price,
            cut_date: date,
            note: note
        });
        
        console.log(`[saveEditCutAccessory] Update result:`, result);
        
        loadAccessoriesData();
        closeEditCutAccessoryModal();
        
        showNotification(`แก้ไขการตัดอะไหล่สำเร็จ`);
    } catch (error) {
        console.error('Error updating cut accessory:', error);
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: 'ไม่สามารถแก้ไขการตัดอะไหล่ได้: ' + error.message,
            icon: 'error',
            confirmType: 'danger'
        });
    }
}

// Delete cut accessory (revert cut)
async function deleteCutAccessory(accessoryId) {
    try {
        const accessory = await API.get(`${API_ENDPOINTS.accessories}/${accessoryId}`);
        
        if (!accessory || !accessory.cut_quantity || accessory.cut_quantity === 0) {
            await customAlert({
                title: 'ไม่สามารถลบได้',
                message: 'ไม่พบข้อมูลการตัดอะไหล่นี้',
                icon: 'error',
                confirmType: 'danger'
            });
            return;
        }
        
        const confirmed = await customConfirm({
            title: 'ยืนยันการลบ',
            message: `คุณต้องการลบการตัดอะไหล่ ${accessory.code} (${accessory.cut_quantity} ชิ้น) หรือไม่?\n\n` +
                    `การลบจะคืนจำนวนกลับไปยังสต็อก`,
            confirmText: 'ลบ',
            cancelText: 'ยกเลิก',
            confirmType: 'danger'
        });
        
        if (!confirmed) return;
        
        console.log(`[deleteCutAccessory] Deleting cut for accessory ID: ${accessoryId}`);
        
        // Delete cut (revert to stock)
        await API.delete(`${API_ENDPOINTS.accessories}/${accessoryId}/cut`);
        
        loadAccessoriesData();
        
        showNotification(`ลบการตัดอะไหล่สำเร็จ (คืนจำนวนเข้าสต็อก ${accessory.cut_quantity} ชิ้น)`);
    } catch (error) {
        console.error('Error deleting cut accessory:', error);
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: 'ไม่สามารถลบการตัดอะไหล่ได้: ' + error.message,
            icon: 'error',
            confirmType: 'danger'
        });
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

        months.push({
            value: yearMonth,
            label: `${thaiMonths[month]} ${year}` // แสดง ค.ศ.
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
        loadExpenseTable(); // Reload expense table when month changes
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

// ===== Settings: Notifications =====
function loadNotificationSettings() {
    // Load saved settings from localStorage
    const settings = {
        notifyPawnDue: localStorage.getItem('notifyPawnDue') !== 'false',
        notifyInstallmentDue: localStorage.getItem('notifyInstallmentDue') !== 'false',
        notifyRepairComplete: localStorage.getItem('notifyRepairComplete') !== 'false',
        notifyDailySales: localStorage.getItem('notifyDailySales') === 'true',
        notifyMonthlySales: localStorage.getItem('notifyMonthlySales') === 'true',
        notifyLowStock: localStorage.getItem('notifyLowStock') !== 'false'
    };

    // Update checkboxes
    Object.keys(settings).forEach(key => {
        const checkbox = document.getElementById(key);
        if (checkbox) {
            checkbox.checked = settings[key];
        }
    });
}

function saveNotificationSettings() {
    // Get all checkbox values
    const settings = {
        notifyPawnDue: document.getElementById('notifyPawnDue').checked,
        notifyInstallmentDue: document.getElementById('notifyInstallmentDue').checked,
        notifyRepairComplete: document.getElementById('notifyRepairComplete').checked,
        notifyDailySales: document.getElementById('notifyDailySales').checked,
        notifyMonthlySales: document.getElementById('notifyMonthlySales').checked,
        notifyLowStock: document.getElementById('notifyLowStock').checked
    };

    // Save to localStorage
    Object.keys(settings).forEach(key => {
        localStorage.setItem(key, settings[key]);
    });

    alert('บันทึกการตั้งค่าเรียบร้อยแล้ว');
}

// ===== Settings: Employees =====
let employees = [];

async function loadEmployeesData() {
    try {
        // ในอนาคตจะดึงข้อมูลจาก API
        // employees = await API.get(API_ENDPOINTS.employees);
        
        // ตอนนี้ใช้ข้อมูลจาก localStorage เป็นพื้นฐาน
        const savedEmployees = localStorage.getItem('employees');
        if (savedEmployees) {
            employees = JSON.parse(savedEmployees);
        }
        
        displayEmployees();
    } catch (error) {
        console.error('Error loading employees:', error);
    }
}

function displayEmployees() {
    const tbody = document.getElementById('employeesTableBody');
    
    if (employees.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">ยังไม่มีข้อมูลพนักงาน</td></tr>';
        return;
    }

    tbody.innerHTML = employees.map(emp => {
        const statusBadge = emp.status === 'active' ? 
            '<span class="badge badge-success">ทำงาน</span>' : 
            '<span class="badge badge-secondary">ออกแล้ว</span>';
        
        return `
            <tr>
                <td>${emp.code}</td>
                <td>${emp.name}</td>
                <td>${emp.position}</td>
                <td>${emp.phone}</td>
                <td>${emp.stores || '-'}</td>
                <td>${statusBadge}</td>
                <td>
                    <button class="action-btn btn-edit" onclick="openEmployeeModal('${emp.id}')">แก้ไข</button>
                    <button class="action-btn btn-delete" onclick="deleteEmployee('${emp.id}')">ลบ</button>
                </td>
            </tr>
        `;
    }).join('');
}

function openEmployeeModal(employeeId) {
    alert('ฟีเจอร์การจัดการพนักงานจะเพิ่มเติมในอนาคต');
    // TODO: Implement employee modal
}

function deleteEmployee(employeeId) {
    if (confirm('ต้องการลบพนักงานคนนี้หรือไม่?')) {
        employees = employees.filter(emp => emp.id !== employeeId);
        localStorage.setItem('employees', JSON.stringify(employees));
        displayEmployees();
        alert('ลบพนักงานเรียบร้อยแล้ว');
    }
}

// ===== EQUIPMENT (อุปกรณ์) =====

// Data storage for equipment
let equipment = [];

// Switch equipment tab
function switchEquipmentTab(tab) {
    currentAccessoryTab = tab;
    
    // Update tab buttons
    const tabButtons = document.querySelectorAll('#equipment .tab-btn');
    const tabContents = document.querySelectorAll('#equipment .tab-content');
    
    tabButtons.forEach(btn => {
        if (btn.getAttribute('data-tab') === 'equipment-' + tab) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    tabContents.forEach(content => {
        if (content.id === 'equipment-' + tab) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

// Open equipment modal
async function openEquipmentModal(equipmentId = null) {
    const modal = document.getElementById('equipmentModal');
    const modalTitle = document.getElementById('equipmentModalTitle');
    const form = document.getElementById('equipmentForm');

    // Reset form
    form.reset();

    if (equipmentId) {
        modalTitle.textContent = 'แก้ไขอุปกรณ์';
        // TODO: Load equipment data for editing
    } else {
        modalTitle.textContent = 'เพิ่มอุปกรณ์';
    }

    modal.style.display = 'block';
}

// Close equipment modal
function closeEquipmentModal() {
    const modal = document.getElementById('equipmentModal');
    modal.style.display = 'none';
}

// Save equipment
async function saveEquipment(event) {
    event.preventDefault();
    
    const form = document.getElementById('equipmentForm');
    const formData = new FormData(form);
    
    const equipmentData = {
        brand: formData.get('brand'),
        model: formData.get('model'),
        quantity: formData.get('quantity'),
        cost_price: formData.get('costPrice'),
        selling_price: formData.get('sellingPrice'),
        import_date: formData.get('importDate'),
        store: currentStore
    };

    try {
        if (equipmentData.id) {
            // Update existing equipment
            await API.put(`${API_ENDPOINTS.equipment}/${equipmentData.id}`, equipmentData);
            showNotification('แก้ไขอุปกรณ์สำเร็จ');
        } else {
            // Create new equipment
            await API.post(API_ENDPOINTS.equipment, equipmentData);
            showNotification('เพิ่มอุปกรณ์สำเร็จ');
        }

        loadEquipmentData();
        closeEquipmentModal();
    } catch (error) {
        alert('เกิดข้อผิดพลาด: ' + error.message);
    }
}

// Load equipment data
async function loadEquipmentData() {
    try {
        const allEquipment = await API.get(API_ENDPOINTS.equipment, { store: currentStore });
        
        if (!Array.isArray(allEquipment)) {
            console.warn('API returned invalid data:', allEquipment);
            displayEquipment([], 'equipmentTableBody');
            return;
        }
        
        console.log(`[loadEquipmentData] Loaded ${allEquipment.length} equipment items`);
        displayEquipment(allEquipment, 'equipmentTableBody');
    } catch (error) {
        console.error('Error loading equipment:', error);
        displayEquipment([], 'equipmentTableBody');
    }
}

// Display equipment
function displayEquipment(equipmentList, tableBodyId) {
    const tbody = document.getElementById(tableBodyId);
    if (!tbody) return;

    tbody.innerHTML = '';

    if (equipmentList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">ไม่มีข้อมูล</td></tr>';
        return;
    }

    equipmentList.forEach(equipment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${equipment.code || '-'}</td>
            <td>${equipment.brand || '-'}</td>
            <td>${equipment.model || '-'}</td>
            <td>${equipment.quantity || 0}</td>
            <td>฿${Number(equipment.cost_price || 0).toLocaleString()}</td>
            <td>฿${Number(equipment.selling_price || 0).toLocaleString()}</td>
            <td>${equipment.import_date ? new Date(equipment.import_date).toLocaleDateString('th-TH') : '-'}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="openEquipmentModal('${equipment.id}')">แก้ไข</button>
                <button class="btn btn-sm btn-danger" onclick="deleteEquipment('${equipment.id}')">ลบ</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Delete equipment
async function deleteEquipment(equipmentId) {
    if (confirm('ต้องการลบอุปกรณ์นี้หรือไม่?')) {
        try {
            await API.delete(`${API_ENDPOINTS.equipment}/${equipmentId}`);
            loadEquipmentData();
            showNotification('ลบอุปกรณ์สำเร็จ');
        } catch (error) {
            alert('เกิดข้อผิดพลาดในการลบอุปกรณ์: ' + error.message);
        }
    }
}

// Search equipment
function searchEquipment() {
    const searchInput = document.getElementById('searchEquipment');
    const searchTerm = searchInput.value.toLowerCase();
    
    // TODO: Implement search functionality
    loadEquipmentData();
}

// Filter equipment
// Initialize equipment date filter
function initializeEquipmentDateFilter() {
    const monthSelect = document.getElementById('filterEquipmentMonth');
    const yearSelect = document.getElementById('filterEquipmentYear');

    if (!monthSelect || !yearSelect) return;

    // Clear existing options except the first one
    while (monthSelect.options.length > 1) {
        monthSelect.remove(1);
    }
    while (yearSelect.options.length > 1) {
        yearSelect.remove(1);
    }

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

function filterEquipment() {
    const monthSelect = document.getElementById('filterEquipmentMonth');
    const yearSelect = document.getElementById('filterEquipmentYear');

    // TODO: Implement filter functionality
    loadEquipmentData();
}

// ===== NEW DATE RANGE FILTER FUNCTIONS =====

// PAWN (เครื่องขายฝาก)
function filterPawnByDateRange() {
    const startDate = document.getElementById('filterPawnStartDate').value;
    const endDate = document.getElementById('filterPawnEndDate').value;

    currentPawnFilter.startDate = startDate;
    currentPawnFilter.endDate = endDate;

    console.log('🔍 Filtering Pawn:', currentPawnFilter);
    filterPawnByDate();
}

function clearPawnFilter() {
    const startDateInput = document.getElementById('filterPawnStartDate');
    const endDateInput = document.getElementById('filterPawnEndDate');
    const searchInput = document.getElementById('searchPawn');
    
    if (startDateInput) startDateInput.value = '';
    if (endDateInput) endDateInput.value = '';
    if (searchInput) searchInput.value = '';
    
    currentPawnFilter = { startDate: '', endDate: '' };
    loadPawnData();
}

// INSTALLMENT (เครื่องผ่อน)
function filterInstallmentByDateRange() {
    const startDate = document.getElementById('filterInstallmentStartDate').value;
    const endDate = document.getElementById('filterInstallmentEndDate').value;

    currentInstallmentFilter.startDate = startDate;
    currentInstallmentFilter.endDate = endDate;

    console.log('🔍 Filtering Installment:', currentInstallmentFilter);
    updateInstallmentDashboardCards(); // Update dashboard cards with date filter
    filterInstallmentByDate();
}

function clearInstallmentFilter() {
    const startDateInput = document.getElementById('filterInstallmentStartDate');
    const endDateInput = document.getElementById('filterInstallmentEndDate');
    const searchInput = document.getElementById('searchInstallment');
    
    if (startDateInput) startDateInput.value = '';
    if (endDateInput) endDateInput.value = '';
    if (searchInput) searchInput.value = '';
    
    currentInstallmentFilter = { startDate: '', endDate: '' };
    loadInstallmentData();
    updateInstallmentDashboardCards(); // Update dashboard cards after clearing filter
}

// REPAIR (เครื่องซ่อม)
// filterRepairByDateRange() is already defined at line 4441 - removed duplicate

// ACCESSORY (อะไหล่)
function filterAccessoryByDateRange() {
    const startDate = document.getElementById('filterAccessoryStartDate').value;
    const endDate = document.getElementById('filterAccessoryEndDate').value;

    currentAccessoryFilter.startDate = startDate;
    currentAccessoryFilter.endDate = endDate;

    console.log('🔍 Filtering Accessory:', currentAccessoryFilter);
    loadAccessoriesData();
}

// EQUIPMENT (อุปกรณ์)
function filterEquipmentByDateRange() {
    const startDate = document.getElementById('filterEquipmentStartDate').value;
    const endDate = document.getElementById('filterEquipmentEndDate').value;

    console.log('🔍 Filtering Equipment:', { startDate, endDate });
    loadEquipmentData();
}

function resetEquipmentFilter() {
    const startDateInput = document.getElementById('filterEquipmentStartDate');
    const endDateInput = document.getElementById('filterEquipmentEndDate');
    const searchInput = document.getElementById('searchEquipment');
    
    if (startDateInput) startDateInput.value = '';
    if (endDateInput) endDateInput.value = '';
    if (searchInput) searchInput.value = '';
    
    loadEquipmentData();
}

// EXPENSES (ค่าใช้จ่าย)
function filterExpensesByDateRange() {
    const startDate = document.getElementById('expenseStartDate').value;
    const endDate = document.getElementById('expenseEndDate').value;

    console.log('🔍 Filtering Expenses:', { startDate, endDate });
    
    if (startDate || endDate) {
        filterExpensesByCustomRange(startDate, endDate);
    } else {
        loadExpenseData();
    }
}

function clearExpenseFilter() {
    const startDateInput = document.getElementById('expenseStartDate');
    const endDateInput = document.getElementById('expenseEndDate');
    
    if (startDateInput) startDateInput.value = '';
    if (endDateInput) endDateInput.value = '';
    
    loadExpenseData();
}

function filterExpensesByCustomRange(startDate, endDate) {
    console.log('📊 Filtering expenses from', startDate, 'to', endDate);
    loadExpenseData(); // TODO: Add date range filtering logic
}

// DASHBOARD
function filterDashboardByDateRange() {
    const startDate = document.getElementById('dashboardStartDate').value;
    const endDate = document.getElementById('dashboardEndDate').value;

    currentDashboardFilter.startDate = startDate;
    currentDashboardFilter.endDate = endDate;

    console.log('🔍 Filtering Dashboard:', currentDashboardFilter);
    updateDashboard();
}

function clearDashboardDateFilter() {
    const startDateInput = document.getElementById('dashboardStartDate');
    const endDateInput = document.getElementById('dashboardEndDate');
    
    if (startDateInput) startDateInput.value = '';
    if (endDateInput) endDateInput.value = '';
    
    currentDashboardFilter = { startDate: '', endDate: '' };
    updateDashboard();
}
