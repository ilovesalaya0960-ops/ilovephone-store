// ===== EQUIPMENT (รายการอุปกรณ์) =====
// ไฟล์นี้เป็นเทมเพลตสำหรับระบบจัดการอุปกรณ์
// ให้ copy โค้ดนี้ไปใส่ในท้ายไฟล์ script.js

// Mock data for equipment
const equipmentMockData = [
    // ชุดชาร์จ
    {
        id: 'EQ1001',
        type: 'charger-set',
        code: 'CHG-SET-001',
        brand: 'Anker',
        model: 'PowerPort III 20W',
        quantity: 15,
        costPrice: 350,
        salePrice: 590,
        importDate: '2025-09-01',
        note: '',
        store: 'salaya',
        createdAt: '2025-09-01T10:00:00Z'
    },
    {
        id: 'EQ1002',
        type: 'charger-set',
        code: 'CHG-SET-002',
        brand: 'Belkin',
        model: 'BoostCharge 30W',
        quantity: 10,
        costPrice: 450,
        salePrice: 750,
        importDate: '2025-09-05',
        note: '',
        store: 'salaya',
        createdAt: '2025-09-05T10:00:00Z'
    },

    // สายชาร์จ
    {
        id: 'EQ1003',
        type: 'cable',
        code: 'CAB-001',
        brand: 'Apple',
        model: 'Lightning to USB-C Cable 1m',
        quantity: 25,
        costPrice: 200,
        salePrice: 390,
        importDate: '2025-09-01',
        note: '',
        store: 'salaya',
        createdAt: '2025-09-01T10:00:00Z'
    },
    {
        id: 'EQ1004',
        type: 'cable',
        code: 'CAB-002',
        brand: 'Samsung',
        model: 'Type-C to Type-C 1.5m',
        quantity: 20,
        costPrice: 150,
        salePrice: 290,
        importDate: '2025-09-05',
        note: '',
        store: 'salaya',
        createdAt: '2025-09-05T10:00:00Z'
    },
    {
        id: 'EQ1005',
        type: 'cable',
        code: 'CAB-003',
        brand: 'Baseus',
        model: 'Fast Charging Type-C 2m',
        quantity: 0,
        costPrice: 120,
        salePrice: 250,
        importDate: '2025-08-20',
        note: 'หมดสต็อก สั่งเพิ่ม',
        store: 'salaya',
        createdAt: '2025-08-20T10:00:00Z'
    },

    // หัวชาร์จ
    {
        id: 'EQ1006',
        type: 'adapter',
        code: 'ADP-001',
        brand: 'Apple',
        model: '20W USB-C Power Adapter',
        quantity: 12,
        costPrice: 300,
        salePrice: 590,
        importDate: '2025-09-10',
        note: '',
        store: 'salaya',
        createdAt: '2025-09-10T10:00:00Z'
    },
    {
        id: 'EQ1007',
        type: 'adapter',
        code: 'ADP-002',
        brand: 'Anker',
        model: 'Nano II 45W',
        quantity: 8,
        costPrice: 450,
        salePrice: 790,
        importDate: '2025-09-12',
        note: '',
        store: 'salaya',
        createdAt: '2025-09-12T10:00:00Z'
    },

    // หูฟัง
    {
        id: 'EQ1008',
        type: 'earphone',
        code: 'EAR-001',
        brand: 'Apple',
        model: 'EarPods with Lightning',
        quantity: 18,
        costPrice: 250,
        salePrice: 490,
        importDate: '2025-09-01',
        note: '',
        store: 'salaya',
        createdAt: '2025-09-01T10:00:00Z'
    },
    {
        id: 'EQ1009',
        type: 'earphone',
        code: 'EAR-002',
        brand: 'Samsung',
        model: 'Type-C Earphones',
        quantity: 15,
        costPrice: 180,
        salePrice: 350,
        importDate: '2025-09-05',
        note: '',
        store: 'salaya',
        createdAt: '2025-09-05T10:00:00Z'
    },

    // หูฟังบลูทูธ
    {
        id: 'EQ1010',
        type: 'bluetooth',
        code: 'BT-001',
        brand: 'Apple',
        model: 'AirPods (2nd generation)',
        quantity: 5,
        costPrice: 3500,
        salePrice: 4990,
        importDate: '2025-09-15',
        note: '',
        store: 'salaya',
        createdAt: '2025-09-15T10:00:00Z'
    },
    {
        id: 'EQ1011',
        type: 'bluetooth',
        code: 'BT-002',
        brand: 'Samsung',
        model: 'Galaxy Buds2',
        quantity: 4,
        costPrice: 2500,
        salePrice: 3990,
        importDate: '2025-09-18',
        note: '',
        store: 'salaya',
        createdAt: '2025-09-18T10:00:00Z'
    },
    {
        id: 'EQ1012',
        type: 'bluetooth',
        code: 'BT-003',
        brand: 'JBL',
        model: 'Tune 230NC TWS',
        quantity: 0,
        costPrice: 1800,
        salePrice: 2990,
        importDate: '2025-08-25',
        note: 'ขายดี รอของเข้า',
        store: 'salaya',
        createdAt: '2025-08-25T10:00:00Z'
    },

    // ฟิล์มกันรอย
    {
        id: 'EQ1013',
        type: 'screen-protector',
        code: 'FILM-001',
        brand: 'Spigen',
        model: 'Tempered Glass iPhone 14',
        quantity: 30,
        costPrice: 80,
        salePrice: 190,
        importDate: '2025-09-01',
        note: '',
        store: 'salaya',
        createdAt: '2025-09-01T10:00:00Z'
    },
    {
        id: 'EQ1014',
        type: 'screen-protector',
        code: 'FILM-002',
        brand: 'Nillkin',
        model: 'Anti-Glare Galaxy S23',
        quantity: 25,
        costPrice: 70,
        salePrice: 150,
        importDate: '2025-09-05',
        note: '',
        store: 'salaya',
        createdAt: '2025-09-05T10:00:00Z'
    },

    // แบตสำรอง
    {
        id: 'EQ1015',
        type: 'powerbank',
        code: 'PB-001',
        brand: 'Anker',
        model: 'PowerCore 10000mAh',
        quantity: 12,
        costPrice: 550,
        salePrice: 990,
        importDate: '2025-09-10',
        note: '',
        store: 'salaya',
        createdAt: '2025-09-10T10:00:00Z'
    },
    {
        id: 'EQ1016',
        type: 'powerbank',
        code: 'PB-002',
        brand: 'Xiaomi',
        model: 'Mi Power Bank 20000mAh',
        quantity: 8,
        costPrice: 450,
        salePrice: 790,
        importDate: '2025-09-12',
        note: '',
        store: 'salaya',
        createdAt: '2025-09-12T10:00:00Z'
    },

    // ลำโพง
    {
        id: 'EQ1017',
        type: 'speaker',
        code: 'SPK-001',
        brand: 'JBL',
        model: 'Flip 6 Portable',
        quantity: 6,
        costPrice: 2500,
        salePrice: 4290,
        importDate: '2025-09-15',
        note: '',
        store: 'salaya',
        createdAt: '2025-09-15T10:00:00Z'
    },
    {
        id: 'EQ1018',
        type: 'speaker',
        code: 'SPK-002',
        brand: 'Sony',
        model: 'SRS-XB23 Extra Bass',
        quantity: 5,
        costPrice: 2200,
        salePrice: 3790,
        importDate: '2025-09-18',
        note: '',
        store: 'salaya',
        createdAt: '2025-09-18T10:00:00Z'
    },

    // เคสมือถือ
    {
        id: 'EQ1019',
        type: 'case',
        code: 'CASE-001',
        brand: 'Spigen',
        model: 'Liquid Air iPhone 14 Pro',
        quantity: 20,
        costPrice: 150,
        salePrice: 390,
        importDate: '2025-09-01',
        note: '',
        store: 'salaya',
        createdAt: '2025-09-01T10:00:00Z'
    },
    {
        id: 'EQ1020',
        type: 'case',
        code: 'CASE-002',
        brand: 'OtterBox',
        model: 'Defender Galaxy S23',
        quantity: 15,
        costPrice: 250,
        salePrice: 590,
        importDate: '2025-09-05',
        note: '',
        store: 'salaya',
        createdAt: '2025-09-05T10:00:00Z'
    },
    {
        id: 'EQ1021',
        type: 'case',
        code: 'CASE-003',
        brand: 'Ringke',
        model: 'Fusion iPhone 13',
        quantity: 18,
        costPrice: 120,
        salePrice: 290,
        importDate: '2025-09-08',
        note: '',
        store: 'salaya',
        createdAt: '2025-09-08T10:00:00Z'
    },

    // ร้านคลองโยง
    {
        id: 'EQ2001',
        type: 'charger-set',
        code: 'CHG-SET-KY001',
        brand: 'Baseus',
        model: 'GaN Charger 65W',
        quantity: 8,
        costPrice: 550,
        salePrice: 990,
        importDate: '2025-09-10',
        note: '',
        store: 'klongyong',
        createdAt: '2025-09-10T10:00:00Z'
    },
    {
        id: 'EQ2002',
        type: 'cable',
        code: 'CAB-KY001',
        brand: 'Ugreen',
        model: 'Type-C Cable 3m',
        quantity: 12,
        costPrice: 180,
        salePrice: 350,
        importDate: '2025-09-12',
        note: '',
        store: 'klongyong',
        createdAt: '2025-09-12T10:00:00Z'
    },
    {
        id: 'EQ2003',
        type: 'powerbank',
        code: 'PB-KY001',
        brand: 'Romoss',
        model: 'Sense 6P 20000mAh',
        quantity: 0,
        costPrice: 400,
        salePrice: 690,
        importDate: '2025-08-30',
        note: 'หมดสต็อก',
        store: 'klongyong',
        createdAt: '2025-08-30T10:00:00Z'
    },
    {
        id: 'EQ2004',
        type: 'case',
        code: 'CASE-KY001',
        brand: 'UAG',
        model: 'Monarch iPhone 14',
        quantity: 10,
        costPrice: 450,
        salePrice: 890,
        importDate: '2025-09-15',
        note: '',
        store: 'klongyong',
        createdAt: '2025-09-15T10:00:00Z'
    },
    {
        id: 'EQ2005',
        type: 'screen-protector',
        code: 'FILM-KY001',
        brand: 'Hoda',
        model: 'Privacy Glass iPhone 13',
        quantity: 18,
        costPrice: 120,
        salePrice: 290,
        importDate: '2025-09-18',
        note: '',
        store: 'klongyong',
        createdAt: '2025-09-18T10:00:00Z'
    }
];

