const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET all used devices
router.get('/', async (req, res) => {
    try {
        const { store } = req.query;
        let query = 'SELECT * FROM used_devices';
        let params = [];

        if (store) {
            query += ' WHERE store = ?';
            params.push(store);
        }

        query += ' ORDER BY created_at DESC';

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching used devices:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET single used device
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM used_devices WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Device not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching single used device:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET statistics
router.get('/stats/summary', async (req, res) => {
    try {
        const { store } = req.query;
        let whereClause = store ? 'WHERE store = ?' : '';
        let params = store ? [store] : [];

        const query = `
            SELECT
                COUNT(*) as total,
                SUM(CASE WHEN status = 'stock' THEN 1 ELSE 0 END) as stock_count,
                SUM(CASE WHEN status = 'sold' THEN 1 ELSE 0 END) as sold_count,
                SUM(CASE WHEN status = 'removed' THEN 1 ELSE 0 END) as removed_count,
                SUM(CASE WHEN status = 'stock' THEN purchase_price ELSE 0 END) as stock_value,
                SUM(CASE WHEN status = 'sold' THEN sale_price ELSE 0 END) as total_revenue,
                SUM(CASE WHEN status = 'sold' THEN (sale_price - purchase_price) ELSE 0 END) as total_profit
            FROM used_devices
            ${whereClause}
        `;

        const [rows] = await db.query(query, params);
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST create
router.post('/', async (req, res) => {
    try {
        const {
            id, brand, model, color, imei, ram, rom, battery_health, purchased_from, device_category, device_condition,
            purchase_price, import_date, sale_price, sale_date,
            status, note, store
        } = req.body;

        const query = `
            INSERT INTO used_devices
            (id, brand, model, color, imei, ram, rom, battery_health, purchased_from, device_category, device_condition,
             purchase_price, import_date, sale_price, sale_date, status, note, store)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await db.query(query, [
            id, brand, model, color, imei, ram, rom, battery_health || null, purchased_from, device_category || 'No Active', device_condition,
            purchase_price, import_date, sale_price, sale_date,
            status || 'stock', note, store
        ]);

        res.status(201).json({ message: 'Used device created successfully', id });
    } catch (error) {
        console.error('Error creating used device:', error);

        // Check for duplicate IMEI error
        if (error.code === 'ER_DUP_ENTRY' && error.message.includes('imei')) {
            return res.status(409).json({
                error: 'IMEI ซ้ำ',
                message: `IMEI นี้มีอยู่ในระบบแล้ว กรุณาตรวจสอบ IMEI อีกครั้ง`,
                duplicate: true
            });
        }

        res.status(500).json({ error: error.message });
    }
});

// PUT update
router.put('/:id', async (req, res) => {
    try {
        // Get existing device first
        const [existing] = await db.query('SELECT * FROM used_devices WHERE id = ?', [req.params.id]);

        if (existing.length === 0) {
            return res.status(404).json({ error: 'Device not found' });
        }

        const current = existing[0];

        // Use existing values if not provided in request (with proper null checks)
        const brand = req.body.brand !== undefined ? req.body.brand : current.brand;
        const model = req.body.model !== undefined ? req.body.model : current.model;
        const color = req.body.color !== undefined ? req.body.color : current.color;
        const imei = req.body.imei !== undefined ? req.body.imei : current.imei;
        const ram = req.body.ram !== undefined ? req.body.ram : current.ram;
        const rom = req.body.rom !== undefined ? req.body.rom : current.rom;
        const battery_health = req.body.battery_health !== undefined ? req.body.battery_health : current.battery_health;
        const purchased_from = req.body.purchased_from !== undefined ? req.body.purchased_from : current.purchased_from;
        const device_category = req.body.device_category !== undefined ? req.body.device_category : current.device_category;
        const device_condition = req.body.device_condition !== undefined ? req.body.device_condition : current.device_condition;
        const purchase_price = req.body.purchase_price !== undefined ? req.body.purchase_price : current.purchase_price;
        const import_date = req.body.import_date !== undefined ? req.body.import_date : current.import_date;
        const sale_price = req.body.sale_price !== undefined ? req.body.sale_price : current.sale_price;
        const sale_date = req.body.sale_date !== undefined ? req.body.sale_date : current.sale_date;
        const status = req.body.status !== undefined ? req.body.status : current.status;
        const note = req.body.note !== undefined ? req.body.note : current.note;
        const store = req.body.store !== undefined ? req.body.store : current.store;

        // 🛡️ VALIDATION: ป้องกันความขัดแย้งระหว่างการขายและโอนสต็อก
        if (status === 'sold' && note && (note.includes('ตัดสลับ') || note.includes('โอน') || note.includes('ย้าย'))) {
            return res.status(400).json({
                error: 'ข้อมูลขัดแย้ง',
                message: 'ไม่สามารถบันทึกการขายพร้อมกับหมายเหตุการโอนสต็อกได้ กรุณาเลือกให้ชัดเจนว่าสินค้าถูกขายหรือโอนไปร้านอื่น',
                conflict: true
            });
        }

        // ป้องกันการ removed พร้อมกับหมายเหตุขาย
        if (status === 'removed' && note && (note.includes('ขาย') || note.includes('sold'))) {
            return res.status(400).json({
                error: 'ข้อมูลขัดแย้ง',
                message: 'ไม่สามารถบันทึกการโอนสต็อกพร้อมกับหมายเหตุการขายได้',
                conflict: true
            });
        }

        const query = `
            UPDATE used_devices
            SET brand = ?, model = ?, color = ?, imei = ?, ram = ?, rom = ?, battery_health = ?,
                purchased_from = ?, device_category = ?, device_condition = ?,
                purchase_price = ?, import_date = ?,
                sale_price = ?, sale_date = ?, status = ?, note = ?, store = ?
            WHERE id = ?
        `;

        const [result] = await db.query(query, [
            brand, model, color, imei, ram, rom, battery_health || null, purchased_from, device_category, device_condition,
            purchase_price, import_date, sale_price, sale_date,
            status, note, store, req.params.id
        ]);

        res.json({ message: 'Device updated successfully' });
    } catch (error) {
        console.error('Error updating used device:', error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM used_devices WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Device not found' });
        }

        res.json({ message: 'Device deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
