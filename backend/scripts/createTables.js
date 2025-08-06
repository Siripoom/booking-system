const pool = require('../src/config/db');

async function createTables() {
  const client = await pool.connect();
  try {
    // สร้าง Enum Types (เหมือนใน Prisma)
    await client.query(`
      CREATE TYPE "Role" AS ENUM ('ADMIN', 'HOST', 'STAFF', 'USER');
      CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELED');
    `);

    // สร้างตาราง User
    await client.query(`
      CREATE TABLE "User" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "fullName" VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role "Role" DEFAULT 'USER',
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "phoneNumber" VARCHAR(20),
        "citizenId" VARCHAR(20)

      );
    `);

    // สร้างตาราง Place
    await client.query(`
      CREATE TABLE "Place" (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // สร้างตาราง Activity
    await client.query(`
      CREATE TABLE "Activity" (
        id SERIAL PRIMARY KEY,
        "placeId" INTEGER NOT NULL,
        name VARCHAR(255) NOT NULL,
        "maxPeople" INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        time TEXT[] NOT NULL,
        FOREIGN KEY ("placeId") REFERENCES "Place"(id) ON DELETE CASCADE
      );
    `);

    // สร้างตาราง Room
    await client.query(`
      CREATE TABLE "Room" (
        id SERIAL PRIMARY KEY,
        "activityId" INTEGER NOT NULL,
        name VARCHAR(255) NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        FOREIGN KEY ("activityId") REFERENCES "Activity"(id) ON DELETE CASCADE
      );
    `);

    // สร้างตาราง Booking
    await client.query(`
      CREATE TABLE "Booking" (
        id SERIAL PRIMARY KEY,
        "userId" UUID NOT NULL,
        "roomId" INTEGER NOT NULL,
        "bookingDate" TIMESTAMPTZ NOT NULL,
        "numberOfPeople" INTEGER NOT NULL,
        "totalPrice" INTEGER NOT NULL,
        "bookingTime" VARCHAR(50) NOT NULL,
        "paymentSlip" TEXT NOT NULL,
        status "BookingStatus" DEFAULT 'PENDING',
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE,
        FOREIGN KEY ("roomId") REFERENCES "Room"(id) ON DELETE CASCADE
      );
    `);

    console.log('✅ Created all tables successfully!');
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

createTables();