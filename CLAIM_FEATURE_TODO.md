# สรุปงานที่เหลือ - ฟีเจอร์เคลม

## ✅ สิ่งที่ทำเสร็จแล้ว (HTML)

### หน้าเครื่องมือหนึ่ง (new-devices)
- ✅ เพิ่มแท็บ "เคลม" (claimed)
- ✅ เพิ่ม tab content `claimed-tab` พร้อมตาราง

### หน้าเครื่องมือสอง (used-devices)
- ✅ เพิ่มแท็บ "เคลม" (used-claimed)
- ✅ เพิ่ม tab content `used-claimed-tab` พร้อมตาราง

### Modals
- ✅ เพิ่ม `claimDeviceModal` (modal สำหรับเคลมเครื่อง)
- ✅ เพิ่ม `returnToStockModal` (modal สำหรับคืนสต๊อค)

---

## 📋 งานที่ต้องทำต่อใน JavaScript (script.js)

### 1. เพิ่มตัวเลือก "เคลม" ใน dropdown ของตาราง

#### หน้าเครื่องมือหนึ่ง - Tab "สต๊อค"
ใน `displayDevices()` หรือที่แสดงตาราง stock-tab:
```javascript
<select class="device-action-select" id="new-action-${device.id}">
    <option value="">-- เลือกการจัดการ --</option>
    <option value="view">รายการ</option>
    <option value="sell">ขาย</option>
    <option value="installment">ผ่อน</option>
    <option value="remove">ตัด</option>
    <option value="claim">เคลม</option> <!-- เพิ่มตัวเลือกนี้ -->
    <option value="edit">แก้ไข</option>
    <option value="delete">ลบ</option>
</select>
```

#### หน้าเครื่องมือสอง - Tab "สต๊อค"
ใน `displayUsedDevices()` หรือที่แสดงตาราง used-stock-tab:
```javascript
<select class="device-action-select" id="used-action-${device.id}">
    <option value="">-- เลือกการจัดการ --</option>
    <option value="view">รายการ</option>
    <option value="sell">ขาย</option>
    <option value="installment">ผ่อน</option>
    <option value="remove">ตัด</option>
    <option value="claim">เคลม</option> <!-- เพิ่มตัวเลือกนี้ -->
    <option value="edit">แก้ไข</option>
    <option value="delete">ลบ</option>
</select>
```

---

### 2. เพิ่ม case 'claim' ใน executeNewDeviceAction และ executeUsedDeviceAction

#### ใน `executeNewDeviceAction()`
```javascript
async function executeNewDeviceAction(deviceId) {
    // ... existing code ...
    
    switch (action) {
        case 'view':
            await viewNewDeviceDetail(deviceId);
            break;
        case 'sell':
            await markAsSold(deviceId);
            break;
        case 'installment':
            await transferToInstallment(deviceId);
            break;
        case 'remove':
            await markAsRemoved(deviceId);
            break;
        case 'claim':
            await openClaimDeviceModal(deviceId, 'new'); // เพิ่มนี้
            break;
        case 'back-stock':
            await moveBackToStock(deviceId);
            break;
        case 'edit':
            await openNewDeviceModal(deviceId);
            break;
        case 'delete':
            await deleteDevice(deviceId);
            break;
        // ... rest
    }
}
```

#### ใน `executeUsedDeviceAction()`
```javascript
async function executeUsedDeviceAction(deviceId) {
    // ... existing code ...
    
    switch (action) {
        case 'view':
            await viewUsedDeviceDetail(deviceId);
            break;
        case 'sell':
            await markUsedAsSold(deviceId);
            break;
        case 'installment':
            await transferUsedToInstallment(deviceId);
            break;
        case 'remove':
            await markUsedAsRemoved(deviceId);
            break;
        case 'claim':
            await openClaimDeviceModal(deviceId, 'used'); // เพิ่มนี้
            break;
        case 'back-stock':
            await moveUsedBackToStock(deviceId);
            break;
        case 'edit':
            await openUsedDeviceModal(deviceId);
            break;
        case 'delete':
            await deleteUsedDevice(deviceId);
            break;
        // ... rest
    }
}
```

---

### 3. เพิ่มฟังก์ชันเปิด/ปิด Modal

