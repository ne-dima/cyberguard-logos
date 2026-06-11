import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { Application as PrismaApplication, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import {
  detectImageKind,
  extensionForImageKind,
  isMimeMatchingKind,
} from "@/lib/security/image";
import type { Application, ApplicationConsents, ApplicationStatus } from "@/types/application";

function resolveUploadsDir(): string {
  const fromEnv = process.env.UPLOADS_DIR?.trim();
  if (fromEnv) {
    return fromEnv;
  }
  return path.join(process.cwd(), "data", "uploads");
}

function toApplication(row: PrismaApplication): Application {
  return {
    id: row.id,
    fullName: row.fullName,
    birthDate: row.birthDate,
    organization: row.organization,
    phone: row.phone,
    email: row.email,
    parentContacts: row.parentContacts,
    location: row.location,
    motivationLetter: row.motivationLetter,
    photoPath: row.photoPath,
    about: row.about ?? undefined,
    wantsToEnroll: row.wantsToEnroll,
    status: row.status as ApplicationStatus,
    rejectionComment: row.rejectionComment ?? undefined,
    invitationSentAt: row.invitationSentAt?.toISOString(),
    consents: (row.consents as ApplicationConsents | null) ?? undefined,
    createdAt: row.createdAt.toISOString(),
  };
}

async function ensureUploadsDir(): Promise<void> {
  await mkdir(resolveUploadsDir(), { recursive: true });
}

export async function readApplications(): Promise<Application[]> {
  const rows = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toApplication);
}

export async function findActiveApplicationByEmail(email: string): Promise<Application | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const row = await prisma.application.findFirst({
    where: {
      email: { equals: normalizedEmail, mode: "insensitive" },
      status: { not: "rejected" },
    },
    orderBy: { createdAt: "desc" },
  });
  return row ? toApplication(row) : null;
}

export async function saveApplication(
  application: Omit<Application, "createdAt" | "status"> & { id: string },
): Promise<Application> {
  const row = await prisma.application.create({
    data: {
      id: application.id,
      fullName: application.fullName,
      birthDate: application.birthDate,
      organization: application.organization,
      phone: application.phone,
      email: application.email,
      parentContacts: application.parentContacts,
      location: application.location,
      motivationLetter: application.motivationLetter,
      photoPath: application.photoPath,
      about: application.about ?? null,
      wantsToEnroll: application.wantsToEnroll,
      consents: application.consents as Prisma.InputJsonValue | undefined,
      status: "new",
    },
  });
  return toApplication(row);
}

export async function saveApplicationPhoto(
  file: File,
  applicationId: string,
): Promise<string> {
  await ensureUploadsDir();

  const buffer = Buffer.from(await file.arrayBuffer());
  const kind = detectImageKind(buffer);

  if (!kind || !isMimeMatchingKind(file.type, kind)) {
    throw new Error("INVALID_PHOTO");
  }

  const safeExtension = extensionForImageKind(kind);
  const filename = `${applicationId}.${safeExtension}`;
  const filepath = path.join(resolveUploadsDir(), filename);

  await writeFile(filepath, buffer);

  return `uploads/${filename}`;
}

export async function getApplicationById(id: string): Promise<Application | null> {
  const row = await prisma.application.findUnique({ where: { id } });
  return row ? toApplication(row) : null;
}

export async function updateApplication(
  id: string,
  patch: Partial<Pick<Application, "status" | "rejectionComment" | "invitationSentAt">>,
): Promise<Application | null> {
  const data: Prisma.ApplicationUpdateInput = {};

  if (patch.status !== undefined) {
    data.status = patch.status;
  }
  if (patch.rejectionComment !== undefined) {
    data.rejectionComment = patch.rejectionComment;
  }
  if (patch.invitationSentAt !== undefined) {
    data.invitationSentAt = new Date(patch.invitationSentAt);
  }

  if (Object.keys(data).length === 0) {
    return getApplicationById(id);
  }

  try {
    const row = await prisma.application.update({
      where: { id },
      data,
    });
    return toApplication(row);
  } catch {
    return null;
  }
}

export async function getApplicationByEmail(email: string): Promise<Application | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const row = await prisma.application.findFirst({
    where: { email: { equals: normalizedEmail, mode: "insensitive" } },
    orderBy: { createdAt: "desc" },
  });
  return row ? toApplication(row) : null;
}

/** Resolves photo file on disk (supports UPLOADS_DIR override in Docker). */
export async function readApplicationPhotoBuffer(relativePath: string): Promise<Buffer | null> {
  const filename = relativePath.replace(/^uploads\//, "");
  const filepath = path.join(resolveUploadsDir(), filename);

  try {
    return await readFile(filepath);
  } catch {
    const legacyPath = path.join(process.cwd(), "data", relativePath);
    try {
      return await readFile(legacyPath);
    } catch {
      return null;
    }
  }
}
