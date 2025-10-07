const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET all accessories
router.get('/', async (req, res) => {
    try {
        const { store } = req.query;
        let query = 'SELECT * FROM accessories';
        let params = [];

        if (store) {
            query += ' WHERE store = ?';
            params.push(store);
        }

        query += ' ORDER BY created_at DESC';

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching accessories:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET single accessory
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM accessories WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Accessory not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create accessory
router.post('/', async (req, res) => {
    try {
        const {
            id, type, brand, model, quantity, cost_price,
            sale_price, import_date, note, store
        } = req.body;

        const query = `
            INSERT INTO accessories
            (id, type, brand, model, quantity, cost_price, sale_price, import_date, note, store)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await db.query(query, [
            id, type, brand, model, quantity, cost_price,
            sale_price, import_date, note, store
        ]);

        res.status(201).json({ message: 'Accessory created successfully', id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update accessory
router.put('/:id', async (req, res) => {
    try {
        const {
            type, brand, model, quantity, cost_price,
            sale_price, import_date, note, store
        } = req.body;

        const query = `
            UPDATE accessories
            SET type = ?, brand = ?, model = ?, quantity = ?, cost_price = ?,
                sale_price = ?, import_date = ?, note = ?, store = ?
            WHERE id = ?
        `;

        const [result] = await db.query(query, [
            type, brand, model, quantity, cost_price,
            sale_price, import_date, note, store, req.params.id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Accessory not found' });
        }

        res.json({ message: 'Accessory updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE accessory
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM accessories WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Accessory not found' });
        }

        res.json({ message: 'Accessory deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
