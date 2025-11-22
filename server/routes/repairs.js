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

// GET single repair by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM repairs WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Repair not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create
router.post('/', async (req, res) => {
    try {
        console.log('🔍 [POST /repairs] Request body:', req.body);
        console.log('🔍 [POST /repairs] Warranty value:', req.body.warranty);
        console.log('🔍 [POST /repairs] Warranty type:', typeof req.body.warranty);

        const query = `INSERT INTO repairs (id, brand, model, color, imei, customer_name,
            customer_phone, problem, repair_cost, accessory_cost, commission, technician, 
            received_date, appointment_date, status, warranty, note, store) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const warrantyValue = req.body.warranty || null;
        console.log('💾 [POST /repairs] Warranty to save:', warrantyValue);

        await db.query(query, [
            req.body.id, req.body.brand, req.body.model, req.body.color, req.body.imei,
            req.body.customer_name || null, req.body.customer_phone || null, req.body.problem,
            req.body.repair_cost, req.body.accessory_cost || 0, req.body.commission || 0, 
            req.body.technician || null, req.body.received_date, req.body.appointment_date || null,
            req.body.status || 'pending', warrantyValue, req.body.note || null, req.body.store
        ]);

        console.log('✅ [POST /repairs] Repair created successfully');
        res.status(201).json({ message: 'Repair created successfully' });
    } catch (error) {
        console.error('❌ [POST /repairs] Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// PUT update
router.put('/:id', async (req, res) => {
    try {
        console.log('🔍 [PUT /repairs/:id] Request body:', req.body);
        console.log('🔍 [PUT /repairs/:id] Warranty value:', req.body.warranty);

        const query = `UPDATE repairs SET brand = ?, model = ?, color = ?, imei = ?,
            customer_name = ?, customer_phone = ?, problem = ?, repair_cost = ?, accessory_cost = ?,
            commission = ?, technician = ?, received_date = ?, appointment_date = ?, completed_date = ?,
            returned_date = ?, seized_date = ?, status = ?, warranty = ?, note = ?, store = ? WHERE id = ?`;

        const warrantyValue = req.body.warranty || null;
        console.log('💾 [PUT /repairs/:id] Warranty to save:', warrantyValue);

        const [result] = await db.query(query, [
            req.body.brand, req.body.model, req.body.color, req.body.imei,
            req.body.customer_name, req.body.customer_phone, req.body.problem,
            req.body.repair_cost, req.body.accessory_cost || 0, req.body.commission || 0,
            req.body.technician || null, req.body.received_date, req.body.appointment_date,
            req.body.completed_date, req.body.returned_date, req.body.seized_date || null,
            req.body.status, warrantyValue, req.body.note, req.body.store, req.params.id
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
