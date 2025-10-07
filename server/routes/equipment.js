const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET all equipment
router.get('/', async (req, res) => {
    try {
        const { store } = req.query;
        let query = 'SELECT * FROM equipment';
        let params = [];

        if (store) {
            query += ' WHERE store = ?';
            params.push(store);
        }

        query += ' ORDER BY created_at DESC';

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching equipment:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET single equipment item
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM equipment WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Equipment not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create equipment
router.post('/', async (req, res) => {
    try {
        const {
            id, type, code, brand, model, quantity,
            cost_price, sale_price, import_date, note, store
        } = req.body;

        const query = `
            INSERT INTO equipment
            (id, type, code, brand, model, quantity, cost_price, sale_price, import_date, note, store)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await db.query(query, [
            id, type, code, brand, model, quantity,
            cost_price, sale_price, import_date, note, store
        ]);

        res.status(201).json({ message: 'Equipment created successfully', id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update equipment
router.put('/:id', async (req, res) => {
    try {
        const {
            type, code, brand, model, quantity,
            cost_price, sale_price, import_date, note, store
        } = req.body;

        const query = `
            UPDATE equipment
            SET type = ?, code = ?, brand = ?, model = ?, quantity = ?,
                cost_price = ?, sale_price = ?, import_date = ?, note = ?, store = ?
            WHERE id = ?
        `;

        const [result] = await db.query(query, [
            type, code, brand, model, quantity,
            cost_price, sale_price, import_date, note, store, req.params.id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Equipment not found' });
        }

        res.json({ message: 'Equipment updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE equipment
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM equipment WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Equipment not found' });
        }

        res.json({ message: 'Equipment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
