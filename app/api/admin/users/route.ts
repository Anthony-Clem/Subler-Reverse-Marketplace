import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

const updateUserRoleSchema = z.object({
  targetUserId: z.string(),
  role: z.enum(["renter", "admin"]),
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
    const allUsers = await db.query.users.findMany({
      orderBy: desc(users.createdAt),
    });

    return NextResponse.json(allUsers);
  } catch (error) {
    console.error("Admin fetch users error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
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
    const parsed = updateUserRoleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { targetUserId, role } = parsed.data;

    // Prevent administrators from demoting themselves to avoid lockout
    if (targetUserId === userId) {
      return NextResponse.json(
        { error: "You cannot change your own administrator role" },
        { status: 400 }
      );
    }

    const updated = await db
      .update(users)
      .set({ role })
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
    console.error("Admin update user role error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
