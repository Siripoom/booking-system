const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// 🔹 ดึงห้องทั้งหมด
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      include: { activity: true }, // รวมข้อมูลกิจกรรมที่ห้องนี้อยู่
    });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
};

// 🔹 ดึงข้อมูลห้องตาม ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await prisma.room.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { activity: true }, // รวมข้อมูลกิจกรรมที่ห้องนี้อยู่
    });
    if (!room) return res.status(404).json({ error: "Room not found" });
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch room" });
  }
};

// 🔹 สร้างห้องใหม่
exports.createRoom = async (req, res) => {
  try {
    const { activityId, name } = req.body;

    // ตรวจสอบว่ากิจกรรมมีอยู่จริงหรือไม่
    const activityExists = await prisma.activity.findUnique({
      where: { id: parseInt(activityId) },
    });
    if (!activityExists)
      return res.status(400).json({ error: "Activity not found" });

    const newRoom = await prisma.room.create({
      data: { activityId: parseInt(activityId), name },
    });

    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ error: "Failed to create room" });
  }
};

// 🔹 อัปเดตข้อมูลห้อง
exports.updateRoom = async (req, res) => {
  try {
    const { activityId, name } = req.body;

    // ตรวจสอบว่ากิจกรรมมีอยู่จริงหรือไม่
    if (activityId) {
      const activityExists = await prisma.activity.findUnique({
        where: { id: parseInt(activityId) },
      });
      if (!activityExists)
        return res.status(400).json({ error: "Activity not found" });
    }

    const updatedRoom = await prisma.room.update({
      where: { id: parseInt(req.params.id) },
      data: {
        activityId: activityId ? parseInt(activityId) : undefined,
        name,
      },
    });

    res.json(updatedRoom);
  } catch (error) {
    res.status(500).json({ error: "Failed to update room" });
  }
};

// 🔹 ลบห้อง
exports.deleteRoom = async (req, res) => {
  try {
    await prisma.room.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete room" });
  }
};
