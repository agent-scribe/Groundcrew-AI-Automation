import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

// Lazy singleton – only created when first needed
let ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit | null {
  if (ratelimit) return ratelimit;

  const url = process.env.UPSTASH_REDIS_URL;
  const token = process.env.UPSTASH_REDIS_TOKEN;
  if (!url || !token) return null;

  const redis = new Redis({ url, token });

  ratelimit = new Ratelimit({
    redis,
    // 10 requests per 10 seconds sliding window
    limiter: Ratelimit.slidingWindow(10, "10 s"),
    analytics: true,
    prefix: "groundcrew",
  });

  return ratelimit;
}

/**
 * Apply rate limiting. Returns a NextResponse 429 if over limit, or null if OK.
 * Pass a unique identifier (IP, user ID, etc.).
 */
export async function applyRateLimit(
  identifier: string,
): Promise<NextResponse | null> {
  const rl = getRatelimit();
  if (!rl) return null; // no Redis configured → skip

  const { success, limit, remaining, reset } = await rl.limit(identifier);

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      },
    );
  }

  return null;
}

/**
 * Extract a usable identifier from a Request (IP or fallback).
 */
export function getIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "anonymous";
  return ip;
}
