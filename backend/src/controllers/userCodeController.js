const pool = require('../config/db'); // ตรวจสอบ path ให้ถูกต้อง

exports.createUserCode = async (req, res) => {
    const { id } = req.params;
    const { code } = req.body;
    
    if (!id || !code) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const result = await pool.query(
            'INSERT INTO "UserCode" ("userId", code) VALUES ($1, $2) RETURNING *',
            [id, code]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating user code:", error);
        res.status(500).json({ 
            error: "Failed to create user code",
            details: error.message 
        });
    }
};

exports.getUserCodes = async (req, res) => {
    const { userId } = req.params;
    
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM "UserCode" WHERE "userId" = $1',
            [userId]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching user codes:", error);
        res.status(500).json({ 
            error: "Failed to get user codes",
            details: error.message 
        });
    }
};

exports.editUserCode = async (req, res) => {
    const { id } = req.params;
    const { code } = req.body;
    
    if (!id || !code) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const result = await pool.query(
            'UPDATE "UserCode" SET code = $1 WHERE id = $2 RETURNING *',
            [code, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User code not found" });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating user code:", error);
        res.status(500).json({ 
            error: "Failed to edit user code",
            details: error.message 
        });
    }
};

exports.deleteUserCode = async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
        return res.status(400).json({ error: "User code ID is required" });
    }

    try {
        const result = await pool.query(
            'DELETE FROM "UserCode" WHERE id = $1 RETURNING *',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User code not found" });
        }
        
        res.status(204).end();
    } catch (error) {
        console.error("Error deleting user code:", error);
        res.status(500).json({ 
            error: "Failed to delete user code",
            details: error.message 
        });
    }
};