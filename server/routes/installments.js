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

// GET single installment by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM installment_devices WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Installment not found' });
        }

        const installment = rows[0];

        // Get payment history
        const [payments] = await db.query(
            'SELECT * FROM installment_payments WHERE installment_id = ? ORDER BY installment_number',
            [req.params.id]
        );
        installment.paymentHistory = payments;

        res.json(installment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create installment
router.post('/', async (req, res) => {
    try {
        const query = `INSERT INTO installment_devices (id, brand, model, color, imei, ram, rom,
            customer_name, customer_phone, cost_price, sale_price, lock_system_fee, commission, down_payment,
            total_installments, installment_amount, paid_installments, down_payment_date,
            next_payment_due_date, installment_type, status, note, finance, store)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        await db.query(query, [
            req.body.id, req.body.brand, req.body.model, req.body.color, req.body.imei,
            req.body.ram, req.body.rom, req.body.customer_name, req.body.customer_phone,
            req.body.cost_price, req.body.sale_price, req.body.lock_system_fee || 0, req.body.commission || 0, req.body.down_payment,
            req.body.total_installments, req.body.installment_amount,
            req.body.paid_installments || 0, req.body.down_payment_date,
            req.body.next_payment_due_date, req.body.installment_type || 'partner',
            req.body.status || 'active', req.body.note, req.body.finance || '', req.body.store
        ]);

        res.status(201).json({ message: 'Installment created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update installment
router.put('/:id', async (req, res) => {
    try {
        console.log('📝 PUT /api/installments/:id - Updating installment:', req.params.id);
        console.log('📝 Received ALL data:', req.body);
        console.log('📝 Key fields:', {
            finance: req.body.finance,
            sale_price: req.body.sale_price,
            cost_price: req.body.cost_price,
            down_payment: req.body.down_payment
        });

        const query = `UPDATE installment_devices SET
            brand = ?, model = ?, color = ?, imei = ?, ram = ?, rom = ?,
            customer_name = ?, customer_phone = ?, cost_price = ?, sale_price = ?, lock_system_fee = ?,
            commission = ?, down_payment = ?, total_installments = ?, installment_amount = ?,
            down_payment_date = ?, next_payment_due_date = ?, installment_type = ?, note = ?, finance = ?, status = ?, seized_date = ?
            WHERE id = ?`;

        const values = [
            req.body.brand, req.body.model, req.body.color, req.body.imei,
            req.body.ram, req.body.rom, req.body.customer_name, req.body.customer_phone,
            req.body.cost_price, req.body.sale_price, req.body.lock_system_fee || 0, req.body.commission || 0,
            req.body.down_payment, req.body.total_installments, req.body.installment_amount,
            req.body.down_payment_date, req.body.next_payment_due_date, req.body.installment_type || 'partner',
            req.body.note, req.body.finance || '', req.body.status || 'active', req.body.seized_date || null,
            req.params.id
        ];

        console.log('📝 SQL Query:', query);
        console.log('📝 SQL Values:', values);

        const [result] = await db.query(query, values);

        console.log('✅ Update result:', result.affectedRows, 'row(s) affected');

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Installment not found' });
        }

        res.json({ 
            message: 'Installment updated successfully',
            updatedFields: {
                finance: req.body.finance,
                sale_price: req.body.sale_price
            }
        });
    } catch (error) {
        console.error('❌ Error updating installment:', error.message);
        console.error('❌ Error stack:', error.stack);
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

        // Calculate next due date: current due date + 1 month
        let nextDueDate = null;
        if (inst[0] && inst[0].next_payment_due_date) {
            const currentDue = new Date(inst[0].next_payment_due_date);
            currentDue.setMonth(currentDue.getMonth() + 1);
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

// FIX: Recalculate next_payment_due_date for all active installments
router.post('/fix-due-dates', async (req, res) => {
    try {
        // Get all active installments
        const [installments] = await db.query(
            'SELECT id, down_payment_date, paid_installments, total_installments FROM installment_devices WHERE status = ? AND paid_installments < total_installments',
            ['active']
        );

        let fixed = 0;
        for (const inst of installments) {
            if (inst.down_payment_date) {
                const downDate = new Date(inst.down_payment_date);
                const monthsToAdd = inst.paid_installments + 1;
                
                // Calculate correct next due date
                const nextDue = new Date(downDate);
                nextDue.setMonth(downDate.getMonth() + monthsToAdd);
                const nextDueDateStr = nextDue.toISOString().split('T')[0];
                
                // Update database
                await db.query(
                    'UPDATE installment_devices SET next_payment_due_date = ? WHERE id = ?',
                    [nextDueDateStr, inst.id]
                );
                fixed++;
            }
        }

        res.json({ 
            message: `Fixed ${fixed} installments`, 
            total: installments.length 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
