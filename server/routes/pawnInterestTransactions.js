const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all pawn interest transactions
router.get('/', async (req, res) => {
    try {
        const { store, month, year } = req.query;
        let query = 'SELECT * FROM pawn_interest_transactions WHERE 1=1';
        const params = [];

        if (store) {
            query += ' AND store = ?';
            params.push(store);
        }

        if (month && year) {
            query += ' AND YEAR(transaction_date) = ? AND MONTH(transaction_date) = ?';
            params.push(year, month);
        } else if (year) {
            query += ' AND YEAR(transaction_date) = ?';
            params.push(year);
        }

        query += ' ORDER BY transaction_date DESC, created_at DESC';

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new pawn interest transaction
router.post('/', async (req, res) => {
    try {
        const { pawn_id, interest_amount, late_fee, transaction_type, transaction_date, store } = req.body;

        const query = `INSERT INTO pawn_interest_transactions
            (pawn_id, interest_amount, late_fee, transaction_type, transaction_date, store)
            VALUES (?, ?, ?, ?, ?, ?)`;

        const values = [
            pawn_id,
            interest_amount,
            late_fee || 0, // Default to 0 if not provided
            transaction_type,
            transaction_date,
            store
        ];

        const [result] = await db.query(query, values);
        res.status(201).json({
            message: 'Pawn interest transaction created successfully',
            id: result.insertId
        });
    } catch (error) {
        console.error('POST /api/pawn-interest - Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get total interest income by month
router.get('/summary', async (req, res) => {
    try {
        const { store, month, year } = req.query;
        let query = `SELECT
            SUM(interest_amount) as total_interest,
            SUM(late_fee) as total_late_fee,
            SUM(interest_amount + late_fee) as total_income,
            COUNT(*) as transaction_count
            FROM pawn_interest_transactions WHERE 1=1`;
        const params = [];

        if (store) {
            query += ' AND store = ?';
            params.push(store);
        }

        if (month && year) {
            query += ' AND YEAR(transaction_date) = ? AND MONTH(transaction_date) = ?';
            params.push(year, month);
        } else if (year) {
            query += ' AND YEAR(transaction_date) = ?';
            params.push(year);
        }

        const [rows] = await db.query(query, params);
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a pawn interest transaction
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const query = 'DELETE FROM pawn_interest_transactions WHERE id = ?';
        const [result] = await db.query(query, [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        
        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error('DELETE /api/pawn-interest/:id - Error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
