const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET all installments with payment history
router.get('/', async (req, res) => {
    try {
        const { store } = req.query;
        let query = 'SELECT * FROM installment_devices';
        if (store) query += ' WHERE store = ?';
        query += ' ORDER BY created_at DESC';

        const [installments] = await db.query(query, store ? [store] : []);

        // Get payment history for each installment
        for (let inst of installments) {
            const [payments] = await db.query(
                'SELECT * FROM installment_payments WHERE installment_id = ? ORDER BY installment_number',
                [inst.id]
            );
            inst.paymentHistory = payments;
        }

        res.json(installments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create installment
router.post('/', async (req, res) => {
    try {
        const query = `INSERT INTO installment_devices (id, brand, model, color, imei, ram, rom,
            customer_name, customer_phone, cost_price, sale_price, down_payment,
            total_installments, installment_amount, paid_installments, down_payment_date,
            status, note, store) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        await db.query(query, [
            req.body.id, req.body.brand, req.body.model, req.body.color, req.body.imei,
            req.body.ram, req.body.rom, req.body.customer_name, req.body.customer_phone,
            req.body.cost_price, req.body.sale_price, req.body.down_payment,
            req.body.total_installments, req.body.installment_amount,
            req.body.paid_installments || 0, req.body.down_payment_date,
            req.body.status || 'active', req.body.note, req.body.store
        ]);

        res.status(201).json({ message: 'Installment created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update installment
router.put('/:id', async (req, res) => {
    try {
        const query = `UPDATE installment_devices SET
            brand = ?, model = ?, color = ?, imei = ?, ram = ?, rom = ?,
            customer_name = ?, customer_phone = ?, cost_price = ?, sale_price = ?,
            down_payment = ?, total_installments = ?, installment_amount = ?,
            next_payment_due_date = ?, note = ?, status = ?, seized_date = ?
            WHERE id = ?`;

        const [result] = await db.query(query, [
            req.body.brand, req.body.model, req.body.color, req.body.imei,
            req.body.ram, req.body.rom, req.body.customer_name, req.body.customer_phone,
            req.body.cost_price, req.body.sale_price, req.body.down_payment,
            req.body.total_installments, req.body.installment_amount,
            req.body.next_payment_due_date, req.body.note,
            req.body.status || 'active', req.body.seized_date || null,
            req.params.id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Installment not found' });
        }

        res.json({ message: 'Installment updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST add payment
router.post('/:id/payment', async (req, res) => {
    try {
        const { installment_number, payment_date, amount } = req.body;

        // Add payment record
        await db.query(
            'INSERT INTO installment_payments (installment_id, installment_number, payment_date, amount) VALUES (?, ?, ?, ?)',
            [req.params.id, installment_number, payment_date, amount]
        );

        // Update paid_installments and next_payment_due_date
        const [inst] = await db.query(
            'SELECT paid_installments, next_payment_due_date FROM installment_devices WHERE id = ?',
            [req.params.id]
        );

        // Calculate next due date: current due date + 30 days
        let nextDueDate = null;
        if (inst[0] && inst[0].next_payment_due_date) {
            const currentDue = new Date(inst[0].next_payment_due_date);
            currentDue.setDate(currentDue.getDate() + 30);
            nextDueDate = currentDue.toISOString().split('T')[0];
        }

        await db.query(
            'UPDATE installment_devices SET paid_installments = paid_installments + 1, next_payment_due_date = ? WHERE id = ?',
            [nextDueDate, req.params.id]
        );

        // Check if completed
        const [updated] = await db.query(
            'SELECT paid_installments, total_installments FROM installment_devices WHERE id = ?',
            [req.params.id]
        );

        if (updated[0] && updated[0].paid_installments >= updated[0].total_installments) {
            await db.query(
                'UPDATE installment_devices SET status = ?, completed_date = ?, next_payment_due_date = NULL WHERE id = ?',
                ['completed', payment_date, req.params.id]
            );
        }

        res.json({ message: 'Payment recorded successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM installment_devices WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Installment not found' });
        }
        res.json({ message: 'Installment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