// Data storage
let equipment = [];

// Current state
let currentEquipmentTab = 'charger-set';
let currentEquipmentFilter = {
    search: '',
    month: '',
    year: ''
};
let currentEquipmentEditId = null;

// Initialize equipment database
function initializeEquipmentDatabase() {
    const stored = localStorage.getItem('equipment');
    if (!stored) {
        equipment = equipmentMockData;
        localStorage.setItem('equipment', JSON.stringify(equipment));
    } else {
        equipment = JSON.parse(stored);
    }
}

// Open equipment modal
function openEquipmentModal(equipmentId = null) {
    const modal = document.getElementById('equipmentModal');
    const modalTitle = document.getElementById('equipmentModalTitle');
    const form = document.getElementById('equipmentForm');

    form.reset();
    currentEquipmentEditId = equipmentId;

    if (equipmentId) {
        // Edit mode
        modalTitle.textContent = 'แก้ไขอุปกรณ์';
        const eq = equipment.find(e => e.id === equipmentId);
        if (eq) {
            document.getElementById('equipmentType').value = eq.type;
            document.getElementById('equipmentCode').value = eq.code;
            document.getElementById('equipmentBrand').value = eq.brand;
            document.getElementById('equipmentModel').value = eq.model;
            document.getElementById('equipmentQuantity').value = eq.quantity;
            document.getElementById('equipmentCostPrice').value = eq.costPrice;
            document.getElementById('equipmentSalePrice').value = eq.salePrice;
            document.getElementById('equipmentImportDate').value = eq.importDate;
            document.getElementById('equipmentNote').value = eq.note || '';
        }
    } else {
        // Add mode
        modalTitle.textContent = 'เพิ่มอุปกรณ์';
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('equipmentImportDate').value = today;

        // Set default type based on current tab
        if (currentEquipmentTab !== 'outofstock') {
            document.getElementById('equipmentType').value = currentEquipmentTab;
        }
    }

    modal.classList.add('show');
}

