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
            id, type, code, brand, model, sub_type, brand_filter, quantity,
            cost_price, sale_price, import_date, note, store
        } = req.body;

        const query = `
            INSERT INTO equipment
            (id, type, code, brand, model, sub_type, brand_filter, quantity, cost_price, sale_price, import_date, note, store)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await db.query(query, [
            id, type, code, brand, model, sub_type, brand_filter, quantity,
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
            type, code, brand, model, sub_type, brand_filter, quantity,
            cost_price, sale_price, import_date, note, store,
            cut_quantity, cut_price, cut_date
        } = req.body;

        const query = `
            UPDATE equipment
            SET type = ?, code = ?, brand = ?, model = ?, sub_type = ?, brand_filter = ?, quantity = ?,
                cost_price = ?, sale_price = ?, import_date = ?, note = ?, store = ?,
                cut_quantity = ?, cut_price = ?, cut_date = ?
            WHERE id = ?
        `;

        const [result] = await db.query(query, [
            type, code, brand, model, sub_type, brand_filter, quantity,
            cost_price, sale_price, import_date, note, store,
            cut_quantity || 0, cut_price || null, cut_date || null,
            req.params.id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Equipment not found' });
        }

        res.json({ message: 'Equipment updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST cut equipment (ตัดอุปกรณ์) - MUST be before GET /:id
router.post('/:id/cut', async (req, res) => {
    try {
        const { quantity, price, date, note } = req.body;
        const equipmentId = req.params.id;

        // Get current equipment data
        const [rows] = await db.query('SELECT * FROM equipment WHERE id = ?', [equipmentId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Equipment not found' });
        }

        const equipment = rows[0];
        const cutQuantity = Number(equipment.cut_quantity) || 0;
        const availableQuantity = Number(equipment.quantity);

        // Validate quantity
        if (quantity <= 0) {
            return res.status(400).json({ error: 'Quantity must be greater than 0' });
        }

        if (quantity > availableQuantity) {
            return res.status(400).json({
                error: `Cannot cut ${quantity} items. Only ${availableQuantity} available in stock.`
            });
        }

        // Update: reduce quantity, increase cut_quantity, save cut_price, cut_date and note
        const newQuantity = Number(equipment.quantity) - quantity;
        const newCutQuantity = cutQuantity + quantity;

        const query = `
            UPDATE equipment
            SET quantity = ?,
                cut_quantity = ?,
                cut_price = ?,
                cut_date = ?,
                note = ?
            WHERE id = ?
        `;

        await db.query(query, [newQuantity, newCutQuantity, price, date, note || null, equipmentId]);

        res.json({
            message: 'Equipment cut successfully',
            cut_quantity: newCutQuantity,
            remaining: newQuantity
        });
    } catch (error) {
        console.error('Error cutting equipment:', error);
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
