import { randomUUID } from "node:crypto";
import { env } from "../../shared/config/env";
import { ApiError } from "../../shared/utils/apiError";

export const PRESCRIPTION_STORAGE_BUCKET = env.PRESCRIPTION_STORAGE_BUCKET;
export const PRESCRIPTION_MAX_FILE_SIZE_BYTES = 10_000_000;

export const PRESCRIPTION_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
] as const;

export type PrescriptionMimeType = (typeof PRESCRIPTION_MIME_TYPES)[number];

const extensionByMimeType: Record<PrescriptionMimeType, string> = {
  "application/pdf": ".pdf",
  "image/jpeg": ".jpg",
  "image/png": ".png",
};

function isPrescriptionMimeType(value: string): value is PrescriptionMimeType {
  return (PRESCRIPTION_MIME_TYPES as readonly string[]).includes(value);
}

function encodeObjectKey(key: string): string {
  return key.split("/").map(encodeURIComponent).join("/");
}

function normalizeFileName(fileName: string, mimeType: PrescriptionMimeType): string {
  const normalized = fileName
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .replace(/^\.+/, "")
    .slice(0, 120);

  return normalized || `prescription${extensionByMimeType[mimeType]}`;
}

export async function uploadPrescriptionDocument(
  customerId: string,
  fileName: string,
  mimeType: string,
  contents: Buffer,
) {
  if (!isPrescriptionMimeType(mimeType)) {
    throw ApiError.badRequest("Only PDF, JPEG, and PNG prescription files are supported");
  }
  if (contents.length < 1 || contents.length > PRESCRIPTION_MAX_FILE_SIZE_BYTES) {
    throw ApiError.badRequest("Prescription document must be between 1 byte and 10 MB");
  }

  const supabaseUrl = env.SUPABASE_URL?.replace(/\/+$/, "");
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw ApiError.serviceUnavailable("Prescription storage is not configured");
  }

  const objectKey = `prescriptions/${customerId}/${randomUUID()}${extensionByMimeType[mimeType]}`;
  const response = await fetch(
    `${supabaseUrl}/storage/v1/object/${PRESCRIPTION_STORAGE_BUCKET}/${encodeObjectKey(objectKey)}`,
    {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": mimeType,
        "x-upsert": "false",
        "cache-control": "3600",
      },
      body: contents,
    },
  );

  if (!response.ok) {
    console.error(`[PrescriptionStorage] Supabase upload failed with status ${response.status}`);
    throw ApiError.serviceUnavailable("Prescription document upload failed");
  }

  return {
    documentKey: objectKey,
    documentFileName: normalizeFileName(fileName, mimeType),
    documentMimeType: mimeType as PrescriptionMimeType,
    documentSizeBytes: contents.length,
  };
}
