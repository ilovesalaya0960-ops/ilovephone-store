const express = require('express');
const router = express.Router();
const db = require('../config/database');

// ⚠️ IMPORTANT: Route Order Matters in Express!
// Specific routes (e.g., /claims, /cut/list, /:id/cut) MUST come BEFORE generic routes (e.g., /:id)
// Otherwise Express will match the generic route first and return 404 for specific routes.

// GET accessories in claim status (MUST be before /:id route)
router.get('/claims', async (req, res) => {
    try {
        const { store } = req.query;
        let query = 'SELECT * FROM accessories WHERE claim_quantity > 0';
        let params = [];

        if (store) {
            query += ' AND store = ?';
            params.push(store);
        }

        query += ' ORDER BY claim_date DESC';

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching claim accessories:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET accessories with cut quantity (MUST be before /:id route)
router.get('/cut/list', async (req, res) => {
    try {
        const { store } = req.query;
        let query = 'SELECT * FROM accessories WHERE cut_quantity > 0';
        let params = [];

        if (store) {
            query += ' AND store = ?';
            params.push(store);
        }

        query += ' ORDER BY cut_date DESC';

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching cut accessories:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET all accessories (stock items only)
router.get('/', async (req, res) => {
    try {
        const { store } = req.query;
        let query = 'SELECT * FROM accessories WHERE 1=1';
        let params = [];

        if (store) {
            query += ' AND store = ?';
            params.push(store);
        }

        query += ' ORDER BY created_at DESC';

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching accessories:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST cut accessory (ตัดอะไหล่) - MUST be before GET /:id
router.post('/:id/cut', async (req, res) => {
    try {
        const { quantity, price, date, note } = req.body;
        const accessoryId = req.params.id;

        // Get current accessory data
        const [rows] = await db.query('SELECT * FROM accessories WHERE id = ?', [accessoryId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Accessory not found' });
        }

        const accessory = rows[0];
        const claimQuantity = Number(accessory.claim_quantity) || 0;
        const cutQuantity = Number(accessory.cut_quantity) || 0;
        // FIX: availableQuantity should only subtract claimQuantity, not cutQuantity
        // because quantity is already reduced when cutting
        const availableQuantity = Number(accessory.quantity) - claimQuantity;

        // Validate quantity
        if (quantity <= 0) {
            return res.status(400).json({ error: 'Quantity must be greater than 0' });
        }

        if (quantity > availableQuantity) {
            return res.status(400).json({
                error: `Cannot cut ${quantity} items. Only ${availableQuantity} available in stock.`
            });
        }

        // Update: reduce quantity, increase cut_quantity, save repair_price (used as cut price), cut_date and note
        const newQuantity = Number(accessory.quantity) - quantity;
        const newCutQuantity = cutQuantity + quantity;

        const query = `
            UPDATE accessories
            SET quantity = ?,
                cut_quantity = ?,
                repair_price = ?,
                cut_date = ?,
                note = ?
            WHERE id = ?
        `;

        await db.query(query, [newQuantity, newCutQuantity, price, date, note || null, accessoryId]);

        res.json({
            message: 'Accessory cut successfully',
            cut_quantity: newCutQuantity,
            remaining: newQuantity
        });
    } catch (error) {
        console.error('Error cutting accessory:', error);
        res.status(500).json({ error: error.message });
    }
});

// PUT update cut accessory
router.put('/:id/cut', async (req, res) => {
    try {
        const { cut_quantity, repair_price, cut_date, note } = req.body;
        const accessoryId = req.params.id;

        // Get current accessory data
        const [rows] = await db.query('SELECT * FROM accessories WHERE id = ?', [accessoryId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Accessory not found' });
        }

        const accessory = rows[0];
        const oldCutQuantity = Number(accessory.cut_quantity) || 0;

        if (oldCutQuantity === 0) {
            return res.status(400).json({ error: 'No cut record found for this accessory' });
        }

        // Calculate quantity adjustment
        const quantityDifference = oldCutQuantity - cut_quantity;
        const newQuantity = Number(accessory.quantity) + quantityDifference;

        // Update accessory
        const query = `
            UPDATE accessories
            SET quantity = ?,
                cut_quantity = ?,
                repair_price = ?,
                cut_date = ?,
                note = ?
            WHERE id = ?
        `;

        await db.query(query, [newQuantity, cut_quantity, repair_price, cut_date, note, accessoryId]);

        res.json({
            message: 'Cut accessory updated successfully',
            cut_quantity: cut_quantity,
            quantity: newQuantity
        });
    } catch (error) {
        console.error('Error updating cut accessory:', error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE cut accessory (revert cut)
router.delete('/:id/cut', async (req, res) => {
    try {
        const accessoryId = req.params.id;

        // Get current accessory data
        const [rows] = await db.query('SELECT * FROM accessories WHERE id = ?', [accessoryId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Accessory not found' });
        }

        const accessory = rows[0];
        const cutQuantity = Number(accessory.cut_quantity) || 0;

        if (cutQuantity === 0) {
            return res.status(400).json({ error: 'No cut record found for this accessory' });
        }

        // Return cut quantity back to stock
        const newQuantity = Number(accessory.quantity) + cutQuantity;

        // Reset cut fields
        const query = `
            UPDATE accessories
            SET quantity = ?,
                cut_quantity = 0,
                cut_date = NULL
            WHERE id = ?
        `;

        await db.query(query, [newQuantity, accessoryId]);

        res.json({
            message: 'Cut accessory deleted successfully (quantity returned to stock)',
            returned_quantity: cutQuantity,
            new_quantity: newQuantity
        });
    } catch (error) {
        console.error('Error deleting cut accessory:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET single accessory
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM accessories WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Accessory not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create accessory
router.post('/', async (req, res) => {
    try {
        console.log('📝 POST /api/accessories - Creating new accessory');
        console.log('📝 Request body:', JSON.stringify(req.body, null, 2));
        const {
            id, type, code, brand, models, quantity, cost_price,
            repair_price, import_date, note, store
        } = req.body;

        const query = `
            INSERT INTO accessories
            (id, type, code, brand, models, quantity, claim_quantity, cost_price, repair_price, import_date, note, store)
            VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?)
        `;

        await db.query(query, [
            id, type, code, brand, models, quantity,
            cost_price, repair_price, import_date, note, store
        ]);

        res.status(201).json({ message: 'Accessory created successfully', id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update accessory
router.put('/:id', async (req, res) => {
    try {
        const {
            type, code, brand, models, quantity, cost_price,
            repair_price, import_date, note, store, claim_quantity,
            cut_quantity, cut_price, cut_date, damage_quantity, damage_date
        } = req.body;

        const query = `
            UPDATE accessories
            SET type = ?, code = ?, brand = ?, models = ?, quantity = ?, cost_price = ?,
                repair_price = ?, import_date = ?, note = ?, store = ?, claim_quantity = ?,
                cut_quantity = ?, cut_price = ?, cut_date = ?, damage_quantity = ?, damage_date = ?
            WHERE id = ?
        `;

        const [result] = await db.query(query, [
            type, code, brand, models, quantity, cost_price,
            repair_price, import_date, note, store, claim_quantity || 0,
            cut_quantity || 0, cut_price || null, cut_date || null,
            damage_quantity || 0, damage_date || null, req.params.id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Accessory not found' });
        }

        res.json({ message: 'Accessory updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE accessory
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM accessories WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Accessory not found' });
        }

        res.json({ message: 'Accessory deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST send to claim
router.post('/:id/claim', async (req, res) => {
    try {
        const { quantity } = req.body;
        const accessoryId = req.params.id;

        // Get current accessory data
        const [rows] = await db.query('SELECT * FROM accessories WHERE id = ?', [accessoryId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Accessory not found' });
        }

        const accessory = rows[0];
        const availableQuantity = accessory.quantity - accessory.claim_quantity;

        // Validate quantity
        if (quantity <= 0) {
            return res.status(400).json({ error: 'Quantity must be greater than 0' });
        }

        if (quantity > availableQuantity) {
            return res.status(400).json({
                error: `Cannot claim ${quantity} items. Only ${availableQuantity} available in stock.`
            });
        }

        // Update claim quantity and date
        const query = `
            UPDATE accessories
            SET claim_quantity = claim_quantity + ?,
                claim_date = CURRENT_DATE
            WHERE id = ?
        `;

        await db.query(query, [quantity, accessoryId]);

        res.json({
            message: 'Accessory sent to claim successfully',
            claimed_quantity: quantity
        });
    } catch (error) {
        console.error('Error sending accessory to claim:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST return from claim to stock
router.post('/:id/return-stock', async (req, res) => {
    try {
        const { quantity } = req.body;
        const accessoryId = req.params.id;

        // Get current accessory data
        const [rows] = await db.query('SELECT * FROM accessories WHERE id = ?', [accessoryId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Accessory not found' });
        }

        const accessory = rows[0];

        // Validate quantity
        if (quantity <= 0) {
            return res.status(400).json({ error: 'Quantity must be greater than 0' });
        }

        if (quantity > accessory.claim_quantity) {
            return res.status(400).json({
                error: `Cannot return ${quantity} items. Only ${accessory.claim_quantity} in claim.`
            });
        }

        // Update claim quantity
        const newClaimQuantity = accessory.claim_quantity - quantity;
        const query = `
            UPDATE accessories
            SET claim_quantity = ?,
                claim_date = ${newClaimQuantity === 0 ? 'NULL' : 'claim_date'}
            WHERE id = ?
        `;

        await db.query(query, [newClaimQuantity, accessoryId]);

        res.json({
            message: 'Accessory returned to stock successfully',
            returned_quantity: quantity
        });
    } catch (error) {
        console.error('Error returning accessory to stock:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST send to damage
router.post('/:id/damage', async (req, res) => {
    try {
        const { quantity, damage_date } = req.body;
        const accessoryId = req.params.id;

        // Get current accessory data
        const [rows] = await db.query('SELECT * FROM accessories WHERE id = ?', [accessoryId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Accessory not found' });
        }

        const accessory = rows[0];
        const claimQuantity = accessory.claim_quantity || 0;
        const damageQuantity = accessory.damage_quantity || 0;
        const availableQuantity = accessory.quantity - claimQuantity - damageQuantity;

        // Validate quantity
        if (quantity <= 0) {
            return res.status(400).json({ error: 'Quantity must be greater than 0' });
        }

        if (quantity > availableQuantity) {
            return res.status(400).json({
                error: `Cannot mark ${quantity} items as damaged. Only ${availableQuantity} available in stock.`
            });
        }

        // Update damage quantity and date
        const query = `
            UPDATE accessories
            SET damage_quantity = damage_quantity + ?,
                damage_date = ?
            WHERE id = ?
        `;

        await db.query(query, [quantity, damage_date || new Date(), accessoryId]);

        res.json({
            message: 'Accessory marked as damaged successfully',
            damaged_quantity: quantity
        });
    } catch (error) {
        console.error('Error marking accessory as damaged:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST remove damage (reset damage quantity to 0)
router.post('/:id/remove-damage', async (req, res) => {
    try {
        const accessoryId = req.params.id;

        // Get current accessory data
        const [rows] = await db.query('SELECT * FROM accessories WHERE id = ?', [accessoryId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Accessory not found' });
        }

        const accessory = rows[0];
        const damageQuantity = accessory.damage_quantity || 0;

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

        await db.query(query, [accessoryId]);

        res.json({
            message: 'Damage data removed successfully',
            removed_quantity: damageQuantity
        });
    } catch (error) {
        console.error('Error removing damage data:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
