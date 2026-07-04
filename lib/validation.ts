/**
 * Input validation helpers for API routes.
 */

/** Allowed SOW file types */
const ALLOWED_EXTENSIONS = new Set(["pdf", "docx", "doc", "txt"]);
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "text/plain",
]);

/** Maximum file size: 20 MB */
export const MAX_FILE_SIZE = 20 * 1024 * 1024;

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File too large. Maximum size is 20 MB.` };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return { valid: false, error: `File type .${ext} not allowed. Accepted: PDF, DOCX, DOC, TXT.` };
  }

  if (file.type && !ALLOWED_MIME_TYPES.has(file.type)) {
    return { valid: false, error: `MIME type ${file.type} not allowed.` };
  }

  return { valid: true };
}

/** Sanitize string input — strip control chars, limit length */
export function sanitizeString(input: string, maxLength = 500): string {
  return input
    .replace(/[\x00-\x1F\x7F]/g, "")
    .trim()
    .slice(0, maxLength);
}

/** Validate email format */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

/** Validate UUID format */
export function isValidUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}