// Close equipment modal
function closeEquipmentModal() {
    const modal = document.getElementById('equipmentModal');
    modal.classList.remove('show');
    currentEquipmentEditId = null;
}

// Save equipment
function saveEquipment(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const eq = {
        id: currentEquipmentEditId || ('EQ' + Date.now().toString()),
        type: formData.get('type'),
        code: formData.get('code'),
        brand: formData.get('brand'),
        model: formData.get('model'),
        quantity: parseInt(formData.get('quantity')),
        costPrice: parseInt(formData.get('costPrice')),
        salePrice: parseInt(formData.get('salePrice')),
        importDate: formData.get('importDate'),
        note: formData.get('note') || '',
        store: currentStore,
        createdAt: currentEquipmentEditId ? equipment.find(e => e.id === currentEquipmentEditId).createdAt : new Date().toISOString()
    };

    if (currentEquipmentEditId) {
        // Update
        const index = equipment.findIndex(e => e.id === currentEquipmentEditId);
        equipment[index] = eq;
    } else {
        // Add
        equipment.push(eq);
    }

    localStorage.setItem('equipment', JSON.stringify(equipment));
    loadEquipmentData();
    closeEquipmentModal();

    const message = currentEquipmentEditId ? 'อัพเดทข้อมูลอุปกรณ์สำเร็จ' : 'เพิ่มอุปกรณ์สำเร็จ';
    showNotification(message);
}

