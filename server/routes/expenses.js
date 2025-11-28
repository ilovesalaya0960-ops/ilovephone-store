const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET all expenses
router.get('/', async (req, res) => {
    try {
        const { store, type, month } = req.query;
        let query = 'SELECT * FROM expenses WHERE 1=1';
        const params = [];

        if (store) {
            query += ' AND store = ?';
            params.push(store);
        }

        if (type) {
            query += ' AND type = ?';
            params.push(type);
        }

        if (month) {
            query += ' AND DATE_FORMAT(date, "%Y-%m") = ?';
            params.push(month);
        }

        query += ' ORDER BY date DESC, created_at DESC';

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET single expense by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM expenses WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create expense
router.post('/', async (req, res) => {
    try {
        const query = `INSERT INTO expenses (type, category, description, amount, date, store, note)
                      VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const [result] = await db.query(query, [
            req.body.type || 'expense',
            req.body.category,
            req.body.description,
            req.body.amount,
            req.body.date,
            req.body.store,
            req.body.note || null
        ]);

        res.status(201).json({
            message: 'Expense created successfully',
            id: result.insertId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update expense
router.put('/:id', async (req, res) => {
    try {
        const query = `UPDATE expenses SET type = ?, category = ?, description = ?,
                      amount = ?, date = ?, store = ?, note = ? WHERE id = ?`;

        const [result] = await db.query(query, [
            req.body.type || 'expense',
            req.body.category,
            req.body.description,
            req.body.amount,
            req.body.date,
            req.body.store,
            req.body.note || null,
            req.params.id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        res.json({ message: 'Expense updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE expense
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM expenses WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
