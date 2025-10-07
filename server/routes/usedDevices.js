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
        res.status(500).json({ error: error.message });
    }
});

// POST create
router.post('/', async (req, res) => {
    try {
        const {
            id, brand, model, color, imei, ram, rom, device_condition,
            purchase_price, import_date, sale_price, sale_date,
            status, note, store
        } = req.body;

        const query = `
            INSERT INTO used_devices
            (id, brand, model, color, imei, ram, rom, device_condition,
             purchase_price, import_date, sale_price, sale_date, status, note, store)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await db.query(query, [
            id, brand, model, color, imei, ram, rom, device_condition,
            purchase_price, import_date, sale_price, sale_date,
            status || 'stock', note, store
        ]);

        res.status(201).json({ message: 'Used device created successfully', id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update
router.put('/:id', async (req, res) => {
    try {
        const {
            brand, model, color, imei, ram, rom, device_condition,
            purchase_price, import_date, sale_price, sale_date,
            status, note, store
        } = req.body;

        const query = `
            UPDATE used_devices
            SET brand = ?, model = ?, color = ?, imei = ?, ram = ?, rom = ?,
                device_condition = ?, purchase_price = ?, import_date = ?,
                sale_price = ?, sale_date = ?, status = ?, note = ?, store = ?
            WHERE id = ?
        `;

        const [result] = await db.query(query, [
            brand, model, color, imei, ram, rom, device_condition,
            purchase_price, import_date, sale_price, sale_date,
            status, note, store, req.params.id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Device not found' });
        }

        res.json({ message: 'Device updated successfully' });
    } catch (error) {
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
