const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET all service center devices
router.get('/', async (req, res) => {
    try {
        const { store, status } = req.query;
        let query = 'SELECT * FROM service_center WHERE 1=1';
        const params = [];

        if (store) {
            query += ' AND store = ?';
            params.push(store);
        }

        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }

        query += ' ORDER BY send_date DESC, created_at DESC';

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET single service center device by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM service_center WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Service center device not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create service center device
router.post('/', async (req, res) => {
    try {
        const query = `INSERT INTO service_center
            (id, customer_name, customer_phone, brand, model, imei, symptom,
            purchase_date, send_date, service_center, note, status, store)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        await db.query(query, [
            req.body.id,
            req.body.customer_name,
            req.body.customer_phone,
            req.body.brand,
            req.body.model,
            req.body.imei,
            req.body.symptom,
            req.body.purchase_date,
            req.body.send_date,
            req.body.service_center,
            req.body.note || null,
            req.body.status || 'pending',
            req.body.store
        ]);

        res.status(201).json({ message: 'Service center device created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update service center device
router.put('/:id', async (req, res) => {
    try {
        const query = `UPDATE service_center SET
            customer_name = ?,
            customer_phone = ?,
            brand = ?,
            model = ?,
            imei = ?,
            symptom = ?,
            purchase_date = ?,
            send_date = ?,
            return_date = ?,
            cancel_date = ?,
            service_center = ?,
            cancel_reason = ?,
            note = ?,
            status = ?,
            store = ?
            WHERE id = ?`;

        const [result] = await db.query(query, [
            req.body.customer_name,
            req.body.customer_phone,
            req.body.brand,
            req.body.model,
            req.body.imei,
            req.body.symptom,
            req.body.purchase_date,
            req.body.send_date,
            req.body.return_date || null,
            req.body.cancel_date || null,
            req.body.service_center,
            req.body.cancel_reason || null,
            req.body.note || null,
            req.body.status,
            req.body.store,
            req.params.id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Service center device not found' });
        }

        res.json({ message: 'Service center device updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PATCH update status only (for complete/cancel actions)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status, return_date, cancel_date, cancel_reason } = req.body;

        let query = 'UPDATE service_center SET status = ?';
        const params = [status];

        if (status === 'completed' && return_date) {
            query += ', return_date = ?';
            params.push(return_date);
        }

        if (status === 'cancelled') {
            if (cancel_date) {
                query += ', cancel_date = ?';
                params.push(cancel_date);
            }
            if (cancel_reason) {
                query += ', cancel_reason = ?';
                params.push(cancel_reason);
            }
        }

        query += ' WHERE id = ?';
        params.push(req.params.id);

        const [result] = await db.query(query, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Service center device not found' });
        }

        res.json({ message: 'Status updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE service center device
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM service_center WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Service center device not found' });
        }
        res.json({ message: 'Service center device deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET statistics by store
router.get('/stats/:store', async (req, res) => {
    try {
        const store = req.params.store;

        const [stats] = await db.query(`
            SELECT
                COUNT(*) as total,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
                SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
            FROM service_center
            WHERE store = ?
        `, [store]);

        res.json(stats[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
