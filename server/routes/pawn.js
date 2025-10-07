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

router.post('/', async (req, res) => {
    try {
        const query = `INSERT INTO pawn_devices (id, brand, model, color, imei, ram, rom,
            pawn_amount, interest, receive_date, due_date, status, note, store)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        await db.query(query, [req.body.id, req.body.brand, req.body.model, req.body.color,
            req.body.imei, req.body.ram, req.body.rom, req.body.pawn_amount, req.body.interest,
            req.body.receive_date, req.body.due_date, req.body.status || 'active',
            req.body.note, req.body.store]);
        res.status(201).json({ message: 'Pawn device created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const query = `UPDATE pawn_devices SET brand = ?, model = ?, color = ?, imei = ?,
            ram = ?, rom = ?, pawn_amount = ?, interest = ?, receive_date = ?, due_date = ?,
            return_date = ?, seized_date = ?, status = ?, note = ?, store = ? WHERE id = ?`;
        const [result] = await db.query(query, [req.body.brand, req.body.model, req.body.color,
            req.body.imei, req.body.ram, req.body.rom, req.body.pawn_amount, req.body.interest,
            req.body.receive_date, req.body.due_date, req.body.return_date, req.body.seized_date,
            req.body.status, req.body.note, req.body.store, req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Pawn not found' });
        res.json({ message: 'Pawn updated successfully' });
    } catch (error) {
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
