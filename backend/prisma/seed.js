const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
async function main() {
  const User = await prisma.user.create({
    data: {
      fullName: "admin",
      email: "admin@gmail.com",
      password: await bcrypt.hash("123456", 10),
      role: "ADMIN",
    },
  });

  const Place = await prisma.place.create({
    data: {
      name: "ศูนย์นนทบุรี",
      description: "ศูนย์นนทบุรี",
    },
  });

  const Activity1 = await prisma.activity.create({
    data: {
      placeId: Place.id,
      name: "ว่ายน้ำ",
      maxPeople: 10,
      price: 50,
      time: ['AllDay'],
    },
  });

  const Activity2 = await prisma.activity.create({
    data: {
      placeId: Place.id,
      name: "ฟิตเนส",
      maxPeople: 10,
      price: 50,
      time: ['AllDay'],
    },
  });

  const Activity3 = await prisma.activity.create({
    data: {
      placeId: Place.id,
      name: "แบตมินตัน",
      maxPeople: 4,
      price: 100,
      time: [
        "09.00-10.00",
        "10.00-11.00",
        "11.00-12.00",
        "12.00-13.00",
        "13.00-14.00",
        "14.00-15.00",
        "15.00-16.00",
        "16.00-17.00",
        "17.00-18.00",
        "18.00-19.00",
        "19.00-20.00",
        "20.00-21.00",
      ],
    },
  });

  const Activity4 = await prisma.activity.create({
    data: {
      placeId: Place.id,
      name: "เทเบิลเทนนิส",
      maxPeople: 4,
      price: 50,
      time: [
        "09.00-10.00",
        "10.00-11.00",
        "11.00-12.00",
        "12.00-13.00",
        "13.00-14.00",
        "14.00-15.00",
        "15.00-16.00",
        "16.00-17.00",
        "17.00-18.00",
        "18.00-19.00",
      ],
    },
  });

  const Activity5 = await prisma.activity.create({
    data: {
      placeId: Place.id,
      name: "เปตอง",
      maxPeople: 6,
      price: 100,
      time: [
        "09.00-10.00",
        "10.00-11.00",
        "11.00-12.00",
        "12.00-13.00",
        "13.00-14.00",
        "14.00-15.00",
        "15.00-16.00",
        "16.00-17.00",
        "17.00-18.00",
      ],
    },
  });

  const Activity6 = await prisma.activity.create({
    data: {
      placeId: Place.id,
      name: "โยคะ",
      maxPeople: 6,
      price: 100,
      time: [
        "09.00-10.00",
        "10.00-11.00",
        "14.00-15.00",
        "15.00-16.00",
        "16.00-17.00",
      ],
    },
  });

  const Activity7 = await prisma.activity.create({
    data: {
      placeId: Place.id,
      name: "แอโรบิค",
      maxPeople: 6,
      price: 100,
      time: [
        "09.00-10.00",
        "10.00-11.00",
        "14.00-15.00",
        "15.00-16.00",
        "16.00-17.00",
      ],
    },
  });

  const Activity8 = await prisma.activity.create({
    data: {
      placeId: Place.id,
      name: "ซุมบ้า",
      maxPeople: 6,
      price: 100,
      time: [
        "09.00-10.00",
        "10.00-11.00",
        "14.00-15.00",
        "15.00-16.00",
        "16.00-17.00",
      ],
    },
  });

  const Activity9 = await prisma.activity.create({
    data: {
      placeId: Place.id,
      name: "ลีลาศ",
      maxPeople: 6,
      price: 100,
      time: [
        "09.00-10.00",
        "10.00-11.00",
        "14.00-15.00",
        "15.00-16.00",
        "16.00-17.00",
      ],
    },
  });

  const Room1Activity1 = await prisma.room.create({
    data: {
      activityId: Activity1.id,
      name: "สระว่ายน้ำ 1",
    },
  });
  const Room2Activity1 = await prisma.room.create({
    data: {
      activityId: Activity1.id,
      name: "สระว่ายน้ำ 2",
    },
  });
  const Room3Activity1 = await prisma.room.create({
    data: {
      activityId: Activity1.id,
      name: "สระว่ายน้ำ 3",
    },
  });
  const Room4Activity1 = await prisma.room.create({
    data: {
      activityId: Activity1.id,
      name: "สระว่ายน้ำ 4",
    },
  });

  const Room1Activity2 = await prisma.room.create({
    data: {
      activityId: Activity2.id,
      name: "ห้องฟิตเนส 1",
    },
  });
  const Room2Activity2 = await prisma.room.create({
    data: {
      activityId: Activity2.id,
      name: "ห้องฟิตเนส 2",
    },
  });
  const Room3Activity2 = await prisma.room.create({
    data: {
      activityId: Activity2.id,
      name: "ห้องฟิตเนส 3",
    },
  });
  const Room4Activity2 = await prisma.room.create({
    data: {
      activityId: Activity2.id,
      name: "ห้องฟิตเนส 4",
    },
  });

  const Room1Activity3 = await prisma.room.create({
    data: {
      activityId: Activity3.id,
      name: "คอร์ดแบตมินตั้น 1",
    },
  });
  const Room2Activity3 = await prisma.room.create({
    data: {
      activityId: Activity3.id,
      name: "คอร์ดแบตมินตั้น 2",
    },
  });
  const Room3Activity3 = await prisma.room.create({
    data: {
      activityId: Activity3.id,
      name: "คอร์ดแบตมินตั้น 3",
    },
  });
  const Room4Activity3 = await prisma.room.create({
    data: {
      activityId: Activity3.id,
      name: "คอร์ดแบตมินตั้น 4",
    },
  });

  const Room1Activity4 = await prisma.room.create({
    data: {
      activityId: Activity4.id,
      name: "โต๊ะเทเบิลเทนนิส 1",
    },
  });
  const Room2Activity4 = await prisma.room.create({
    data: {
      activityId: Activity4.id,
      name: "โต๊ะเทเบิลเทนนิส 2",
    },
  });
  const Room3Activity4 = await prisma.room.create({
    data: {
      activityId: Activity4.id,
      name: "โต๊ะเทเบิลเทนนิส 3",
    },
  });
  const Room4Activity4 = await prisma.room.create({
    data: {
      activityId: Activity4.id,
      name: "โต๊ะเทเบิลเทนนิส 4",
    },
  });

  const Room1Activity5 = await prisma.room.create({
    data: {
      activityId: Activity5.id,
      name: "สนามเปตอง 1",
    },
  });
  const Room2Activity5 = await prisma.room.create({
    data: {
      activityId: Activity5.id,
      name: "สนามเปตอง 2",
    },
  });
  const Room3Activity5 = await prisma.room.create({
    data: {
      activityId: Activity5.id,
      name: "สนามเปตอง 3",
    },
  });
  const Room4Activity5 = await prisma.room.create({
    data: {
      activityId: Activity5.id,
      name: "สนามเปตอง 4",
    },
  });

  const Room1Activity6 = await prisma.room.create({
    data: {
      activityId: Activity6.id,
      name: "ห้องโยคะ 1",
    },
  });
  const Room2Activity6 = await prisma.room.create({
    data: {
      activityId: Activity6.id,
      name: "ห้องโยคะ 2",
    },
  });
  const Room3Activity6 = await prisma.room.create({
    data: {
      activityId: Activity6.id,
      name: "ห้องโยคะ 3",
    },
  });
  const Room4Activity6 = await prisma.room.create({
    data: {
      activityId: Activity6.id,
      name: "ห้องโยคะ 4",
    },
  });

  const Room1Activity7 = await prisma.room.create({
    data: {
      activityId: Activity7.id,
      name: "ห้องแอโรบิค 1",
    },
  });
  const Room2Activity7 = await prisma.room.create({
    data: {
      activityId: Activity7.id,
      name: "ห้องแอโรบิค 2",
    },
  });
  const Room3Activity7 = await prisma.room.create({
    data: {
      activityId: Activity7.id,
      name: "ห้องแอโรบิค 3",
    },
  });
  const Room4Activity7 = await prisma.room.create({
    data: {
      activityId: Activity7.id,
      name: "ห้องแอโรบิค 4",
    },
  });

  const Room1Activity8 = await prisma.room.create({
    data: {
      activityId: Activity8.id,
      name: "ห้องซุมบ้า 1",
    },
  });
  const Room2Activity8 = await prisma.room.create({
    data: {
      activityId: Activity8.id,
      name: "ห้องซุมบ้า 2",
    },
  });
  const Room3Activity8 = await prisma.room.create({
    data: {
      activityId: Activity8.id,
      name: "ห้องซุมบ้า 3",
    },
  });
  const Room4Activity8 = await prisma.room.create({
    data: {
      activityId: Activity8.id,
      name: "ห้องซุมบ้า 4",
    },
  });

  const Room1Activity9 = await prisma.room.create({
    data: {
      activityId: Activity9.id,
      name: "ห้องลีลาศ 1",
    },
  });
  const Room2Activity9 = await prisma.room.create({
    data: {
      activityId: Activity9.id,
      name: "ห้องลีลาศ 2",
    },
  });
  const Room3Activity9 = await prisma.room.create({
    data: {
      activityId: Activity9.id,
      name: "ห้องลีลาศ 3",
    },
  });
  const Room4Activity9 = await prisma.room.create({
    data: {
      activityId: Activity9.id,
      name: "ห้องลีลาศ 4",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