```javascript
// Open claim device modal
function openClaimDeviceModal(deviceId, deviceType) {
    const modal = document.getElementById('claimDeviceModal');
    const form = document.getElementById('claimDeviceForm');
    
    // Reset form
    form.reset();
    
    // Set device info
    document.getElementById('claimDeviceId').value = deviceId;
    document.getElementById('claimDeviceType').value = deviceType; // 'new' or 'used'
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('claimDate').value = today;
    
    // Show modal
    modal.classList.add('show');
}

// Close claim device modal
function closeClaimDeviceModal() {
    const modal = document.getElementById('claimDeviceModal');
    modal.classList.remove('show');
    document.getElementById('claimDeviceForm').reset();
}

// Open return to stock modal
function openReturnToStockModal(deviceId, deviceType) {
    const modal = document.getElementById('returnToStockModal');
    const form = document.getElementById('returnToStockForm');
    
    // Reset form
    form.reset();
    
    // Set device info
    document.getElementById('returnDeviceId').value = deviceId;
    document.getElementById('returnDeviceType').value = deviceType; // 'new' or 'used'
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('returnDate').value = today;
    
    // Show modal
    modal.classList.add('show');
}

// Close return to stock modal
function closeReturnToStockModal() {
    const modal = document.getElementById('returnToStockModal');
    modal.classList.remove('show');
    document.getElementById('returnToStockForm').reset();
}
```

---

### 4. เพิ่มฟังก์ชันบันทึกเคลม

```javascript
// Save claim device
async function saveClaimDevice(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const deviceId = formData.get('deviceId');
    const deviceType = formData.get('deviceType'); // 'new' or 'used'
    const claimDate = formData.get('claimDate');
    const note = formData.get('note') || '';
    
    try {
        // ดึงข้อมูลเดิม
        let device;
        let endpoint;
        
        if (deviceType === 'new') {
            endpoint = `${API_ENDPOINTS.newDevices}/${deviceId}`;
            device = await API.get(endpoint);
        } else {
            endpoint = `${API_ENDPOINTS.usedDevices}/${deviceId}`;
            device = await API.get(endpoint);
        }
        
        if (!device) {
            throw new Error('ไม่พบข้อมูลเครื่อง');
        }
        
        // Confirm with user
        const confirmed = await customConfirm({
            title: 'ยืนยันการเคลม',
            message: `คุณต้องการเคลมเครื่อง ${device.brand} ${device.model} ใช่หรือไม่?`,
            icon: 'question',
            confirmText: 'ยืนยันเคลม',
            cancelText: 'ยกเลิก',
            confirmType: 'primary',
            list: [
                { icon: 'info', iconSymbol: '📋', text: 'เครื่องจะถูกย้ายไปแท็บ "เคลม"' },
                { icon: 'info', iconSymbol: '📅', text: `วันที่เคลม: ${formatDate(claimDate)}` }
            ]
        });
        
        if (!confirmed) return;
        
        // สร้าง note ที่รวมเหตุผลการเคลม
        let updatedNote = note.trim();
        if (device.note) {
            updatedNote = device.note + '\n\nเคลมวันที่ ' + formatDate(claimDate) + ': ' + updatedNote;
        } else {
            updatedNote = 'เคลมวันที่ ' + formatDate(claimDate) + ': ' + updatedNote;
        }
        
        // อัปเดต status เป็น 'claimed' และเพิ่ม claim_date
        const updateData = {
            ...device,
            status: 'claimed',
            claim_date: claimDate,
            sale_date: claimDate, // ใช้ claim_date เป็น sale_date สำหรับการแสดงผล
            note: updatedNote
        };
        
        // ส่งข้อมูลอัปเดตไปที่ API
        await API.put(endpoint, updateData);
        
        // Reload data
        if (deviceType === 'new') {
            loadNewDevicesData();
        } else {
            loadUsedDevicesData();
        }
        
        closeClaimDeviceModal();
        showNotification('บันทึกเคลมสำเร็จ');
        
    } catch (error) {
        console.error('Error claiming device:', error);
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: error.message || 'ไม่สามารถบันทึกข้อมูลได้',
            icon: 'error',
            confirmType: 'danger'
        });
    }
}
```

---

### 5. เพิ่มฟังก์ชันคืนสต๊อค

