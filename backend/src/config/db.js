const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',       // ชื่อผู้ใช้ PostgreSQL
  host: process.env.DB_HOST || '127.0.0.1',      // โฮสต์ (localhost ถ้ารันบนเครื่อง)
  database: process.env.DB_NAME || 'booking_system',    // ชื่อฐานข้อมูล
  password: process.env.DB_PASSWORD || 'password', // รหัสผ่าน
  port: process.env.DB_PORT || 5432,             // พอร์ต (default 5432)
});

module.exports = pool;