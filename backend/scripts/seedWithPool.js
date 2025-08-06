const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function seedWithPool() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. ลบข้อมูลเดิมทั้งหมด (ถ้าต้องการ)
    await client.query(`
      DELETE FROM "Booking";
      DELETE FROM "Room";
      DELETE FROM "Activity";
      DELETE FROM "Place";
      DELETE FROM "User";
    `);

    // 2. เพิ่ม User
    const adminPassword = await bcrypt.hash('123456', 10);
    const userPassword = await bcrypt.hash('1', 10);
    
    const adminRes = await client.query(`
      INSERT INTO "User" (
        "fullName", email, password, "phoneNumber", role, "citizenId"
      ) VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING id
    `, ['admin', 'admin@gmail.com', adminPassword, '1234567890', 'ADMIN', '1234567890123']);

    const userRes = await client.query(`
      INSERT INTO "User" (
        "fullName", email, password, "phoneNumber", role, "citizenId"
      ) VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING id
    `, ['user', 'user@gmail.com', userPassword, '1234567890', 'USER', '1234567890123']);

    // 3. เพิ่ม Place
    const placeRes = await client.query(`
      INSERT INTO "Place" (name, description) 
      VALUES ($1, $2) 
      RETURNING id
    `, ['ศูนย์นนทบุรี', 'ศูนย์นนทบุรี']);

    const placeId = placeRes.rows[0].id;

    // 4. เพิ่ม Activities (ตัวอย่าง 1 activity)
    const activityRes = await client.query(`
      INSERT INTO "Activity" (
        "placeId", name, "maxPeople", price, time
      ) VALUES ($1, $2, $3, $4, $5) 
      RETURNING id
    `, [placeId, 'ว่ายน้ำ', 30, 50, ['AllDay']]);

    const activityId = activityRes.rows[0].id;

    // 5. เพิ่ม Rooms (ตัวอย่าง 2 rooms)
    await client.query(`
      INSERT INTO "Room" ("activityId", name) 
      VALUES ($1, $2)
    `, [activityId, 'สระว่ายน้ำ 1']);

    await client.query(`
      INSERT INTO "Room" ("activityId", name) 
      VALUES ($1, $2)
    `, [activityId, 'สระว่ายน้ำ 2']);

    await client.query('COMMIT');
    console.log('✅ Seed data completed successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding data:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

seedWithPool();