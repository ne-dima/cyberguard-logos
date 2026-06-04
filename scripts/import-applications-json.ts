/**
 * One-time import from data/applications.json into PostgreSQL.
 * Usage: npm run db:import-json
 */
import { readFile } from "fs/promises";
import path from "path";
import type { Prisma } from "@prisma/client";
import type { ApplicationConsents, ApplicationStatus } from "../src/types/application";
import { prisma } from "../src/lib/db/prisma";

interface JsonApplication {
  id: string;
  fullName: string;
  birthDate: string;
  organization: string;
  phone: string;
  email: string;
  parentContacts: string;
  location: string;
  motivationLetter: string;
  photoPath: string;
  about?: string;
  status: ApplicationStatus;
  rejectionComment?: string;
  invitationSentAt?: string;
  consents?: ApplicationConsents;
  createdAt: string;
}

async function main() {
  const filePath = path.join(process.cwd(), "data", "applications.json");
  const raw = await readFile(filePath, "utf-8");
  const items = JSON.parse(raw) as JsonApplication[];

  if (!Array.isArray(items) || items.length === 0) {
    console.log("No applications to import.");
    return;
  }

  let imported = 0;
  let skipped = 0;

  for (const item of items) {
    const existing = await prisma.application.findUnique({ where: { id: item.id } });
    if (existing) {
      skipped += 1;
      continue;
    }

    await prisma.application.create({
      data: {
        id: item.id,
        fullName: item.fullName,
        birthDate: item.birthDate,
        organization: item.organization,
        phone: item.phone,
        email: item.email,
        parentContacts: item.parentContacts,
        location: item.location,
        motivationLetter: item.motivationLetter,
        photoPath: item.photoPath,
        about: item.about ?? null,
        status: item.status,
        rejectionComment: item.rejectionComment ?? null,
        invitationSentAt: item.invitationSentAt ? new Date(item.invitationSentAt) : null,
        consents: item.consents
          ? (item.consents as Prisma.InputJsonValue)
          : undefined,
        createdAt: new Date(item.createdAt),
      },
    });
    imported += 1;
  }

  console.log(`Import complete: ${imported} added, ${skipped} skipped (already in DB).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