```javascript
// Save return to stock
async function saveReturnToStock(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const deviceId = formData.get('deviceId');
    const deviceType = formData.get('deviceType'); // 'new' or 'used'
    const returnDate = formData.get('returnDate');
    const note = formData.get('note') || '';
    
    try {
        // ดึงข้อมูลเดิม
        let device;
        let endpoint;
        
        if (deviceType === 'new') {
            endpoint = `${API_ENDPOINTS.newDevices}/${deviceId}`;
            device = await API.get(endpoint);
        } else {
            endpoint = `${API_ENDPOINTS.usedDevices}/${deviceId}`;
            device = await API.get(endpoint);
        }
        
        if (!device) {
            throw new Error('ไม่พบข้อมูลเครื่อง');
        }
        
        // Confirm with user
        const confirmed = await customConfirm({
            title: 'ยืนยันคืนสต๊อค',
            message: `คุณต้องการคืนเครื่อง ${device.brand} ${device.model} กลับสต๊อคใช่หรือไม่?`,
            icon: 'question',
            confirmText: 'ยืนยันคืนสต๊อค',
            cancelText: 'ยกเลิก',
            confirmType: 'primary',
            list: [
                { icon: 'info', iconSymbol: '↩️', text: 'เครื่องจะกลับไปอยู่ในแท็บ "สต๊อค"' },
                { icon: 'info', iconSymbol: '📅', text: `วันที่คืนสต๊อค: ${formatDate(returnDate)}` },
                { icon: 'info', iconSymbol: 'ℹ️', text: 'ข้อมูลการเคลมจะถูกเก็บไว้ในหมายเหตุ' }
            ]
        });
        
        if (!confirmed) return;
        
        // สร้าง note ที่รวมข้อมูลการคืนสต๊อค
        let updatedNote = note.trim();
        if (device.note) {
            updatedNote = device.note + '\n\nคืนสต๊อควันที่ ' + formatDate(returnDate) + ': ' + updatedNote;
        } else {
            updatedNote = 'คืนสต๊อควันที่ ' + formatDate(returnDate) + ': ' + updatedNote;
        }
        
        // อัปเดต status กลับเป็น 'stock' และลบ claim_date, sale_date
        const updateData = {
            ...device,
            status: 'stock',
            claim_date: null,
            sale_date: null,
            note: updatedNote
        };
        
        // ส่งข้อมูลอัปเดตไปที่ API
        await API.put(endpoint, updateData);
        
        // Reload data
        if (deviceType === 'new') {
            loadNewDevicesData();
        } else {
            loadUsedDevicesData();
        }
        
        closeReturnToStockModal();
        showNotification('คืนสต๊อคสำเร็จ');
        
    } catch (error) {
        console.error('Error returning to stock:', error);
        await customAlert({
            title: 'เกิดข้อผิดพลาด',
            message: error.message || 'ไม่สามารถบันทึกข้อมูลได้',
            icon: 'error',
            confirmType: 'danger'
        });
    }
}
```

---

### 6. อัปเดต Tab Initialization

#### เพิ่มใน `initializeNewTabs()`
```javascript
function initializeNewTabs() {
    const tabButtons = document.querySelectorAll('#new-devices .tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Remove active class from all tabs
            document.querySelectorAll('#new-devices .tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('#new-devices .tab-content').forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // แสดง content ที่ถูกต้อง
            if (tabName === 'stock') {
                document.getElementById('stock-tab').classList.add('active');
            } else if (tabName === 'sold') {
                document.getElementById('sold-tab').classList.add('active');
            } else if (tabName === 'removed') {
                document.getElementById('removed-tab').classList.add('active');
            } else if (tabName === 'claimed') {
                document.getElementById('claimed-tab').classList.add('active');
            }
        });
    });
}
```

#### เพิ่มใน `initializeUsedTabs()`
```javascript
function initializeUsedTabs() {
    const tabButtons = document.querySelectorAll('#used-devices .tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Remove active class from all tabs
            document.querySelectorAll('#used-devices .tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('#used-devices .tab-content').forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // แสดง content ที่ถูกต้อง
            if (tabName === 'used-stock') {
                document.getElementById('used-stock-tab').classList.add('active');
            } else if (tabName === 'used-sold') {
                document.getElementById('used-sold-tab').classList.add('active');
            } else if (tabName === 'used-removed') {
                document.getElementById('used-removed-tab').classList.add('active');
            } else if (tabName === 'used-claimed') {
                document.getElementById('used-claimed-tab').classList.add('active');
            }
        });
    });
}
```

