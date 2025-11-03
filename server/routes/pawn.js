const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', async (req, res) => {
    try {
        const { store } = req.query;
        let query = 'SELECT * FROM pawn_devices';
        if (store) query += ' WHERE store = ?';
        query += ' ORDER BY created_at DESC';
        const [rows] = await db.query(query, store ? [store] : []);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM pawn_devices WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Pawn device not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        console.log('POST /api/pawn - Received data:', {
            customer_name: req.body.customer_name,
            redemption_amount: req.body.redemption_amount,
            interest_collection_method: req.body.interest_collection_method
        });

        const query = `INSERT INTO pawn_devices (id, store, customer_name, brand, model, color, imei, ram, rom,
            pawn_amount, interest, interest_collection_method, redemption_amount,
            receive_date, due_date, status, note)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        // Generate ID if not provided
        const id = req.body.id || `P${Date.now()}`;
        
        const values = [
            id,
            req.body.store || 'klongyong',
            req.body.customer_name || 'ลูกค้า',
            req.body.brand,
            req.body.model,
            req.body.color,
            req.body.imei,
            req.body.ram,
            req.body.rom,
            req.body.pawn_amount,
            req.body.interest,
            req.body.interest_collection_method || 'not_deducted',
            req.body.redemption_amount || 0,
            req.body.receive_date,
            req.body.due_date,
            req.body.status || 'active',
            req.body.note
        ];

        console.log('INSERT values:', values);

        await db.query(query, values);
        res.status(201).json({
            message: 'Pawn device created successfully',
            id: req.body.id
        });
    } catch (error) {
        console.error('POST /api/pawn - Error:', error);

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

router.put('/:id', async (req, res) => {
    try {
        console.log(`PUT /api/pawn/${req.params.id} - Updating pawn device`);

        // Helper function to convert date to YYYY-MM-DD format for MySQL DATE type
        const formatDate = (dateValue) => {
            if (!dateValue) return null;
            // If already in YYYY-MM-DD format, return as is
            if (typeof dateValue === 'string' && dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
                return dateValue;
            }
            // Extract YYYY-MM-DD from ISO string (e.g., '2025-10-09T17:00:00.000Z' -> '2025-10-09')
            if (typeof dateValue === 'string' && dateValue.includes('T')) {
                const formatted = dateValue.split('T')[0];
                console.log(`formatDate: ${dateValue} -> ${formatted}`);
                return formatted;
            }
            return dateValue;
        };

        const query = `UPDATE pawn_devices SET store = ?, customer_name = ?, brand = ?, model = ?, color = ?, imei = ?,
            ram = ?, rom = ?, pawn_amount = ?, interest = ?, interest_collection_method = ?,
            redemption_amount = ?, receive_date = ?, due_date = ?,
            return_date = ?, seized_date = ?, status = ?, note = ? WHERE id = ?`;

        const values = [
            req.body.store || 'klongyong',
            req.body.customer_name || null,
            req.body.brand,
            req.body.model,
            req.body.color,
            req.body.imei,
            req.body.ram,
            req.body.rom,
            req.body.pawn_amount,
            req.body.interest,
            req.body.interest_collection_method || 'not_deducted',
            req.body.redemption_amount || 0,
            formatDate(req.body.receive_date),
            formatDate(req.body.due_date),
            formatDate(req.body.return_date),
            formatDate(req.body.seized_date),
            req.body.status,
            req.body.note || null,
            req.params.id
        ];

        const [result] = await db.query(query, values);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Pawn not found' });
        res.json({ message: 'Pawn updated successfully' });
    } catch (error) {
        console.error('PUT /api/pawn - Error:', error);
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM pawn_devices WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Pawn not found' });
        res.json({ message: 'Pawn deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
