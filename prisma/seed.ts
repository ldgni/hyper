import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  try {
    // Create a test early access request
    const testRequest = await prisma.earlyAccessRequest.create({
      data: {
        name: "John Doe",
        email: "john.doe@example.com",
        message:
          "I'm very interested in trying out Path. I work as a developer and would love to organize my bookmarks better.",
      },
    });

    console.log("✅ Test early access request created:", testRequest);

    // Create another one that's already approved
    const approvedRequest = await prisma.earlyAccessRequest.create({
      data: {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        message:
          "I run a design agency and need a better way to organize client references and inspiration links.",
        approved: true,
      },
    });

    console.log("✅ Approved early access request created:", approvedRequest);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
