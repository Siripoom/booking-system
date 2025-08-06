const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

// 🔹 ดึงผู้ใช้ทั้งหมด
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        phoneNumber: true,
        createdAt: true
      }
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      error: "Failed to fetch users",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 🔹 ดึงข้อมูลผู้ใช้ตาม ID
exports.getUserById = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ 
      error: "Failed to fetch user",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 🔹 สร้างผู้ใช้ใหม่ (แก้ไขแล้ว)
exports.createUser = async (req, res) => {
  try {
    const { fullName, email, password, role, phoneNumber, citizenId } = req.body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!fullName || !email || !password) {
      return res.status(400).json({ 
        error: "Missing required fields",
        details: {
          missingFields: {
            ...(!fullName && { fullName: "Full name is required" }),
            ...(!email && { email: "Email is required" }),
            ...(!password && { password: "Password is required" })
          }
        }
      });
    }

    // ตรวจสอบรูปแบบอีเมล
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // ตรวจสอบว่ามีอีเมลนี้อยู่แล้วหรือไม่
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: { 
        fullName, 
        email, 
        password: hashedPassword, 
        role: role || 'USER',
        phoneNumber: phoneNumber || "0000000000",
        citizenId: citizenId || "12345678910111"
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        phoneNumber: true,
        createdAt: true
      }
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ 
      error: "Failed to create user",
      details: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack
      } : undefined
    });
  }
};

// 🔹 อัปเดตข้อมูลผู้ใช้ (แก้ไขแล้ว)
exports.updateUser = async (req, res) => {
  try {
    const { fullName, email, password, role, phoneNumber, citizenId } = req.body;

    // ตรวจสอบว่ามีผู้ใช้หรือไม่
    const existingUser = await prisma.user.findUnique({
      where: { id: req.params.id }
    });
    
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // ตรวจสอบว่าอีเมลใหม่ซ้ำหรือไม่ (ถ้ามีการเปลี่ยนอีเมล)
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ error: "Email already in use" });
      }
    }

    // เตรียมข้อมูลสำหรับอัปเดต
    const updateData = {
      fullName,
      email,
      role,
      phoneNumber,
      citizenId
    };

    // ถ้ามีการเปลี่ยนรหัสผ่าน
    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: updateData,
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        phoneNumber: true,
        updatedAt: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ 
      error: "Failed to update user",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 🔹 ลบผู้ใช้ (แก้ไขแล้ว)
exports.deleteUser = async (req, res) => {
  try {
    // ตรวจสอบว่ามีผู้ใช้หรือไม่ก่อนลบ
    const user = await prisma.user.findUnique({
      where: { id: req.params.id }
    });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await prisma.user.delete({ where: { id: req.params.id } });
    
    res.json({ 
      message: "User deleted successfully",
      deletedUserId: req.params.id
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ 
      error: "Failed to delete user",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};