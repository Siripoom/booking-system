const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

// 🔹 ดึงผู้ใช้ทั้งหมด
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// 🔹 ดึงข้อมูลผู้ใช้ตาม ID
exports.getUserById = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// 🔹 สร้างผู้ใช้ใหม่
exports.createUser = async (req, res) => {
  try {
    const { fullName, email, password, role,phoneNumber } = req.body;

    // ตรวจสอบว่ามีอีเมลนี้อยู่แล้วหรือไม่
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ error: "Email already exists" });

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { fullName, email, password: hashedPassword, role,phoneNumber },
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

// 🔹 อัปเดตข้อมูลผู้ใช้
exports.updateUser = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    // เข้ารหัสรหัสผ่านใหม่ (ถ้ามีการเปลี่ยนแปลง)
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        fullName,
        email,
        password: hashedPassword || undefined,
        role,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

// 🔹 ลบผู้ใช้
exports.deleteUser = async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};