---

### 7. อัปเดต `loadNewDevicesData()` และ `loadUsedDevicesData()`

เพิ่มการนับและแสดงเครื่องที่ถูกเคลม:

```javascript
function loadNewDevicesData() {
    // ... existing code ...
    
    // Filter by status
    const stockDevices = filteredDevices.filter(d => d.status === 'stock');
    const soldDevices = filteredDevices.filter(d => d.status === 'sold');
    const removedDevices = filteredDevices.filter(d => d.status === 'removed');
    const claimedDevices = filteredDevices.filter(d => d.status === 'claimed'); // เพิ่มนี้
    
    // Update counts
    document.getElementById('newStockCount').textContent = stockDevices.length;
    document.getElementById('newSoldCount').textContent = soldDevices.length;
    document.getElementById('newRemovedCount').textContent = removedDevices.length;
    document.getElementById('newClaimedCount').textContent = claimedDevices.length; // เพิ่มนี้
    
    // Display devices in respective tables
    displayDevices(stockDevices, 'stockTableBody', 'stock');
    displayDevices(soldDevices, 'soldTableBody', 'sold');
    displayDevices(removedDevices, 'removedTableBody', 'removed');
    displayDevices(claimedDevices, 'claimedTableBody', 'claimed'); // เพิ่มนี้
}

function loadUsedDevicesData() {
    // ... existing code ...
    
    // Filter by status
    const stockDevices = filteredDevices.filter(d => d.status === 'stock');
    const soldDevices = filteredDevices.filter(d => d.status === 'sold');
    const removedDevices = filteredDevices.filter(d => d.status === 'removed');
    const claimedDevices = filteredDevices.filter(d => d.status === 'claimed'); // เพิ่มนี้
    
    // Update counts
    document.getElementById('usedStockCount').textContent = stockDevices.length;
    document.getElementById('usedSoldCount').textContent = soldDevices.length;
    document.getElementById('usedRemovedCount').textContent = removedDevices.length;
    document.getElementById('usedClaimedCount').textContent = claimedDevices.length; // เพิ่มนี้
    
    // Display devices in respective tables
    displayUsedDevices(stockDevices, 'usedStockTableBody', 'stock');
    displayUsedDevices(soldDevices, 'usedSoldTableBody', 'sold');
    displayUsedDevices(removedDevices, 'usedRemovedTableBody', 'removed');
    displayUsedDevices(claimedDevices, 'usedClaimedTableBody', 'claimed'); // เพิ่มนี้
}
```

---

### 8. อัปเดต `displayDevices()` เพื่อรองรับ type='claimed'

```javascript
function displayDevices(devices, tableBodyId, type) {
    const tbody = document.getElementById(tableBodyId);
    
    if (!tbody) return;
    
    if (devices.length === 0) {
        let colspan = '9';
        if (type === 'sold') colspan = '11';
        if (type === 'removed') colspan = '11';
        if (type === 'claimed') colspan = '10'; // เพิ่มนี้
        tbody.innerHTML = `<tr><td colspan="${colspan}" class="empty-state">ไม่มีข้อมูล</td></tr>`;
        return;
    }
    
    tbody.innerHTML = devices.map(device => {
        const purchasePrice = device.purchase_price || device.purchasePrice;
        const salePrice = device.sale_price || device.salePrice;
        const importDate = device.import_date || device.importDate;
        const saleDate = device.sale_date || device.saleDate;
        const claimDate = device.claim_date || device.claimDate || saleDate; // เพิ่มนี้
        
        if (type === 'stock') {
            // ... existing code ...
        } else if (type === 'sold') {
            // ... existing code ...
        } else if (type === 'removed') {
            // ... existing code ...
        } else if (type === 'claimed') {
            // เพิ่ม case ใหม่สำหรับแท็บเคลม
            return `
                <tr>
                    <td style="width: 7%;">${device.brand}</td>
                    <td style="width: 9%;">${device.model}</td>
                    <td style="width: 5%;">${device.color}</td>
                    <td style="width: 8%;">${device.imei}</td>
                    <td style="width: 8%;">${device.ram}/${device.rom} GB</td>
                    <td style="width: 8%; text-align: right;">${formatCurrency(purchasePrice)}</td>
                    <td style="width: 8%; text-align: right;">${formatCurrency(salePrice)}</td>
                    <td style="width: 10%; text-align: center;">${formatDate(claimDate)}</td>
                    <td style="width: 10%;">${device.note || '-'}</td>
                    <td style="width: 27%; text-align: center;">
                        <div style="display: flex; gap: 5px; align-items: center; justify-content: center;">
                            <select class="device-action-select" id="new-action-${device.id}" style="padding: 6px 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                                <option value="">-- เลือกการจัดการ --</option>
                                <option value="view">รายการ</option>
                                <option value="return-stock">คืนสต๊อค</option>
                                <option value="edit">แก้ไข</option>
                                <option value="delete">ลบ</option>
                            </select>
                            <button class="action-btn btn-primary" onclick="executeNewDeviceAction('${device.id}')" style="padding: 6px 15px;">ตกลง</button>
                        </div>
                    </td>
                </tr>
            `;
        }
    }).join('');
}
```

