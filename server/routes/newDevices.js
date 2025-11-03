const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET all new devices
router.get('/', async (req, res) => {
    try {
        const { store } = req.query;
        let query = 'SELECT * FROM new_devices';
        let params = [];

        if (store) {
            query += ' WHERE store = ?';
            params.push(store);
        }

        query += ' ORDER BY created_at DESC';

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching new devices:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET single new device by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM new_devices WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Device not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching device:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST create new device
router.post('/', async (req, res) => {
    try {
        const {
            id, brand, model, color, imei, ram, rom, purchased_from, device_category,
            purchase_price, import_date, sale_price, sale_date,
            status, note, store
        } = req.body;

        const query = `
            INSERT INTO new_devices
            (id, brand, model, color, imei, ram, rom, purchased_from, device_category, purchase_price, import_date,
             sale_price, sale_date, status, note, store)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await db.query(query, [
            id, brand, model, color, imei, ram, rom, purchased_from, device_category || 'No Active',
            purchase_price, import_date, sale_price, sale_date,
            status || 'stock', note, store
        ]);

        res.status(201).json({ message: 'Device created successfully', id });
    } catch (error) {
        console.error('Error creating device:', error);

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

// PUT update new device
router.put('/:id', async (req, res) => {
    try {
        // Get existing device first
        const [existing] = await db.query('SELECT * FROM new_devices WHERE id = ?', [req.params.id]);

        if (existing.length === 0) {
            return res.status(404).json({ error: 'Device not found' });
        }

        const current = existing[0];

        // Use existing values if not provided in request
        const {
            brand = current.brand,
            model = current.model,
            color = current.color,
            imei = current.imei,
            ram = current.ram,
            rom = current.rom,
            purchased_from = current.purchased_from,
            device_category = current.device_category,
            purchase_price = current.purchase_price,
            import_date = current.import_date,
            sale_price = current.sale_price,
            sale_date = current.sale_date,
            status = current.status,
            note = current.note,
            store = current.store
        } = req.body;

        const query = `
            UPDATE new_devices
            SET brand = ?, model = ?, color = ?, imei = ?, ram = ?, rom = ?, purchased_from = ?, device_category = ?,
                purchase_price = ?, import_date = ?, sale_price = ?, sale_date = ?,
                status = ?, note = ?, store = ?
            WHERE id = ?
        `;

        const [result] = await db.query(query, [
            brand, model, color, imei, ram, rom, purchased_from, device_category,
            purchase_price, import_date, sale_price, sale_date,
            status, note, store, req.params.id
        ]);

        res.json({ message: 'Device updated successfully' });
    } catch (error) {
        console.error('Error updating device:', error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE device
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM new_devices WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Device not found' });
        }

        res.json({ message: 'Device deleted successfully' });
    } catch (error) {
        console.error('Error deleting device:', error);
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
            FROM new_devices
            ${whereClause}
        `;

        const [rows] = await db.query(query, params);
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
