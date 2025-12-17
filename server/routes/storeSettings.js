const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET - ดึงข้อมูลการตั้งค่าร้านค้า
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM store_settings ORDER BY id DESC LIMIT 1');
        
        if (rows.length === 0) {
            // ถ้าไม่มีข้อมูล ส่ง null กลับไป
            return res.json(null);
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching store settings:', error);
        res.status(500).json({ error: 'Failed to fetch store settings' });
    }
});

// POST - บันทึกหรืออัพเดทข้อมูลการตั้งค่าร้านค้า
router.post('/', async (req, res) => {
    try {
        const {
            storeName,
            storePhone,
            storeLine,
            storeFacebook,
            storeEmail,
            storePaymentPage,
            storeAddress,
            storeBank,
            storeBankAccountNumber,
            storeBankAccountName,
            store_logo
        } = req.body;
        
        // ตรวจสอบว่ามีข้อมูลอยู่แล้วหรือไม่
        const [existing] = await db.query('SELECT id FROM store_settings LIMIT 1');
        
        if (existing.length > 0) {
            // อัพเดทข้อมูลเดิม
            await db.query(
                `UPDATE store_settings SET 
                    store_name = ?,
                    store_phone = ?,
                    store_line = ?,
                    store_facebook = ?,
                    store_email = ?,
                    store_payment_page = ?,
                    store_address = ?,
                    store_bank = ?,
                    store_bank_account_number = ?,
                    store_bank_account_name = ?,
                    store_logo = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?`,
                [
                    storeName,
                    storePhone,
                    storeLine,
                    storeFacebook,
                    storeEmail,
                    storePaymentPage,
                    storeAddress,
                    storeBank,
                    storeBankAccountNumber,
                    storeBankAccountName,
                    store_logo,
                    existing[0].id
                ]
            );
        } else {
            // เพิ่มข้อมูลใหม่
            await db.query(
                `INSERT INTO store_settings 
                (store_name, store_phone, store_line, store_facebook, store_email, store_payment_page, store_address, store_bank, store_bank_account_number, store_bank_account_name, store_logo)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    storeName,
                    storePhone,
                    storeLine,
                    storeFacebook,
                    storeEmail,
                    storePaymentPage,
                    storeAddress,
                    storeBank,
                    storeBankAccountNumber,
                    storeBankAccountName,
                    store_logo
                ]
            );
        }
        
        res.json({ success: true, message: 'Store settings saved successfully' });
    } catch (error) {
        console.error('Error saving store settings:', error);
        res.status(500).json({ error: 'Failed to save store settings' });
    }
});

module.exports = router;

