const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET all repairs
router.get('/', async (req, res) => {
    try {
        const { store } = req.query;
        let query = 'SELECT * FROM repairs';
        if (store) query += ' WHERE store = ?';
        query += ' ORDER BY created_at DESC';

        const [rows] = await db.query(query, store ? [store] : []);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create
router.post('/', async (req, res) => {
    try {
        const query = `INSERT INTO repairs (id, brand, model, color, imei, customer_name,
            customer_phone, problem, repair_cost, received_date, appointment_date,
            status, note, store) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        await db.query(query, [
            req.body.id, req.body.brand, req.body.model, req.body.color, req.body.imei,
            req.body.customer_name, req.body.customer_phone, req.body.problem,
            req.body.repair_cost, req.body.received_date, req.body.appointment_date,
            req.body.status || 'pending', req.body.note, req.body.store
        ]);

        res.status(201).json({ message: 'Repair created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update
router.put('/:id', async (req, res) => {
    try {
        const query = `UPDATE repairs SET brand = ?, model = ?, color = ?, imei = ?,
            customer_name = ?, customer_phone = ?, problem = ?, repair_cost = ?,
            received_date = ?, appointment_date = ?, completed_date = ?, returned_date = ?,
            status = ?, note = ?, store = ? WHERE id = ?`;

        const [result] = await db.query(query, [
            req.body.brand, req.body.model, req.body.color, req.body.imei,
            req.body.customer_name, req.body.customer_phone, req.body.problem,
            req.body.repair_cost, req.body.received_date, req.body.appointment_date,
            req.body.completed_date, req.body.returned_date, req.body.status,
            req.body.note, req.body.store, req.params.id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Repair not found' });
        }

        res.json({ message: 'Repair updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM repairs WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Repair not found' });
        }
        res.json({ message: 'Repair deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
