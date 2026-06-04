import { readApplicationPhotoBuffer } from "@/lib/applications/storage";
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin/auth";

interface RouteContext {
  params: Promise<{ path: string[] }>;
}

const MIME_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export async function GET(_request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return unauthorizedResponse();
  }

  const { path: pathSegments } = await context.params;
  const relative = pathSegments.join("/");

  if (!relative || relative.includes("..")) {
    return new Response("Not found", { status: 404 });
  }

  const storagePath = relative.startsWith("uploads/") ? relative : `uploads/${relative}`;
  const extension = storagePath.split(".").pop()?.toLowerCase() ?? "jpg";
  const buffer = await readApplicationPhotoBuffer(storagePath);

  if (!buffer) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": MIME_TYPES[extension] ?? "application/octet-stream",
      "Cache-Control": "private, max-age=3600",
    },
  });
}
