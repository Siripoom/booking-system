const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// 🔹 ดึงกิจกรรมทั้งหมด
exports.getAllActivities = async (req, res) => {
  try {
    const activities = await prisma.activity.findMany({
      include: { place: true }, // รวมข้อมูลสถานที่ของกิจกรรม
    });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch activities" });
  }
};

// 🔹 ดึงข้อมูลกิจกรรมตาม ID
exports.getActivityById = async (req, res) => {
  try {
    const activity = await prisma.activity.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { place: true }, // รวมข้อมูลสถานที่ของกิจกรรม
    });
    if (!activity) return res.status(404).json({ error: "Activity not found" });
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch activity" });
  }
};

// 🔹 สร้างกิจกรรมใหม่
exports.createActivity = async (req, res) => {
  try {
    const { placeId, name, maxPeople, price } = req.body;

    // ตรวจสอบว่าสถานที่มีอยู่จริงหรือไม่
    const placeExists = await prisma.place.findUnique({
      where: { id: parseInt(placeId) },
    });
    if (!placeExists) return res.status(400).json({ error: "Place not found" });

    const newActivity = await prisma.activity.create({
      data: {
        placeId: parseInt(placeId),
        name,
        maxPeople,
        price: parseFloat(price),
      },
    });

    res.status(201).json(newActivity);
  } catch (error) {
    res.status(500).json({ error: "Failed to create activity" });
  }
};

// 🔹 อัปเดตข้อมูลกิจกรรม
exports.updateActivity = async (req, res) => {
  try {
    const { placeId, name, maxPeople, price } = req.body;

    // ตรวจสอบว่าสถานที่มีอยู่จริงหรือไม่
    if (placeId) {
      const placeExists = await prisma.place.findUnique({
        where: { id: parseInt(placeId) },
      });
      if (!placeExists)
        return res.status(400).json({ error: "Place not found" });
    }

    const updatedActivity = await prisma.activity.update({
      where: { id: parseInt(req.params.id) },
      data: {
        placeId: placeId ? parseInt(placeId) : undefined,
        name,
        maxPeople,
        price: price ? parseFloat(price) : undefined,
      },
    });

    res.json(updatedActivity);
  } catch (error) {
    res.status(500).json({ error: "Failed to update activity" });
  }
};

// 🔹 ลบกิจกรรม
exports.deleteActivity = async (req, res) => {
  try {
    await prisma.activity.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Activity deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete activity" });
  }
};
