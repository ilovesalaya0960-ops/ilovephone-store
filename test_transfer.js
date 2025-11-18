// Test Transfer Accessory Script
// This script tests the transfer functionality by simulating the frontend transfer process

const testTransfer = async () => {
    const API_BASE = 'http://localhost:5001/api';

    console.log('=== Testing Accessory Transfer ===\n');

    // Step 1: Get the Samsung A03/A04/A14 battery from klongyong
    console.log('Step 1: Fetching accessories from klongyong...');
    const klongyongRes = await fetch(`${API_BASE}/accessories?store=klongyong`);
    const klongyongData = await klongyongRes.json();

    const samsungBattery = klongyongData.find(a =>
        a.code && (a.code.includes('WT-S-W1') || a.code.includes('HQ-50SD'))
    );

    if (!samsungBattery) {
        console.error('❌ Samsung A03/A04/A14 battery not found at klongyong');
        return;
    }

    console.log('✅ Found battery:', {
        id: samsungBattery.id,
        code: samsungBattery.code,
        brand: samsungBattery.brand,
        models: samsungBattery.models,
        store: samsungBattery.store,
        quantity: samsungBattery.quantity,
        cut_quantity: samsungBattery.cut_quantity
    });

    // Step 2: Reduce quantity at klongyong
    console.log('\nStep 2: Reducing quantity at klongyong...');
    const transferQuantity = 1;
    const newQuantityKlongyong = Number(samsungBattery.quantity) - transferQuantity;

    const updateKlongyongRes = await fetch(`${API_BASE}/accessories/${samsungBattery.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            type: samsungBattery.type,
            code: samsungBattery.code,
            brand: samsungBattery.brand,
            models: samsungBattery.models,
            quantity: newQuantityKlongyong,
            cost_price: samsungBattery.cost_price,
            repair_price: samsungBattery.repair_price,
            import_date: samsungBattery.import_date,
            claim_quantity: samsungBattery.claim_quantity || 0,
            cut_quantity: samsungBattery.cut_quantity || 0,
            note: (samsungBattery.note || '') + `\nย้ายไปร้านศาลายา ${new Date().toISOString().split('T')[0]}: ${transferQuantity} ชิ้น`,
            store: 'klongyong'
        })
    });

    const updateKlongyongResult = await updateKlongyongRes.json();
    console.log('✅ Updated klongyong:', updateKlongyongResult);

    // Step 3: Check if accessory exists at salaya
    console.log('\nStep 3: Checking accessories at salaya...');
    const salayaRes = await fetch(`${API_BASE}/accessories?store=salaya`);
    const salayaData = await salayaRes.json();

    console.log(`Found ${salayaData.length} accessories at salaya`);

    const existingAtSalaya = salayaData.find(a =>
        a.type === samsungBattery.type &&
        a.code === samsungBattery.code &&
        a.brand === samsungBattery.brand
    );

    if (existingAtSalaya) {
        // Update existing
        console.log('Found existing accessory at salaya, updating quantity...');
        const updatedQuantity = Number(existingAtSalaya.quantity) + transferQuantity;

        const updateSalayaRes = await fetch(`${API_BASE}/accessories/${existingAtSalaya.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: existingAtSalaya.type,
                code: existingAtSalaya.code,
                brand: existingAtSalaya.brand,
                models: existingAtSalaya.models,
                quantity: updatedQuantity,
                cost_price: existingAtSalaya.cost_price,
                repair_price: existingAtSalaya.repair_price,
                import_date: existingAtSalaya.import_date,
                claim_quantity: existingAtSalaya.claim_quantity || 0,
                cut_quantity: existingAtSalaya.cut_quantity || 0,
                note: (existingAtSalaya.note || '') + `\nย้ายจากร้านคลองโยง ${new Date().toISOString().split('T')[0]}: +${transferQuantity} ชิ้น`,
                store: 'salaya'
            })
        });

        const updateSalayaResult = await updateSalayaRes.json();
        console.log('✅ Updated salaya:', updateSalayaResult);
    } else {
        // Create new
        console.log('No existing accessory at salaya, creating new one...');
        const newAccessoryId = 'ACC' + Date.now();

        const createRes = await fetch(`${API_BASE}/accessories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: newAccessoryId,
                type: samsungBattery.type,
                code: samsungBattery.code,
                brand: samsungBattery.brand,
                models: samsungBattery.models,
                quantity: transferQuantity,
                cost_price: samsungBattery.cost_price,
                repair_price: samsungBattery.repair_price,
                import_date: new Date().toISOString().split('T')[0],
                claim_quantity: 0,
                cut_quantity: 0,
                note: `ย้ายจากร้านคลองโยง ${new Date().toISOString().split('T')[0]}`,
                store: 'salaya'
            })
        });

        const createResult = await createRes.json();
        console.log('✅ Created at salaya:', createResult);
    }

    // Step 4: Verify
    console.log('\n=== Verification ===');
    const verifyKlongyongRes = await fetch(`${API_BASE}/accessories/${samsungBattery.id}`);
    const verifyKlongyong = await verifyKlongyongRes.json();
    console.log('Klongyong quantity:', verifyKlongyong.quantity);

    const verifySalayaRes = await fetch(`${API_BASE}/accessories?store=salaya`);
    const verifySalaya = await verifySalayaRes.json();
    const transferredItem = verifySalaya.find(a =>
        a.code === samsungBattery.code && a.brand === samsungBattery.brand
    );

    if (transferredItem) {
        console.log('✅ Transfer successful! Found at salaya:', {
            code: transferredItem.code,
            brand: transferredItem.brand,
            quantity: transferredItem.quantity
        });
    } else {
        console.log('❌ Transfer failed! Not found at salaya');
    }
};

// Run the test
testTransfer().catch(err => console.error('Error:', err));
