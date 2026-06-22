import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const processUpgradeSchema = z.object({
  targetUserId: z.string(),
  action: z.enum(["approve", "reject"]),
});

// Admin verification helper
async function verifyAdmin(userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  return user?.role === "admin";
}

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = await verifyAdmin(userId);
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // Admin retrieves all users with a "pending" host status
    const pendingUpgrades = await db.query.users.findMany({
      where: eq(users.hostStatus, "pending"),
      orderBy: users.createdAt,
    });

    return NextResponse.json(pendingUpgrades);
  } catch (error) {
    console.error("Admin fetch upgrades error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = await verifyAdmin(userId);
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = processUpgradeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { targetUserId, action } = parsed.data;

    // Map action to host status
    const targetStatus = action === "approve" ? "approved" : "rejected";

    const updated = await db
      .update(users)
      .set({ hostStatus: targetStatus })
      .where(eq(users.id, targetUserId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: "Target user not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Admin process upgrade error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