#### เพิ่ม case 'return-stock' ใน `executeNewDeviceAction()` และ `executeUsedDeviceAction()`
```javascript
case 'return-stock':
    await openReturnToStockModal(deviceId, 'new'); // หรือ 'used'
    break;
```

---

### 9. อัปเดต `displayUsedDevices()` เพื่อรองรับ type='claimed'

(คล้ายกับ `displayDevices()` แต่สำหรับเครื่องมือสอง)

```javascript
function displayUsedDevices(devices, tableBodyId, type) {
    // ... existing code ...
    
    if (type === 'claimed') {
        return `
            <tr>
                <td style="width: 6%;">${device.brand}</td>
                <td style="width: 8%;">${device.model}</td>
                <td style="width: 5%;">${device.color}</td>
                <td style="width: 8%;">${device.imei}</td>
                <td style="width: 7%;">${device.ram}/${device.rom} GB</td>
                <td style="width: 8%;">${conditionLabels[condition] || condition}</td>
                <td style="width: 8%; text-align: right;">${formatCurrency(purchasePrice)}</td>
                <td style="width: 8%; text-align: right;">${formatCurrency(salePrice)}</td>
                <td style="width: 10%; text-align: center;">${formatDate(claimDate)}</td>
                <td style="width: 10%;">${device.note || '-'}</td>
                <td style="width: 22%; text-align: center;">
                    <div style="display: flex; gap: 5px; align-items: center; justify-content: center;">
                        <select class="device-action-select" id="used-action-${device.id}" style="padding: 6px 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                            <option value="">-- เลือกการจัดการ --</option>
                            <option value="view">รายการ</option>
                            <option value="return-stock">คืนสต๊อค</option>
                            <option value="edit">แก้ไข</option>
                            <option value="delete">ลบ</option>
                        </select>
                        <button class="action-btn btn-primary" onclick="executeUsedDeviceAction('${device.id}')" style="padding: 6px 15px;">ตกลง</button>
                    </div>
                </td>
            </tr>
        `;
    }
}
```

---

## 🗄️ Backend (ไม่ต้องแก้ไข)

- API endpoints ที่มีอยู่แล้วรองรับการอัปเดต status
- แค่ต้องใช้ `PUT /api/new-devices/:id` และ `PUT /api/used-devices/:id`
- ส่ง `status: 'claimed'` และ `claim_date` ไปได้เลย
- Database ควรมีคอลัมน์ `status` และ `claim_date` อยู่แล้ว (ถ้าไม่มีต้องเพิ่ม)

---

## 📝 สรุป

ทั้งหมดนี้จะทำให้:
1. ✅ เพิ่มปุ่ม "เคลม" ในตาราง สต๊อค
2. ✅ กดเคลม → เปิด modal ระบุวันที่
3. ✅ บันทึก → ย้ายไปแท็บ "เคลม"
4. ✅ ในแท็บเคลม มีปุ่ม "คืนสต๊อค"
5. ✅ กดคืนสต๊อค → เปิด modal ระบุวันที่
6. ✅ บันทึก → ย้ายกลับแท็บ "สต๊อค"
7. ✅ สต๊อคหาย (removed) ยังทำงานปกติ

สถานะเครื่อง:
- `stock` → สต๊อค
- `sold` → ขายแล้ว
- `removed` → ตัดออก (สต๊อคหาย)
- `claimed` → เคลม (ใหม่!)
