const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.createUserCode = async (req, res) => {
    const { id } = req.params;
    const { code } = req.body;
    console.log("userId", id);
    console.log("code", code);
    try {
        const userCode = await prisma.userCode.create({
            data: { userId: id, code },
        });
        res.status(201).json(userCode);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to create user code" });
    }
};

exports.getUserCodes = async (req, res) => {
    const { userId } = req.params;
    try {
        const userCodes = await prisma.userCode.findMany({
            where: { userId },
        });
        if (!userCodes) return res.status(404).json({ error: "User codes not found" });

        res.status(200).json(userCodes);
    } catch (error) {
        console.error("Error fetching user codes:", error);
        res.status(500).json({ error: "Failed to get user codes" });
    }
};

exports.editUserCode = async (req, res) => {
    const { id } = req.params;
    const { codeId } = req.params;
    const { code } = req.body;
    try {
        const userCode = await prisma.userCode.update({
            where: { id: parseInt(id) },
            data: { code },
        });
        res.json(userCode);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Failed to edit user code" });
    }
};

exports.deleteUserCode = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.userCode.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).json({ message: "User code deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user code" });
    }
};




