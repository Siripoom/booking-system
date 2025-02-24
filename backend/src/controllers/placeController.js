const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// 🔹 ดึงสถานที่ทั้งหมด
exports.getAllPlaces = async (req, res) => {
  try {
    const places = await prisma.place.findMany();
    res.json(places);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch places" });
  }
};

// 🔹 ดึงข้อมูลสถานที่ตาม ID
exports.getPlaceById = async (req, res) => {
  try {
    const place = await prisma.place.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!place) return res.status(404).json({ error: "Place not found" });
    res.json(place);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch place" });
  }
};

// 🔹 สร้างสถานที่ใหม่
exports.createPlace = async (req, res) => {
  try {
    const { name, description } = req.body;

    const newPlace = await prisma.place.create({
      data: { name, description },
    });

    res.status(201).json(newPlace);
  } catch (error) {
    res.status(500).json({ error: "Failed to create place" });
  }
};

// 🔹 อัปเดตข้อมูลสถานที่
exports.updatePlace = async (req, res) => {
  try {
    const { name, description } = req.body;

    const updatedPlace = await prisma.place.update({
      where: { id: parseInt(req.params.id) },
      data: { name, description },
    });

    res.json(updatedPlace);
  } catch (error) {
    res.status(500).json({ error: "Failed to update place" });
  }
};

// 🔹 ลบสถานที่
exports.deletePlace = async (req, res) => {
  try {
    await prisma.place.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Place deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete place" });
  }
};
