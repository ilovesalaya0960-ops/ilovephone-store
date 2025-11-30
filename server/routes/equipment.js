const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET all equipment
router.get('/', async (req, res) => {
    try {
        const { store } = req.query;
        let query = 'SELECT * FROM accessories';
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
        const [rows] = await db.query('SELECT * FROM accessories WHERE id = ?', [req.params.id]);
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
            INSERT INTO accessories
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
            UPDATE accessories
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
        const [rows] = await db.query('SELECT * FROM accessories WHERE id = ?', [equipmentId]);

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
            UPDATE accessories
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
        const [result] = await db.query('DELETE FROM accessories WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Equipment not found' });
        }

        res.json({ message: 'Equipment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST mark equipment as damaged (บันทึกอุปกรณ์เสียหาย)
router.post('/:id/damage', async (req, res) => {
    try {
        const { quantity, damage_date } = req.body;
        const equipmentId = req.params.id;

        // Get current equipment data
        const [rows] = await db.query('SELECT * FROM accessories WHERE id = ?', [equipmentId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Equipment not found' });
        }

        const equipment = rows[0];
        const claimQuantity = equipment.claim_quantity || 0;
        // ไม่หัก damage_quantity เพราะ damage จะลด quantity ไปแล้ว
        const availableQuantity = equipment.quantity - claimQuantity;

        console.log('📋 [damage validation]:', {
            code: equipment.code,
            quantity: equipment.quantity,
            claim_quantity: claimQuantity,
            damage_quantity: equipment.damage_quantity,
            available: availableQuantity,
            requested: quantity
        });

        // Validate quantity
        if (quantity <= 0) {
            return res.status(400).json({ error: 'Quantity must be greater than 0' });
        }

        if (quantity > availableQuantity) {
            return res.status(400).json({
                error: `Cannot mark ${quantity} items as damaged. Only ${availableQuantity} available in stock.`
            });
        }

        // Update: ลด quantity และ เพิ่ม damage_quantity พร้อมกับบันทึก damage_date
        console.log('🔴 [damage] Before update:', {
            equipmentId,
            currentQuantity: equipment.quantity,
            damageQtyToAdd: quantity,
            currentDamageQty: equipment.damage_quantity
        });
        
        const query = `
            UPDATE accessories
            SET quantity = quantity - ?,
                damage_quantity = damage_quantity + ?,
                damage_date = ?
            WHERE id = ?
        `;

        const [result] = await db.query(query, [quantity, quantity, damage_date || new Date(), equipmentId]);
        
        console.log('✅ [damage] Update result:', result);
        
        // Get updated data
        const [updatedRows] = await db.query('SELECT * FROM accessories WHERE id = ?', [equipmentId]);
        const updated = updatedRows[0];
        
        console.log('📊 [damage] After update:', {
            quantity: updated.quantity,
            damage_quantity: updated.damage_quantity,
            damage_date: updated.damage_date
        });

        res.json({
            message: 'Equipment marked as damaged successfully',
            damaged_quantity: quantity,
            remaining_quantity: updated.quantity
        });
    } catch (error) {
        console.error('Error marking equipment as damaged:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST remove equipment damage (ลบข้อมูลเสียหาย)
router.post('/:id/remove-damage', async (req, res) => {
    try {
        const equipmentId = req.params.id;

        // Get current equipment data
        const [rows] = await db.query('SELECT * FROM accessories WHERE id = ?', [equipmentId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Equipment not found' });
        }

        const equipment = rows[0];
        const damageQuantity = equipment.damage_quantity || 0;

        if (damageQuantity === 0) {
            return res.status(400).json({ error: 'No damage quantity to remove' });
        }

        // Reset damage quantity and date
        const query = `
            UPDATE accessories
            SET damage_quantity = 0,
                damage_date = NULL
            WHERE id = ?
        `;

        await db.query(query, [equipmentId]);

        res.json({
            message: 'Damage data removed successfully',
            removed_quantity: damageQuantity
        });
    } catch (error) {
        console.error('Error removing damage data:', error);
        res.status(500).json({ error: error.message });
    }
});

// PUT update equipment damage (แก้ไขข้อมูลอุปกรณ์เสียหาย)
router.put('/:id/update-damage', async (req, res) => {
    try {
        const { damage_quantity, damage_date } = req.body;
        const equipmentId = req.params.id;

        // Get current equipment data
        const [rows] = await db.query('SELECT * FROM accessories WHERE id = ?', [equipmentId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Equipment not found' });
        }

        const equipment = rows[0];

        console.log('✏️ [update-damage] Updating:', {
            equipmentId,
            code: equipment.code,
            old_damage_quantity: equipment.damage_quantity,
            new_damage_quantity: damage_quantity,
            old_damage_date: equipment.damage_date,
            new_damage_date: damage_date
        });

        // Validate quantity
        if (damage_quantity <= 0) {
            return res.status(400).json({ error: 'Damage quantity must be greater than 0' });
        }

        // Update damage_quantity and damage_date only (ไม่แก้ไข quantity/stock)
        const query = `
            UPDATE accessories
            SET damage_quantity = ?,
                damage_date = ?
            WHERE id = ?
        `;

        await db.query(query, [damage_quantity, damage_date || new Date(), equipmentId]);

        // Get updated data
        const [updatedRows] = await db.query('SELECT * FROM accessories WHERE id = ?', [equipmentId]);
        const updated = updatedRows[0];

        console.log('✅ [update-damage] Success:', {
            damage_quantity: updated.damage_quantity,
            damage_date: updated.damage_date
        });

        res.json({
            message: 'Damage data updated successfully',
            updated_data: {
                damage_quantity: updated.damage_quantity,
                damage_date: updated.damage_date
            }
        });
    } catch (error) {
        console.error('Error updating damage data:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
