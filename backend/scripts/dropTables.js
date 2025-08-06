// backend/scripts/dropTables.js
const pool = require('../src/config/db');

async function dropAllTables() {
  const client = await pool.connect();
  try {
    await client.query(`
      DROP TABLE IF EXISTS 
        "Booking", 
        "Room", 
        "Activity", 
        "Place", 
        "User" CASCADE;

      DROP TYPE IF EXISTS 
        "Role", 
        "BookingStatus" CASCADE;
    `);
    console.log('🗑️ ลบตารางทั้งหมดเรียบร้อยแล้ว!');
  } catch (error) {
    console.error('❌ ลบตารางไม่สำเร็จ:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

dropAllTables();