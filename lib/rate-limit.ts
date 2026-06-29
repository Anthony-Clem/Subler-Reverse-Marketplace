import { db } from "./db";
import { rateLimits } from "@/db/schema";
import { eq } from "drizzle-orm";

interface RateLimitConfig {
  limit: number;      // Maximum requests allowed in the window
  windowMs: number;   // Window size in milliseconds
}

/**
 * Natively rate limit requests per key using Postgres database storage.
 * Falls back to "success: true" if a database error occurs (fail-open strategy).
 */
export async function rateLimit(key: string, config: RateLimitConfig) {
  const now = new Date();

  try {
    // 1. Fetch rate limit record for the key
    const record = await db.query.rateLimits.findFirst({
      where: eq(rateLimits.key, key),
    });

    // 2. If no record exists, or if current time exceeds reset time, create/reset window
    if (!record || now > record.resetTime) {
      const resetTime = new Date(now.getTime() + config.windowMs);

      await db
        .insert(rateLimits)
        .values({
          key,
          count: 1,
          resetTime,
        })
        .onConflictDoUpdate({
          target: rateLimits.key,
          set: {
            count: 1,
            resetTime,
          },
        });

      return {
        success: true,
        limit: config.limit,
        remaining: config.limit - 1,
        resetTime,
      };
    }

    // 3. If count exceeds the limit, block request
    if (record.count >= config.limit) {
      return {
        success: false,
        limit: config.limit,
        remaining: 0,
        resetTime: record.resetTime,
      };
    }

    // 4. Otherwise, increment request count
    await db
      .update(rateLimits)
      .set({
        count: record.count + 1,
      })
      .where(eq(rateLimits.key, key));

    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - (record.count + 1),
      resetTime: record.resetTime,
    };
  } catch (error) {
    // Fail open in case of database connectivity issues
    console.error("Rate limiter database error (failing open):", error);
    return {
      success: true,
      limit: config.limit,
      remaining: 1,
      resetTime: new Date(now.getTime() + config.windowMs),
    };
  }
}