// Delete equipment
function deleteEquipment(equipmentId) {
    if (!confirm('คุณต้องการลบอุปกรณ์นี้ใช่หรือไม่?')) return;

    equipment = equipment.filter(e => e.id !== equipmentId);
    localStorage.setItem('equipment', JSON.stringify(equipment));
    loadEquipmentData();
    showNotification('ลบอุปกรณ์สำเร็จ');
}

// Switch equipment tab
function switchEquipmentTab(tab) {
    currentEquipmentTab = tab;

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

// Load equipment data
function loadEquipmentData() {
    // Get filtered equipment
    let filteredEquipment = equipment.filter(e => e.store === currentStore);

    // Apply search
    if (currentEquipmentFilter.search) {
        const search = currentEquipmentFilter.search.toLowerCase();
        filteredEquipment = filteredEquipment.filter(e =>
            e.brand.toLowerCase().includes(search) ||
            e.code.toLowerCase().includes(search) ||
            e.model.toLowerCase().includes(search)
        );
    }

    // Apply date filter
    if (currentEquipmentFilter.month || currentEquipmentFilter.year) {
        filteredEquipment = filteredEquipment.filter(e => {
            const date = new Date(e.importDate);
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            const monthMatch = !currentEquipmentFilter.month || month == currentEquipmentFilter.month;
            const yearMatch = !currentEquipmentFilter.year || year == currentEquipmentFilter.year;

            return monthMatch && yearMatch;
        });
    }

    // Separate by type
    const chargerSets = filteredEquipment.filter(e => e.type === 'charger-set' && e.quantity > 0);
    const cables = filteredEquipment.filter(e => e.type === 'cable' && e.quantity > 0);
    const adapters = filteredEquipment.filter(e => e.type === 'adapter' && e.quantity > 0);
    const earphones = filteredEquipment.filter(e => e.type === 'earphone' && e.quantity > 0);
    const bluetooths = filteredEquipment.filter(e => e.type === 'bluetooth' && e.quantity > 0);
    const screenProtectors = filteredEquipment.filter(e => e.type === 'screen-protector' && e.quantity > 0);
    const powerbanks = filteredEquipment.filter(e => e.type === 'powerbank' && e.quantity > 0);
    const speakers = filteredEquipment.filter(e => e.type === 'speaker' && e.quantity > 0);
    const cases = filteredEquipment.filter(e => e.type === 'case' && e.quantity > 0);
    const outOfStock = filteredEquipment.filter(e => e.quantity === 0);

    // Update counts
    document.getElementById('chargerSetCount').textContent = chargerSets.length;
    document.getElementById('cableCount').textContent = cables.length;
    document.getElementById('adapterCount').textContent = adapters.length;
    document.getElementById('earphoneCount').textContent = earphones.length;
    document.getElementById('bluetoothCount').textContent = bluetooths.length;
    document.getElementById('screenProtectorCount').textContent = screenProtectors.length;
    document.getElementById('powerbankCount').textContent = powerbanks.length;
    document.getElementById('speakerCount').textContent = speakers.length;
    document.getElementById('caseCount').textContent = cases.length;
    document.getElementById('equipmentOutofstockCount').textContent = outOfStock.length;

    // Display equipment
    displayEquipment(chargerSets, 'chargerSetTableBody');
    displayEquipment(cables, 'cableTableBody');
    displayEquipment(adapters, 'adapterTableBody');
    displayEquipment(earphones, 'earphoneTableBody');
    displayEquipment(bluetooths, 'bluetoothTableBody');
    displayEquipment(screenProtectors, 'screenProtectorTableBody');
    displayEquipment(powerbanks, 'powerbankTableBody');
    displayEquipment(speakers, 'speakerTableBody');
    displayEquipment(cases, 'caseTableBody');
    displayOutOfStockEquipment(outOfStock, 'equipmentOutofstockTableBody');
}

// Display equipment
function displayEquipment(equipmentList, tableBodyId) {
    const tbody = document.getElementById(tableBodyId);
    if (!tbody) return;

    if (equipmentList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-state">ไม่มีข้อมูล</td></tr>';
        return;
    }

    tbody.innerHTML = equipmentList.map(eq => `
        <tr>
            <td>${eq.code}</td>
            <td>${eq.brand}</td>
            <td>${eq.model}</td>
            <td><strong>${eq.quantity}</strong></td>
            <td>${formatCurrency(eq.costPrice)}</td>
            <td>${formatCurrency(eq.salePrice)}</td>
            <td>${formatDate(eq.importDate)}</td>
            <td>
                <button class="btn-action btn-edit" onclick="openEquipmentModal('${eq.id}')">แก้ไข</button>
                <button class="btn-action btn-delete" onclick="deleteEquipment('${eq.id}')">ลบ</button>
            </td>
        </tr>
    `).join('');
}

// Display out of stock equipment
function displayOutOfStockEquipment(equipmentList, tableBodyId) {
    const tbody = document.getElementById(tableBodyId);
    if (!tbody) return;

    if (equipmentList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-state">ไม่มีอุปกรณ์ที่หมดสต็อก</td></tr>';
        return;
    }

    const typeNames = {
        'charger-set': 'ชุดชาร์จ',
        'cable': 'สายชาร์จ',
        'adapter': 'หัวชาร์จ',
        'earphone': 'หูฟัง',
        'bluetooth': 'หูฟังบลูทูธ',
        'screen-protector': 'ฟิล์มกันรอย',
        'powerbank': 'แบตสำรอง',
        'speaker': 'ลำโพง',
        'case': 'เคสมือถือ'
    };

    tbody.innerHTML = equipmentList.map(eq => `
        <tr style="background: #fff5f5;">
            <td>${eq.code}</td>
            <td><span class="badge badge-danger">${typeNames[eq.type]}</span></td>
            <td>${eq.brand}</td>
            <td>${eq.model}</td>
            <td>${formatCurrency(eq.costPrice)}</td>
            <td>${formatCurrency(eq.salePrice)}</td>
            <td>${formatDate(eq.importDate)}</td>
            <td>
                <button class="btn-action btn-edit" onclick="openEquipmentModal('${eq.id}')">แก้ไข</button>
                <button class="btn-action btn-delete" onclick="deleteEquipment('${eq.id}')">ลบ</button>
            </td>
        </tr>
    `).join('');
}

// Search equipment
function searchEquipment() {
    const searchInput = document.getElementById('searchEquipment');
    currentEquipmentFilter.search = searchInput.value;
    loadEquipmentData();
}

// Filter equipment
function filterEquipment() {
    const monthSelect = document.getElementById('filterEquipmentMonth');
    const yearSelect = document.getElementById('filterEquipmentYear');

    currentEquipmentFilter.month = monthSelect.value;
    currentEquipmentFilter.year = yearSelect.value;

    loadEquipmentData();
}

// Reset equipment filter
function resetEquipmentFilter() {
    document.getElementById('searchEquipment').value = '';
    document.getElementById('filterEquipmentMonth').value = '';
    document.getElementById('filterEquipmentYear').value = '';

    currentEquipmentFilter = {
        search: '',
        month: '',
        year: ''
    };

    loadEquipmentData();
}

// Initialize equipment date filter
function initializeEquipmentDateFilter() {
    const monthSelect = document.getElementById('filterEquipmentMonth');
    const yearSelect = document.getElementById('filterEquipmentYear');

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

// ========================================
// เพิ่มฟังก์ชันเหล่านี้ใน DOMContentLoaded:
// - initializeEquipmentDatabase();
// - loadEquipmentData();
// - initializeEquipmentDateFilter();
//
// เพิ่มใน initializeStoreSelector:
// - loadEquipmentData();
// ========================================
