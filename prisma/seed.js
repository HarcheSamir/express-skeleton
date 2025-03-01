// prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // Create admin user with hashed password
  const adminPassword = await bcrypt.hash("password", 10);
  await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@admin.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Generate multiple users with hashed passwords
  const usersData = await Promise.all(
    [
      { name: 'User One', email: 'user1@gmail.com' },
      { name: 'User Two', email: 'user2@gmail.com' },
      { name: 'User Three', email: 'user3@gmail.com' },
      { name: 'User Four', email: 'user4@gmail.com' },
      { name: 'User Five', email: 'user5@gmail.com' }
    ].map(async (user) => ({
      ...user,
      password: await bcrypt.hash("password", 10),
      role: 'USER',
    }))
  );

  // Insert users into the database
  await prisma.user.createMany({
    data: usersData,
    skipDuplicates: true,
  });

  // Fetch created users to associate with books
  const users = await prisma.user.findMany();

  // Generate 1000 different books
  const booksData = Array.from({ length: 1000 }).map(() => ({
    title: faker.lorem.words(3),
    description: faker.lorem.sentences(2),
    author: faker.person.fullName(),
    publishedAt: faker.date.past(50), // Random date in the past 50 years
  }));

  // Insert books into the database
  await prisma.book.createMany({
    data: booksData,
    skipDuplicates: true,
  });

  console.log("Database seeding completed successfully.");
}

main()
  .catch((error) => {
    console.error("Error during database seeding:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
