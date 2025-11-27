const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET all simcards
router.get('/', async (req, res) => {
    try {
        const { store } = req.query;
        let query = 'SELECT * FROM simcards';
        if (store) query += ' WHERE store = ?';
        query += ' ORDER BY created_at DESC';

        const [rows] = await db.query(query, store ? [store] : []);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET single simcard by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM simcards WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Simcard not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create simcard
router.post('/', async (req, res) => {
    try {
        const query = `INSERT INTO simcards (id, provider, phone_number, package, package_sale, cost_price,
            sale_price, import_date, expiry_date, status, note, store) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        await db.query(query, [
            req.body.id, req.body.provider, req.body.phone_number, req.body.package,
            req.body.package_sale || null,
            req.body.cost_price, req.body.sale_price, req.body.import_date,
            req.body.expiry_date || null,
            req.body.status || 'available', req.body.note || null, req.body.store
        ]);

        res.status(201).json({ message: 'Simcard created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update simcard
router.put('/:id', async (req, res) => {
    try {
        const query = `UPDATE simcards SET provider = ?, phone_number = ?, package = ?,
            cost_price = ?, sale_price = ?, topup_amount = ?, package_sale = ?, import_date = ?, expiry_date = ?,
            sale_date = ?, return_date = ?, status = ?, note = ?, store = ? WHERE id = ?`;

        const [result] = await db.query(query, [
            req.body.provider, req.body.phone_number, req.body.package,
            req.body.cost_price, req.body.sale_price, req.body.topup_amount || null, req.body.package_sale || null,
            req.body.import_date,
            req.body.expiry_date || null,
            req.body.sale_date || null, req.body.return_date || null,
            req.body.status, req.body.note, req.body.store, req.params.id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Simcard not found' });
        }

        res.json({ message: 'Simcard updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE simcard
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM simcards WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Simcard not found' });
        }
        res.json({ message: 'Simcard deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
